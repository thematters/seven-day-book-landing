#!/usr/bin/env node
/**
 * Sync Museum — 每月把「最新一期上線 + 上一期完結結算」一次補齊
 *
 * 在 detect-new-campaign.mjs / scrape-campaign-prompts.mjs 之後跑（refresh-monthly.yml）。
 * 把過去人手做的三塊全部自動化，最後仍由 reviewer 在 PR 內過目（不 auto-merge）：
 *
 *   ① 最新一期：抓 @freewrite 最新「七日書開始報名」公告 → campaign 寫作期 + 7 題，
 *      append allThemes 新 entry（進行中）、全替換 currentIssue、補 index.astro
 *      SERIES_TO_EVENT 與 museum.astro eligibleCampaignHashes。
 *   ② 上一期完結連結：抓 @freewrite 最新「『X』七日書完結｜大滿貫、參加獎名單」，
 *      把對應 allThemes entry 翻成「完結」+ 補 wrapHref/wrapCover/wrapSummary/
 *      participants/newcomers；themes.json 同步。
 *   ③ 上一期大滿貫累計：解析完結報告的大滿貫 / 參加獎 @ 名單，補進兩份 observablehq
 *      JSON（以官方完結報告為 per-period 來源，非 notebook；下次 notebook 重匯會覆蓋），
 *      於 import-awards.mjs CAMPAIGN_HASH 補 obs-id→hash，重跑 import-awards.mjs --write
 *      重生 freewrite-marathoners.ts。
 *
 * 設計原則：
 *   - 全程 idempotent：已套用的步驟會自動跳過（可安全重跑、可在當月任意天跑）。
 *   - 防禦式：每個 .ts/.astro 字串編輯都要求 anchor 唯一命中，否則「跳過 + 記 warning」，
 *     絕不產生壞檔；跳過的部分列進 stdout 警告 + PR body，留人工補。
 *   - currentIssue 的 prompt 文案抓得到就帶（reviewer 再潤），抓不到就留 TODO + warning。
 *
 * 用法：
 *   node scripts/sync-museum.mjs            # dry-run，印偵測 + 會做什麼，不寫檔
 *   node scripts/sync-museum.mjs --write    # 實際寫檔（含重跑 import-awards）
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const ENDPOINT = "https://server.matters.town/graphql";
const CDN = "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod";

const P = {
  campaign: path.join(ROOT, "src/data/seven-day-campaign.ts"),
  index: path.join(ROOT, "src/pages/index.astro"),
  museum: path.join(ROOT, "src/pages/museum.astro"),
  themes: path.join(ROOT, "research/freewrite-themes.json"),
  importAwards: path.join(ROOT, "scripts/import-awards.mjs"),
  gs: path.join(ROOT, "research/freewrite-grand-slams-observablehq.json"),
  pa: path.join(ROOT, "research/freewrite-participation-awards-observablehq.json"),
  prompts: path.join(ROOT, "src/data/freewrite-prompts.ts"),
};

const warnings = [];
const actions = [];
const warn = (m) => warnings.push(m);
const did = (m) => actions.push(m);

// ───────────────────────── GraphQL helpers ─────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function gql(query, variables = {}, retries = 3) {
  for (let a = 1; a <= retries; a++) {
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, variables }) });
      const j = await res.json();
      if (j.errors) throw new Error(j.errors.map((e) => e.message).join("; "));
      return j.data;
    } catch (e) { if (a === retries) throw e; await sleep(900 * a); }
  }
}
const FREEWRITE_LATEST = `query{ user(input:{userName:"freewrite"}){ articles(input:{first:25}){ edges{ node{ shortHash title createdAt cover summary contents{ markdown } } } } } }`;
const CAMPAIGN_FULL = `query($h:String!){ campaign(input:{shortHash:$h}){ ... on WritingChallenge { shortHash name cover writingPeriod{ start end } stages{ id name } } } }`;
const CAMPAIGN_ARTICLES = `query($h:String!,$after:String){ campaign(input:{shortHash:$h}){ ... on WritingChallenge { articles(input:{first:100,after:$after}){ totalCount pageInfo{ hasNextPage endCursor } edges{ node{ author{ userName } campaigns{ stage{ id } } } } } } } }`;

// ───────────────────────── parsing helpers ─────────────────────────
const DAY_KANJI = ["一", "二", "三", "四", "五", "六", "七"];
// 與 scrape-campaign-prompts.mjs 相同的題目解析
function parsePrompts(markdown, expectedDays = 7) {
  if (!markdown) return null;
  let md = markdown.replace(/<[^>]+>/g, "\n").replace(/\\\n/g, "\n");
  const anchorRegex = /(?:^|\n)(?:###\s*|\*\*\s*)?(本月題目|本期題目|七題|題目)\s*\**\s*\n/;
  const am = md.match(anchorRegex);
  if (am) md = md.slice(am.index + am[0].length);
  else { const fb = md.search(/第一天[\s：（(]/); if (fb === -1) return null; md = md.slice(fb); }
  const prompts = [];
  for (let i = 0; i < expectedDays; i++) {
    const day = DAY_KANJI[i], next = DAY_KANJI[i + 1];
    const sp = new RegExp(`(?:^|\\n)第?${day}天[^\\n]*\\n+`);
    const ep = next ? new RegExp(`(?:^|\\n)第?${next}天[^\\n]*\\n+`) : /(?:###|---|\n\n\n)/;
    const sm = md.match(sp); if (!sm) return null;
    const after = md.slice(sm.index + sm[0].length);
    const em = after.match(ep);
    const block = (em ? after.slice(0, em.index) : after).trim();
    const cleaned = block.split(/\n+/).map((s) => s.trim()).filter(Boolean).join(" ").replace(/\s+/g, " ");
    if (!cleaned) return null;
    const tm = cleaned.match(/^[^。？！]{1,40}[。？！]?/);
    const title = tm ? tm[0].replace(/[。？！]+$/u, "").trim() : cleaned.slice(0, 25);
    prompts.push({ day: `Day ${i + 1}`, title, prompt: cleaned });
  }
  return prompts;
}

// 完結報告 summary 抓「X 位文友參與」「X 位作者」
function parseCounts(summary) {
  const p = summary?.match(/(\d+)\s*位文友參與/);
  const n = summary?.match(/第一次參與的\s*(\d+)\s*位/);
  return { participants: p ? Number(p[1]) : null, newcomers: n ? Number(n[1]) : null };
}
// 完結報告大滿貫 / 參加獎 @handle 名單：抓 [@顯示名](/@handle)。
// 兩份名單以「寫滿四篇」(參加獎那段的開場句) 為界：之前 = 大滿貫、之後 = 參加獎。
// 開頭標題「獲『大滿貫』、『參與獎』名單」本身不含 @handle，不會污染大滿貫段。
function parseAwardHandles(markdown) {
  if (!markdown) return { gs: [], pa: [] };
  const md = markdown.replace(/<[^>]+>/g, "");
  let bound = md.search(/寫滿四篇|寫滿四天|參[與加]獎[」』]?(?:鏈上)?(?:參與)?憑證|可獲得「?參/);
  if (bound < 0) bound = md.length;
  const grab = (seg) => [...new Set([...seg.matchAll(/\/@([A-Za-z0-9_]+)/g)].map((m) => m[1]))];
  return { gs: grab(md.slice(0, bound)), pa: grab(md.slice(bound)) };
}

// Taipei date parts from ISO
function taipei(iso) {
  const d = new Date(new Date(iso).getTime() + 8 * 3600 * 1000);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
}

// ───────────────────────── defensive string edit ─────────────────────────
function replaceUnique(content, regex, replacer, label) {
  const matches = [...content.matchAll(new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g"))];
  if (matches.length !== 1) { warn(`[${label}] anchor 命中 ${matches.length} 次（需剛好 1），跳過自動編輯`); return { content, ok: false }; }
  return { content: content.replace(matches[0][0], replacer(matches[0])), ok: true };
}

// ───────────────────────── main ─────────────────────────
async function main() {
  const write = process.argv.includes("--write");
  console.log(`\n=== Sync Museum (${write ? "WRITE" : "dry-run"}) ===\n`);

  const fw = (await gql(FREEWRITE_LATEST)).user.articles.edges.map((e) => e.node);

  // ── 找最新「開始報名」(新一期) 與最新「完結」(上一期) ──
  const regArticle = fw.find((a) => /七日書(開始)?報名|自由寫.*開始/.test(a.title || ""));
  const wrapArticle = fw.find((a) => /「.+?」七日書完結|七日書(精彩落幕|圓滿|完結)/.test(a.title || ""));
  if (!regArticle) warn("找不到最新『七日書開始報名』公告");
  if (!wrapArticle) warn("找不到最新『七日書完結』報告");

  // ── 讀現有檔 ──
  let campaignTs = fs.readFileSync(P.campaign, "utf8");
  let indexTs = fs.readFileSync(P.index, "utf8");
  let museumTs = fs.readFileSync(P.museum, "utf8");
  let importTs = fs.readFileSync(P.importAwards, "utf8");
  const themes = JSON.parse(fs.readFileSync(P.themes, "utf8"));

  // 舊 currentIssue（= 即將完結那一期）的 eventHref / title
  const oldEventHref = campaignTs.match(/eventHref:\s*"https:\/\/matters\.town\/e\/([a-z0-9]+)"/)?.[1] || null;
  const oldTitle = campaignTs.match(/export const currentIssue = \{\s*\n\s*title:\s*"([^"]+)"/)?.[1] || null;

  // CAMPAIGN_HASH 目前最大 obs id
  const obsIds = [...importTs.matchAll(/^\s{2}(\d+):\s*"/gm)].map((m) => Number(m[1]));
  const maxObs = obsIds.length ? Math.max(...obsIds) : 25;

  // ════════════════ ② + ③ 上一期完結 ════════════════
  if (wrapArticle) {
    const wname = wrapArticle.title.match(/「(.+?)」七日書完結/)?.[1] || oldTitle;
    const counts = parseCounts(wrapArticle.summary || wrapArticle.contents?.markdown || "");
    const wrapCoverRel = (wrapArticle.cover || "").replace(/^https:\/\/imagedelivery\.net\/kDRCweMmqLnTPNlbum-pYA\/prod/, "${CDN}");
    // 完結報告內文一定有指回活動頁的 matters.town/e/HASH — 拿它當這期的 event hash（穩過 currentIssue）
    const completedHash = (wrapArticle.contents?.markdown || "").match(/matters\.town\/e\/([a-z0-9]+)/i)?.[1] || null;
    console.log(`② 完結期：「${wname}」 wrap=${wrapArticle.shortHash} event=${completedHash} 參與=${counts.participants} 新人=${counts.newcomers}`);

    // ②a allThemes 對應 entry 翻完結 + 補 wrap（精準鎖定 name 那筆且為 進行中）
    if (campaignTs.includes(`wrapHref: "https://matters.town/a/${wrapArticle.shortHash}"`)) {
      console.log("   ②a 已完結，跳過");
    } else if (wname && !campaignTs.includes(`name: "${wname}",\n    phase: "進行中"`)) {
      warn(`②a 找不到 name:"${wname}" 且 phase:"進行中" 的 allThemes entry，跳過完結翻寫`);
    } else if (wname) {
      const wrapFields =
        `    wrapCover: \`${wrapCoverRel}/public\`,\n` +
        `    wrapHref: "https://matters.town/a/${wrapArticle.shortHash}",\n` +
        `    wrapSummary: ${JSON.stringify(wrapArticle.summary || "")},\n` +
        (counts.participants != null ? `    participants: ${counts.participants},\n` : "") +
        (counts.newcomers != null ? `    newcomers: ${counts.newcomers},\n` : "");
      const r = replaceUnique(
        campaignTs,
        new RegExp(`(name: ${JSON.stringify(wname)},\\n    phase: )"進行中"(,[\\s\\S]*?)\\n  \\},`),
        (m) => `${m[1]}"完結"${m[2]}\n${wrapFields}  },`,
        "②a allThemes 完結翻寫",
      );
      if (r.ok) { campaignTs = r.content; did(`② 「${wname}」翻完結 + 補 wrap 連結 / ${counts.participants} 參與 / ${counts.newcomers} 新人`); }
    }

    // ②b themes.json 同步
    const tEntry = themes.find((t) => t.name === wname);
    if (tEntry && !tEntry.wrapHref) {
      tEntry.wrapCover = wrapArticle.cover || "";
      tEntry.wrapHref = `https://matters.town/a/${wrapArticle.shortHash}`;
      tEntry.wrapSummary = wrapArticle.summary || "";
      tEntry.participants = counts.participants;
      tEntry.newcomers = counts.newcomers;
    }

    // ③ 大滿貫 / 參加獎 累計
    const obsId = maxObs + 1;
    if (!completedHash) warn("③ 完結報告內找不到 event hash，跳過大滿貫累計");
    else if (importTs.includes(`"${completedHash}"`)) console.log(`   ③ obs（${completedHash}）已在 CAMPAIGN_HASH，跳過`);
    else {
      const { gs: gsHandles, pa: paHandles } = parseAwardHandles(wrapArticle.contents?.markdown);
      console.log(`   ③ obs ${obsId} ${completedHash}：大滿貫 ${gsHandles.length} 位、參加獎 ${paHandles.length} 位（依完結報告 @ 名單）`);
      if (gsHandles.length < 3) warn(`③ 大滿貫名單只抓到 ${gsHandles.length} 位，疑似解析失敗，跳過大滿貫累計（請人工核對完結報告）`);
      else {
        // a. 補兩份 observablehq JSON
        addAward(P.gs, gsHandles, "大滿貫", "大滿貫次數", obsId, write);
        addAward(P.pa, paHandles, "參加獎", "參加獎次數", obsId, write);
        // b. import-awards CAMPAIGN_HASH 補 obs-id→hash
        const ir = replaceUnique(importTs, /(\n  )(\d+): ("[a-z0-9]+",)(\n\};)/,
          (m) => `${m[1]}${m[2]}: ${m[3]}${m[1]}${obsId}: "${completedHash}",${m[4]}`,
          "③ CAMPAIGN_HASH 補 obs-id");
        if (ir.ok) importTs = ir.content;
        did(`③ obs ${obsId}：補大滿貫 ${gsHandles.length} / 參加獎 ${paHandles.length} 進 observablehq JSON + CAMPAIGN_HASH，待重跑 import-awards`);
      }
    }
  }

  // ════════════════ ① 最新一期 ════════════════
  if (regArticle) {
    const eventHash = (regArticle.contents?.markdown || "").match(/matters\.town\/e\/([a-z0-9]+)/i)?.[1];
    if (!eventHash) warn("① 公告 markdown 內找不到 event hash，跳過新一期");
    else if (campaignTs.includes(`eventHref: "https://matters.town/e/${eventHash}"`)) {
      console.log(`① 新一期 ${eventHash} 已是 currentIssue，跳過`);
    } else {
      const camp = (await gql(CAMPAIGN_FULL, { h: eventHash })).campaign;
      const name = regArticle.title.replace(/^.*[：:｜]/, "").trim();
      const ws = taipei(camp.writingPeriod.start), we = taipei(camp.writingPeriod.end);
      const monthLabel = `${ws.y} / ${ws.m}`;
      const period = `${ws.y}/${ws.m}/${ws.d} - ${we.y}/${we.m}/${we.d}`;
      const announceCoverRel = (regArticle.cover || "").replace(/^https:\/\/imagedelivery\.net\/kDRCweMmqLnTPNlbum-pYA\/prod/, "${CDN}");
      const lastSeries = [...campaignTs.matchAll(/series: "S(\d+)"/g)].map((m) => Number(m[1]));
      const newSeries = `S${Math.max(...lastSeries) + 1}`;
      console.log(`① 新一期 ${newSeries}「${name}」event=${eventHash} 寫作期=${period}`);

      // prompts：先 parse 公告 markdown
      let prompts = parsePrompts(regArticle.contents?.markdown, 7);
      if (!prompts) warn(`① 「${name}」7 題自動解析失敗 — currentIssue.prompts 留 TODO，請從公告手動補`);

      // ①a allThemes append 新 entry（進行中）
      if (!campaignTs.includes(`name: "${name}",\n    phase: "進行中"`)) {
        const newTheme =
          `  {\n    series: "${newSeries}",\n    monthLabel: "${monthLabel}",\n    name: "${name}",\n` +
          `    phase: "進行中",\n    announceCover: \`${announceCoverRel}/public\`,\n` +
          `    announceHref: "https://matters.town/a/${regArticle.shortHash}",\n` +
          `    announceSummary: ${JSON.stringify(regArticle.summary || "")},\n  },\n`;
        const r = replaceUnique(campaignTs, /(\n  \},)\n(\];\n\nexport const currentTheme = allThemes)/,
          (m) => `${m[1]}\n${newTheme}${m[2]}`, "①a allThemes append");
        if (r.ok) { campaignTs = r.content; did(`① allThemes append ${newSeries}「${name}」（進行中）`); }
      }

      // ①b 全替換 CURRENT_COVER + currentIssue
      const promptLines = (prompts || Array.from({ length: 7 }, (_, i) => ({ day: `Day ${i + 1}`, title: "TODO", prompt: "TODO：請從公告補本題" })))
        .map((p, i) => {
          const dd = new Date(new Date(camp.writingPeriod.start).getTime() + 8 * 3600 * 1000 + i * 86400000);
          const date = `${dd.getUTCMonth() + 1}/${dd.getUTCDate()}`;
          return `    { day: "${p.day}", date: "${date}", state: "upcoming", title: ${JSON.stringify(p.title)},\n      prompt: ${JSON.stringify(p.prompt)} },`;
        }).join("\n");
      const newCurrent =
        `const CURRENT_COVER = \`${announceCoverRel}/public\`;\n\n` +
        `export const currentIssue = {\n  title: "${name}",\n  status: "進行中",\n  period: "${period}",\n` +
        `  participants: "—",\n  eventHref: "https://matters.town/e/${eventHash}",\n` +
        `  announcementHref: "https://matters.town/a/${regArticle.shortHash}",\n` +
        `  cover: CURRENT_COVER,\n  heroCover: CURRENT_COVER,\n  originalCover: CURRENT_COVER,\n` +
        `  summary:\n    ${JSON.stringify(regArticle.summary || "")},\n` +
        `  // state 由 page 上 inline script 根據 today vs prompt.date 動態算（past/today/locked）\n` +
        `  // 這裡 hardcode "upcoming" 表示「報名期，寫作還沒開始」\n  prompts: [\n${promptLines}\n  ],\n};`;
      const r2 = replaceUnique(campaignTs, /const CURRENT_COVER = `[\s\S]*?\n\};/,
        () => newCurrent, "①b currentIssue 全替換");
      if (r2.ok) { campaignTs = r2.content; did(`① currentIssue 全替換為「${name}」${prompts ? "（含 7 題，文案待 review）" : "（⚠ 7 題待人工補）"}`); }

      // ①c index.astro SERIES_TO_EVENT
      if (!indexTs.includes(`"${eventHash}"`)) {
        const cleaned = indexTs.replace(/( \/\/ obs \d+ [^\n]*?) \(current\)/g, "$1");
        const newObs = maxObs + 1 + (wrapArticle ? 1 : 0); // 新一期 obs = 完結那期 obs +1
        const ir = replaceUnique(cleaned, /(\n          S\d+: "[a-z0-9]+",[^\n]*)(\n        \};)/,
          (m) => `${m[1]}\n          ${newSeries}: "${eventHash}",  // obs ${newObs} ${name} (current)${m[2]}`,
          "①c SERIES_TO_EVENT");
        if (ir.ok) { indexTs = ir.content; did(`① index.astro SERIES_TO_EVENT 補 ${newSeries}`); }
      }

      // ①d museum.astro eligibleCampaignHashes（用後接的 excludedCampaignHashes 鎖定該陣列尾，
      //    避免命中 excludedCampaignHashes 自己的結尾）
      if (!museumTs.includes(`"${eventHash}"`)) {
        const mr = replaceUnique(museumTs, /(\n  "[a-z0-9]+", \/\/ [^\n]*)(\n\];\n\nconst excludedCampaignHashes)/,
          (m) => `${m[1]}\n  "${eventHash}", // ${name}${m[2]}`, "①d eligibleCampaignHashes");
        if (mr.ok) { museumTs = mr.content; did(`① museum.astro eligibleCampaignHashes 補「${name}」`); }
      }
    }
  }

  // ── 輸出 ──
  console.log("\n=== 會做 / 已做 ===");
  actions.forEach((a) => console.log("  ✓ " + a));
  if (!actions.length) console.log("  （無變動 — 可能本月已全部套用）");
  if (warnings.length) { console.log("\n=== ⚠ 需人工注意 ==="); warnings.forEach((w) => console.log("  ! " + w)); }

  if (!write) { console.log("\n(dry-run — 加 --write 實際寫檔)"); return; }

  fs.writeFileSync(P.campaign, campaignTs);
  fs.writeFileSync(P.index, indexTs);
  fs.writeFileSync(P.museum, museumTs);
  fs.writeFileSync(P.importAwards, importTs);
  fs.writeFileSync(P.themes, JSON.stringify(themes, null, 2) + "\n");

  // 重跑 import-awards 重生 marathoners（③ 真正生效）
  if (actions.some((a) => a.startsWith("③"))) {
    console.log("\n重跑 import-awards.mjs --write …");
    execFileSync("node", [path.join(ROOT, "scripts/import-awards.mjs"), "--write"], { stdio: "inherit", cwd: ROOT });
  }
  console.log("\n✓ 寫檔完成。請 npm run build 驗證後開 PR。");
}

// 把 obs-id 補進某位 award winner（或新增 row），idempotent
function addAward(file, handles, key, countKey, obsId, write) {
  const rows = JSON.parse(fs.readFileSync(file, "utf8"));
  const byId = new Map(rows.map((r) => [r["Matters ID"], r]));
  let added = 0;
  for (const h of handles) {
    let r = byId.get(h);
    if (!r) { r = { "Matters ID": h, "用戶名": h, "註冊時間": null, "郵箱": null, "錢包地址": null, [countKey]: 0, [key]: [] }; rows.push(r); byId.set(h, r); }
    if (!Array.isArray(r[key])) r[key] = [];
    if (!r[key].map(String).includes(String(obsId))) { r[key].push(String(obsId)); r[countKey] = r[key].length; added++; }
  }
  if (write) fs.writeFileSync(file, JSON.stringify(rows) + "\n");
  console.log(`     ${path.basename(file)}: +${added} 筆 obs-${obsId}`);
}

main().catch((e) => { console.error("Failed:", e); process.exit(1); });
