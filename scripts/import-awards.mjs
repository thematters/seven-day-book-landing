#!/usr/bin/env node
/**
 * Import Awards (Grand Slams + Participation Awards) from observablehq snapshots
 *
 * 取代舊版 import-grand-slams.mjs — 加入「參加獎」名單合併計算，產生完整
 * 大滿貫 + 參加獎 ground truth。
 *
 * 動機：
 *   - GraphQL public schema 看不到隱藏文章，會嚴重低估數字（refresh-marathoners.mjs 已驗證）
 *   - observablehq 直接 DB query 是 ground truth
 *
 * 來源：
 *   - research/freewrite-grand-slams-observablehq.json (464 用戶 / 951 期次)
 *   - research/freewrite-participation-awards-observablehq.json (336 用戶 / 427 期次)
 *
 * 產出：
 *   - src/data/freewrite-marathoners.ts
 *     - totalGrandSlams, totalUniqueGrandSlamWinners
 *     - totalParticipationAwards, totalUniqueParticipationWinners
 *     - totalUniqueAwardWinners（聯集）
 *     - Top 50 marathoners by grandSlams + 互動補 avatar
 *
 * 更新流程（每月新一期完結後）：
 *   1. observablehq → 大滿貫 history → Download JSON → 蓋掉 grand-slams JSON
 *   2. observablehq → 參加獎 history → Download JSON → 蓋掉 participation-awards JSON
 *   3. node scripts/import-awards.mjs --write
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const GS_PATH = path.join(
  REPO_ROOT,
  "research/freewrite-grand-slams-observablehq.json",
);
const PA_PATH = path.join(
  REPO_ROOT,
  "research/freewrite-participation-awards-observablehq.json",
);
const OUT = path.join(REPO_ROOT, "src/data/freewrite-marathoners.ts");
const ENDPOINT = "https://server.matters.town/graphql";

const EXCLUDED_AWARD_IDS = new Set(["6"]);

const CAMPAIGN_HASH = {
  5: "ia800figcq9y",
  6: "ybs0lqsrpmhn",
  7: "scx3f16y37v6",
  8: "8t5liudbtpup",
  9: "eqsfuc3qph6u",
  10: "x4rv6dwgk68o",
  11: "f7rpyecg32mg",
  12: "4nqnizsygmcn",
  13: "26uhbm3uh6rg",
  14: "efkk0l9hcg96",
  15: "h2ya9xxjubd2",
  16: "5zhf2bpty274",
  17: "rt04oolqbexh",
  18: "owt3jxplay6z",
  19: "3uskpxsbzmz5",
  20: "ox9fmcz6zxxj",
  21: "nqbeo3cdn585",
  22: "4v5mndkbz44v",
  23: "q48dv6ve4g2m",
  24: "aiafcgbu89p2",
  25: "wem6xy6u7okv",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const filterAwardCampaigns = (campaigns = []) =>
  campaigns.filter((cid) => !EXCLUDED_AWARD_IDS.has(String(cid)));

const normalizeAwardRows = (rows, awardKey, countKey) =>
  rows
    .map((row) => {
      const campaigns = filterAwardCampaigns(row[awardKey] || []);
      return { ...row, [awardKey]: campaigns, [countKey]: campaigns.length };
    })
    .filter((row) => row[awardKey].length > 0);

async function graphql(query, variables = {}, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      const json = await res.json();
      if (json.errors)
        throw new Error(json.errors.map((e) => e.message).join("; "));
      return json.data;
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(800 * attempt);
    }
  }
}

const USER_QUERY = `
  query($userName: String!) {
    user(input: { userName: $userName }) { userName displayName avatar }
  }
`;

async function fetchUser(userName) {
  const d = await graphql(USER_QUERY, { userName });
  return d.user;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const shouldWrite = args.has("--write");

  const rawGsRows = JSON.parse(fs.readFileSync(GS_PATH, "utf-8"));
  const rawPaRows = JSON.parse(fs.readFileSync(PA_PATH, "utf-8"));
  const gsRows = normalizeAwardRows(rawGsRows, "大滿貫", "大滿貫次數");
  const paRows = normalizeAwardRows(rawPaRows, "參加獎", "參加獎次數");

  console.log(`\n=== Import Awards ===\n`);
  console.log(`  Grand slams (大滿貫)        : ${gsRows.length} 用戶`);
  console.log(`  Participation (參加獎)      : ${paRows.length} 用戶`);
  console.log(
    `  Excluded award campaign ids : ${[...EXCLUDED_AWARD_IDS].join(", ")}`,
  );

  // 合併到單一 user map
  const users = new Map(); // userName → { grandSlams, paAwards, gsCampaigns, paCampaigns }
  for (const r of gsRows) {
    const id = r["Matters ID"];
    users.set(id, {
      userName: id,
      displayName: r["用戶名"],
      grandSlams: r["大滿貫次數"],
      gsCampaigns: r["大滿貫"],
      paAwards: 0,
      paCampaigns: [],
    });
  }
  for (const r of paRows) {
    const id = r["Matters ID"];
    if (users.has(id)) {
      const u = users.get(id);
      u.paAwards = r["參加獎次數"];
      u.paCampaigns = r["參加獎"];
    } else {
      users.set(id, {
        userName: id,
        displayName: r["用戶名"],
        grandSlams: 0,
        gsCampaigns: [],
        paAwards: r["參加獎次數"],
        paCampaigns: r["參加獎"],
      });
    }
  }

  // Totals
  const totalGrandSlams = gsRows.reduce((s, r) => s + r["大滿貫次數"], 0);
  const totalUniqueGrandSlamWinners = gsRows.length;
  const totalParticipationAwards = paRows.reduce(
    (s, r) => s + r["參加獎次數"],
    0,
  );
  const totalUniqueParticipationWinners = paRows.length;
  const totalUniqueAwardWinners = users.size; // 聯集
  const bothCount = gsRows.filter((r) =>
    paRows.some((p) => p["Matters ID"] === r["Matters ID"]),
  ).length;

  console.log(`\n=== 統計（observablehq ground truth）===`);
  console.log(
    `  大滿貫: ${totalGrandSlams} 次 / ${totalUniqueGrandSlamWinners} 位`,
  );
  console.log(
    `  參加獎: ${totalParticipationAwards} 次 / ${totalUniqueParticipationWinners} 位`,
  );
  console.log(`  獨立得獎者（聯集）: ${totalUniqueAwardWinners} 位`);
  console.log(`    其中兼具兩種獎     : ${bothCount} 位`);
  console.log(
    `    只有大滿貫         : ${totalUniqueGrandSlamWinners - bothCount} 位`,
  );
  console.log(
    `    只有參加獎         : ${totalUniqueParticipationWinners - bothCount} 位`,
  );

  // 每期分布
  const perCampaign = new Map(); // cid → { gs, pa }
  for (const r of gsRows)
    for (const cid of r["大滿貫"]) {
      if (!perCampaign.has(cid)) perCampaign.set(cid, { gs: 0, pa: 0 });
      perCampaign.get(cid).gs++;
    }
  for (const r of paRows)
    for (const cid of r["參加獎"]) {
      if (!perCampaign.has(cid)) perCampaign.set(cid, { gs: 0, pa: 0 });
      perCampaign.get(cid).pa++;
    }

  // Top 50 marathoners by 大滿貫次數 → 補 avatar
  const top = [...users.values()]
    .filter((u) => u.grandSlams > 0)
    .sort(
      (a, b) =>
        b.grandSlams - a.grandSlams ||
        b.paAwards - a.paAwards ||
        a.userName.localeCompare(b.userName),
    )
    .slice(0, 50);

  console.log(
    `\nFetching avatars for top ${top.length} from Matters GraphQL...`,
  );
  const enriched = [];
  for (const [i, u] of top.entries()) {
    let avatar = null;
    let displayName = u.displayName;
    try {
      const g = await fetchUser(u.userName);
      if (g) {
        avatar = g.avatar;
        displayName = g.displayName || displayName;
      }
    } catch {}
    // totalArticles 估算下限：大滿貫 7 篇 (三日書 3 篇) + 參加獎 4 篇 (三日書 2 篇)
    const SPECIAL_3DAY = new Set([15, 16, 17]);
    const minFromGs = u.gsCampaigns.reduce(
      (s, c) => s + (SPECIAL_3DAY.has(Number(c)) ? 3 : 7),
      0,
    );
    const minFromPa = u.paCampaigns.reduce(
      (s, c) => s + (SPECIAL_3DAY.has(Number(c)) ? 2 : 4),
      0,
    );
    enriched.push({
      ...u,
      displayName,
      avatar,
      grandSlamCampaigns: u.gsCampaigns
        .map((cid) => CAMPAIGN_HASH[Number(cid)] || `#${cid}`)
        .sort(),
      participationCampaigns: u.paCampaigns
        .map((cid) => CAMPAIGN_HASH[Number(cid)] || `#${cid}`)
        .sort(),
      totalArticles: minFromGs + minFromPa,
      campaignsParticipated: u.gsCampaigns.length + u.paCampaigns.length,
    });
    process.stdout.write(`\r  ${i + 1}/${top.length}`);
    await sleep(100);
  }
  console.log("");

  console.log(`\n=== Top 10 (by 大滿貫次數) ===`);
  for (const [i, m] of enriched.slice(0, 10).entries()) {
    console.log(
      `  ${String(i + 1).padStart(2)}. ${m.displayName.padEnd(20, "　")} 大 ${String(m.grandSlams).padStart(2)} · 參 ${String(m.paAwards).padStart(2)}`,
    );
  }

  if (!shouldWrite) {
    console.log("\n(dry-run — 加 --write)");
    return;
  }

  const ts = (v) => JSON.stringify(v);
  const today = new Date().toISOString().slice(0, 10);
  const officialCampaignIds = new Set([
    ...gsRows.flatMap((r) => r["大滿貫"]),
    ...paRows.flatMap((r) => r["參加獎"]),
  ]);
  const eventCount = officialCampaignIds.size;

  const perCampaignLines = [...perCampaign.keys()]
    .sort((a, b) => Number(a) - Number(b))
    .map((cid) => {
      const { gs, pa } = perCampaign.get(cid);
      return `  { campaign: ${String(cid).padStart(2)}, grandSlams: ${gs}, participationAwards: ${pa} },`;
    });

  const content = [
    `// 七日書馬拉松選手 + 參加獎 — ground truth from observablehq (${today})`,
    `// Source notebooks:`,
    `//   - 大滿貫: https://observablehq.com/d/3959b9c8a57f4bb9`,
    `//   - 參加獎: https://observablehq.com/d/1435251db8b44ad2`,
    `// notebook 直連 Matters prod replica DB，比 public GraphQL 完整。`,
    `// 重新匯出兩個 JSON 後 → node scripts/import-awards.mjs --write`,
    `// 排除非官方活動：三日書：寫出渴望的理想之地 (ybs0lqsrpmhn)。`,
    ``,
    `export interface Marathoner {`,
    `  userName: string;`,
    `  displayName: string;`,
    `  avatar: string | null;`,
    `  grandSlams: number;             // 拿到大滿貫的期數`,
    `  grandSlamCampaigns: string[];   // 那幾期 shortHash（早期 1-4 用 "#1"-"#4"）`,
    `  paAwards: number;               // 拿到參加獎的期數`,
    `  participationCampaigns: string[];`,
    `  /** 累計參與 = 大滿貫期 + 參加獎期 */`,
    `  campaignsParticipated: number;`,
    `  /** 至少投稿篇數下限（大滿貫 7 篇 + 參加獎 4 篇起跳估算；三日書 3 / 2） */`,
    `  totalArticles: number;`,
    `}`,
    ``,
    `export const totalGrandSlams = ${totalGrandSlams};`,
    `export const totalUniqueGrandSlamWinners = ${totalUniqueGrandSlamWinners};`,
    `export const totalParticipationAwards = ${totalParticipationAwards};`,
    `export const totalUniqueParticipationWinners = ${totalUniqueParticipationWinners};`,
    `export const totalUniqueAwardWinners = ${totalUniqueAwardWinners}; // 大滿貫 ∪ 參加獎`,
    `export const eventCount = ${eventCount};`,
    ``,
    `/** 各期大滿貫 / 參加獎 人數對照 */`,
    `export const perCampaignAwards = [`,
    ...perCampaignLines,
    `];`,
    ``,
    `/** Top 50 marathoners — 主排序 grandSlams desc，補排 paAwards */`,
    `export const marathoners: Marathoner[] = [`,
    ...enriched.map(
      (m) =>
        `  { userName: ${ts(m.userName)}, displayName: ${ts(m.displayName)}, avatar: ${m.avatar ? ts(m.avatar) : "null"}, grandSlams: ${m.grandSlams}, grandSlamCampaigns: ${ts(m.grandSlamCampaigns)}, paAwards: ${m.paAwards}, participationCampaigns: ${ts(m.participationCampaigns)}, campaignsParticipated: ${m.campaignsParticipated}, totalArticles: ${m.totalArticles} },`,
    ),
    `];`,
    ``,
  ].join("\n");

  fs.writeFileSync(OUT, content, "utf-8");
  console.log(`\n✓ 寫入 ${path.relative(REPO_ROOT, OUT)}`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
