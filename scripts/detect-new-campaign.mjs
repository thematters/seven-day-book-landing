#!/usr/bin/env node
/**
 * Detect & bootstrap a new 七日書 campaign
 *
 * 七日書官方通常每月 25 號 0:00 (台北) 公告下一期主題。本 script 每月 25 號
 * 由 GitHub Action 觸發，自動偵測新一期是否上線，並 bootstrap 資料：
 *   1. 抓 @freewrite 帳號最新 10 篇文章
 *   2. 找標題含「七日書開始報名」的最新一篇
 *   3. 從 markdown 抽 campaign event hash (matters.town/e/HASH)
 *   4. 用 GraphQL 驗證 campaign 存在 + 取寫作期月份
 *   5. 比對 research/freewrite-themes.json — 如果新一期不在，append entry
 *   6. 把 commit message / 新一期 metadata 印到 stdout（供後續 step 用）
 *
 * 寫進 themes.json 後，scrape-campaign-prompts.mjs 會自動把新期的 7 題抓進
 * freewrite-prompts.ts。最後 currentIssue 還是需要 reviewer 在 PR 內手動 update
 * （因為 prompts 文案還要看 ys 是否要再潤）
 *
 * 用法：
 *   node scripts/detect-new-campaign.mjs              # dry-run，印偵測結果
 *   node scripts/detect-new-campaign.mjs --write      # append 到 themes.json
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const THEMES_PATH = path.join(REPO_ROOT, "research/freewrite-themes.json");
const ENDPOINT = "https://server.matters.town/graphql";

async function graphql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data;
}

const FREEWRITE_LATEST_QUERY = `
  query {
    user(input: { userName: "freewrite" }) {
      articles(input: { first: 15 }) {
        edges {
          node {
            shortHash
            title
            createdAt
            cover
            summary
            contents { markdown }
          }
        }
      }
    }
  }
`;

const CAMPAIGN_QUERY = `
  query($shortHash: String!) {
    campaign(input: { shortHash: $shortHash }) {
      ... on WritingChallenge {
        id
        shortHash
        name
        writingPeriod { start end }
      }
    }
  }
`;

/** 從 markdown 抽 campaign event hash (matters.town/e/{hash}) */
function extractCampaignHash(markdown) {
  if (!markdown) return null;
  // 找第一個 matters.town/e/<hash>
  const m = markdown.match(/matters\.town\/e\/([a-z0-9]+)/i);
  return m ? m[1] : null;
}

/** 「YYYY/M」格式（與 themes.json monthLabel 一致） */
function monthLabelFromISO(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return `${d.getUTCFullYear()} / ${d.getUTCMonth() + 1 + (d.getUTCHours() >= 16 ? 1 : 0)}`;
  // 注意：寫作期 start 通常是 UTC 16:00（= 台北 00:00 隔天）。
  // 上式：若 UTC hour ≥ 16，月份 +1 跨日到台北次日。
  // 但 themes.monthLabel 是「報名月份」，不是寫作月份。改用簡單 UTC date 算月。
}

/** themes.json 是「報名月」格式：找報名月 = 寫作期 start 月份的前一個月 */
function applicationMonthLabel(writingStartISO) {
  if (!writingStartISO) return null;
  const d = new Date(writingStartISO);
  // 報名期通常在寫作期前 1 個月（5/25 公布、6/1 開寫 → 報名月 = 5 月）
  const taipei = new Date(d.getTime() + 8 * 3600 * 1000);
  const year = taipei.getUTCFullYear();
  let month = taipei.getUTCMonth() + 1 - 1; // -1 = 前一個月
  let realYear = year;
  if (month <= 0) {
    month += 12;
    realYear -= 1;
  }
  return `${realYear} / ${month}`;
}

async function main() {
  const shouldWrite = process.argv.includes("--write");
  console.log("\n=== Detect new campaign ===\n");

  const data = await graphql(FREEWRITE_LATEST_QUERY);
  const articles = data.user?.articles?.edges?.map((e) => e.node) || [];
  if (!articles.length) {
    console.error("✗ Couldn't fetch @freewrite articles");
    process.exit(1);
  }
  console.log(`Fetched ${articles.length} latest @freewrite articles`);

  // 找標題含「七日書開始報名」的最新一篇
  const regBookings = articles.filter((a) => /七日書(開始)?報名|自由寫.*?開始/.test(a.title || ""));
  if (!regBookings.length) {
    console.log("ℹ 沒找到「七日書開始報名」標題，可能新一期還沒公告");
    process.exit(0);
  }
  const latest = regBookings[0];
  console.log(`Latest registration article: ${latest.title}`);
  console.log(`  shortHash: ${latest.shortHash} / createdAt: ${latest.createdAt}`);

  // 抽 campaign event hash
  const eventHash = extractCampaignHash(latest.contents?.markdown);
  if (!eventHash) {
    console.error("✗ 找不到 matters.town/e/HASH 在公告 markdown 內");
    process.exit(1);
  }
  console.log(`  event hash: ${eventHash}`);

  // verify campaign 存在 + 拿寫作期
  const campData = await graphql(CAMPAIGN_QUERY, { shortHash: eventHash });
  if (!campData.campaign) {
    console.error(`✗ campaign ${eventHash} 不存在或不是 WritingChallenge`);
    process.exit(1);
  }
  const camp = campData.campaign;
  const writingStart = camp.writingPeriod?.start;
  console.log(`  campaign: ${camp.name}`);
  console.log(`  writingPeriod start: ${writingStart}`);

  // 讀現有 themes
  const themes = JSON.parse(fs.readFileSync(THEMES_PATH, "utf-8"));
  // 已存在？
  const exists = themes.find((t) => t.announceHref === `https://matters.town/a/${latest.shortHash}`);
  if (exists) {
    console.log(`\n✓ 期 ${exists.series} (${exists.name}) 已在 themes.json 內，無需新增`);
    process.exit(0);
  }

  // 新一期 series：S{N+1}
  const lastSeries = themes[themes.length - 1].series; // "S24"
  const nextN = Number(lastSeries.replace(/^S/, "")) + 1;
  const newSeries = `S${nextN}`;
  // 主題名稱：抽 title 內 *最後* 一個分隔符 (｜:：) 之後
  // 例：「七日書開始報名｜陪你完成人生日記：無用之用」→「無用之用」
  // 額外處理常見 prefix「陪你完成人生日記：」
  let themeName = latest.title;
  // 從右往左找最後的分隔
  const lastSep = themeName.search(/[：:｜]([^：:｜]+)$/);
  if (lastSep >= 0) {
    themeName = themeName.slice(lastSep + 1).trim();
  }
  themeName = themeName.replace(/^七日書開始報名[｜:：]?/, "").trim();

  const newEntry = {
    series: newSeries,
    monthLabel: applicationMonthLabel(writingStart),
    name: themeName,
    announceCover: latest.cover || "",
    announceHref: `https://matters.town/a/${latest.shortHash}`,
    announceSummary: latest.summary || "",
    wrapCover: "",
    wrapHref: "",
    wrapSummary: "",
    participants: null,
    newcomers: null,
    completers: null,
  };

  console.log(`\n=== 新一期 ${newSeries} entry ===`);
  console.log(JSON.stringify(newEntry, null, 2));
  // 寫作期 start 是 UTC，要 +8 小時取台北月份；對 museum FREEWRITE_CAMPAIGN_BY_MONTH 用
  const writingTaipei = writingStart
    ? new Date(new Date(writingStart).getTime() + 8 * 3600 * 1000)
    : null;
  const writingMonthTaipei = writingTaipei
    ? `${writingTaipei.getUTCFullYear()}-${String(writingTaipei.getUTCMonth() + 1).padStart(2, "0")}`
    : "?";

  console.log(`\nevent hash (for SERIES_TO_EVENT): ${eventHash}`);
  console.log(`writing month (台北時區, for FREEWRITE_CAMPAIGN_BY_MONTH key): ${writingMonthTaipei}`);

  if (!shouldWrite) {
    console.log("\n(dry-run — 加 --write 把 entry 寫進 themes.json)");
    return;
  }

  themes.push(newEntry);
  fs.writeFileSync(THEMES_PATH, JSON.stringify(themes, null, 2) + "\n", "utf-8");
  console.log(`\n✓ 已 append S${nextN} 進 themes.json`);
  console.log(`\n下一步：跑 \`node scripts/scrape-campaign-prompts.mjs --write\` 抓 7 題`);
  console.log(`再下一步（手動）：在 src/pages/index.astro 跟 src/pages/museum.astro 把:`);
  console.log(`  - SERIES_TO_EVENT 加 ${newSeries}: "${eventHash}"`);
  console.log(`  - FREEWRITE_CAMPAIGN_BY_MONTH 加 "${writingMonthTaipei}" entry`);
  console.log(`  - currentIssue 全替換（title / period / prompts）`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
