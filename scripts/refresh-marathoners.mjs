#!/usr/bin/env node
/**
 * Refresh Marathoners — 從 Matters GraphQL 重算大滿貫與參加獎統計
 *
 * 動機：
 *   - 原本 src/data/freewrite-marathoners.ts 由 research/freewrite-marathoners.json
 *     手動產出（2026-05-09），到 2026 年下半已嚴重落後。
 *   - 同事 ys 反映「189 枚大滿貫」是 2024 第四期數字，需自動跟著資料庫更新。
 *   - 之前用 observablehq notebook 直連 Matters prod replica DB 算，每月手跑。
 *
 * 本 script 改用 Matters 公開 GraphQL `server.matters.town/graphql`：
 *   1. 對 25 期 campaign 逐一 paginate 撈 articles
 *   2. 每篇 article 有 author + campaigns[].stage（投在哪一天）
 *   3. group by (campaign, author)，count distinct stages
 *   4. stages.length === campaign.stages.length → 大滿貫
 *   5. stages.length >= 4 但 < total → 參加獎（七日書）
 *      或 stages.length >= event.minStages 但 < total → 參加獎（三日書）
 *
 * 用法：
 *   node scripts/refresh-marathoners.mjs            # dry-run，印出統計到 stdout
 *   node scripts/refresh-marathoners.mjs --write    # 同時覆寫 src/data/freewrite-marathoners.ts
 *
 * 排程：.github/workflows/refresh-marathoners.yml 每週一執行，會自動開 PR
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const ENDPOINT = "https://server.matters.town/graphql";

/**
 * 25 期 campaign 對照表
 * - shortHash 來源：observablehq notebook `events` 陣列；錯的 hash 用 GraphQL 驗證後修正
 * - 1–4 期：早期沒有 campaign.shortHash（campaign 模組之前的活動），跳過
 * - 6, 14, 15, 16 期：三日書 / 特殊期，stages.length 會 < 7
 *
 * 新一期上線時，只要加入新的 entry，重跑即可自動納入計算。
 */
const EXCLUDED_CAMPAIGN_HASHES = new Set([
  "2hb97w8rdn7k", // 七日書：生與死的二重奏
  "kn7h01eku617", // 七日書：生命裡的煩惱二三事
  "ybs0lqsrpmhn", // 三日書：寫出渴望的理想之地
]);

const CAMPAIGNS = [
  { id: 25, shortHash: "wem6xy6u7okv", label: "我的職場人格" },
  { id: 24, shortHash: "aiafcgbu89p2", label: "氣味博物館" },
  { id: 23, shortHash: "q48dv6ve4g2m", label: "我的人生帳本" },
  { id: 22, shortHash: "4v5mndkbz44v", label: "數位雲端的我" },
  { id: 21, shortHash: "nqbeo3cdn585", label: "衣櫥裡的自我" },
  { id: 20, shortHash: "ox9fmcz6zxxj", label: "說聲告別" },
  { id: 19, shortHash: "3uskpxsbzmz5", label: "重構生活" },
  { id: 18, shortHash: "owt3jxplay6z", label: "曖昧時刻" },
  {
    id: 17,
    shortHash: "rt04oolqbexh",
    label: "兩廳院三日書 9 月",
    special: true,
  },
  {
    id: 16,
    shortHash: "5zhf2bpty274",
    label: "兩廳院三日書 8 月",
    special: true,
  },
  { id: 15, shortHash: "h2ya9xxjubd2", label: "燃燒自我的故事", special: true },
  { id: 14, shortHash: "efkk0l9hcg96", label: "What If 人生有如果" },
  { id: 13, shortHash: "26uhbm3uh6rg", label: "寫作，給人生的靈魂提問" },
  { id: 12, shortHash: "4nqnizsygmcn", label: "書寫地方" },
  { id: 11, shortHash: "f7rpyecg32mg", label: "我的家庭故事" },
  { id: 10, shortHash: "x4rv6dwgk68o", label: "人間鬼故事" },
  { id: 9, shortHash: "eqsfuc3qph6u", label: "我的（不）完美人生" },
  { id: 8, shortHash: "8t5liudbtpup", label: "物的體系" },
  { id: 7, shortHash: "scx3f16y37v6", label: "島嶼精神" },
  { id: 5, shortHash: "ia800figcq9y", label: "成長七日書" },
  // 1–4 期沒有 campaign hash，跳過（早於 Matters campaign 模組）
].filter((campaign) => !EXCLUDED_CAMPAIGN_HASHES.has(campaign.shortHash));

const PARTICIPATION_MIN_STAGES = 4; // 參加獎門檻：投過 N 天以上

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function graphql(query, variables = {}, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      const json = await res.json();
      if (json.errors) {
        throw new Error(
          `GraphQL: ${json.errors.map((e) => e.message).join("; ")}`,
        );
      }
      return json.data;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`  ⚠ retry ${attempt}/${retries} after ${err.message}`);
      await sleep(1500 * attempt);
    }
  }
}

const CAMPAIGN_META_QUERY = `
  query($shortHash: String!) {
    campaign(input: { shortHash: $shortHash }) {
      ... on WritingChallenge {
        id
        name
        stages { id name }
      }
    }
  }
`;

// Matters GraphQL 2026 update: first 改為 first_Int_min_0 不再接 Int!；改 inline
const CAMPAIGN_ARTICLES_QUERY = `
  query($shortHash: String!, $after: String) {
    campaign(input: { shortHash: $shortHash }) {
      ... on WritingChallenge {
        articles(input: { first: 100, after: $after }) {
          totalCount
          pageInfo { hasNextPage endCursor }
          edges {
            node {
              shortHash
              author { userName displayName avatar }
              campaigns { stage { id name } }
            }
          }
        }
      }
    }
  }
`;

/** 撈一期 campaign 的 stage 列表 + 所有 article（paginate） */
async function fetchCampaignData(campaign) {
  const meta = await graphql(CAMPAIGN_META_QUERY, {
    shortHash: campaign.shortHash,
  });
  if (!meta.campaign) {
    console.warn(
      `  ⚠ ${campaign.shortHash} (${campaign.label}) returned null campaign`,
    );
    return null;
  }
  const stageIds = meta.campaign.stages.map((s) => s.id);
  const articles = [];
  let after = null;
  // PAGE_SIZE 已 inline 在 CAMPAIGN_ARTICLES_QUERY (=100)，這裡不再傳 variable
  while (true) {
    const data = await graphql(CAMPAIGN_ARTICLES_QUERY, {
      shortHash: campaign.shortHash,
      after,
    });
    const conn = data.campaign?.articles;
    if (!conn) break;
    for (const { node } of conn.edges) articles.push(node);
    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
    await sleep(120); // 對 GraphQL 客氣一點
  }
  return {
    ...campaign,
    name: meta.campaign.name,
    stageIds,
    stageCount: stageIds.length,
    articles,
  };
}

/** 從 campaign articles 計算每個 author 投了哪些 stage */
function tallyAuthors(campaignData) {
  const byAuthor = new Map(); // userName → { displayName, avatar, stageIds: Set }
  for (const article of campaignData.articles) {
    const userName = article.author?.userName;
    if (!userName) continue;
    const stageId = article.campaigns?.[0]?.stage?.id;
    if (!stageId) continue;
    // 確保 stage 屬於本期（GraphQL 撈 campaign.articles 應該已 filter，但保險）
    if (!campaignData.stageIds.includes(stageId)) continue;
    if (!byAuthor.has(userName)) {
      byAuthor.set(userName, {
        userName,
        displayName: article.author.displayName,
        avatar: article.author.avatar,
        stageIds: new Set(),
      });
    }
    byAuthor.get(userName).stageIds.add(stageId);
  }
  return byAuthor;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const shouldWrite = args.has("--write");

  console.log(`\n=== Refresh Marathoners — ${new Date().toISOString()} ===\n`);
  console.log(`Campaigns to process: ${CAMPAIGNS.length}`);
  console.log(
    `Excluded campaign hashes: ${[...EXCLUDED_CAMPAIGN_HASHES].join(", ")}\n`,
  );

  // userName → { ..., grandSlams: number, grandSlamCampaigns: shortHash[], totalArticles: number, campaigns: shortHash[] }
  const allAuthors = new Map();
  let totalGrandSlams = 0;
  let totalParticipationAwards = 0;
  const perCampaign = [];

  for (const camp of CAMPAIGNS) {
    process.stdout.write(
      `  [#${String(camp.id).padStart(2, " ")}] ${camp.label.padEnd(20)}`,
    );
    const data = await fetchCampaignData(camp);
    if (!data) {
      console.log("  (skipped — no data)");
      continue;
    }
    const tally = tallyAuthors(data);
    let grandSlams = 0;
    let participation = 0;
    for (const author of tally.values()) {
      const submitted = author.stageIds.size;
      if (submitted >= data.stageCount) {
        grandSlams++;
        // 累計到 author 全域
        if (!allAuthors.has(author.userName)) {
          allAuthors.set(author.userName, {
            userName: author.userName,
            displayName: author.displayName,
            avatar: author.avatar,
            grandSlams: 0,
            grandSlamCampaigns: [],
            totalArticles: 0,
            campaigns: new Set(),
          });
        }
        const a = allAuthors.get(author.userName);
        a.grandSlams++;
        a.grandSlamCampaigns.push(camp.shortHash);
      } else if (submitted >= PARTICIPATION_MIN_STAGES) {
        participation++;
      }
      // 不管哪一級，都統計 totalArticles + campaigns
      if (!allAuthors.has(author.userName)) {
        allAuthors.set(author.userName, {
          userName: author.userName,
          displayName: author.displayName,
          avatar: author.avatar,
          grandSlams: 0,
          grandSlamCampaigns: [],
          totalArticles: 0,
          campaigns: new Set(),
        });
      }
      const a = allAuthors.get(author.userName);
      a.totalArticles += submitted;
      a.campaigns.add(camp.shortHash);
    }
    totalGrandSlams += grandSlams;
    totalParticipationAwards += participation;
    perCampaign.push({
      ...camp,
      stageCount: data.stageCount,
      articleCount: data.articles.length,
      authorCount: tally.size,
      grandSlams,
      participation,
    });
    console.log(
      `  ${String(data.articles.length).padStart(4)} 篇 / ${String(tally.size).padStart(3)} 作者 / ${String(grandSlams).padStart(3)} 大滿貫 / ${String(participation).padStart(3)} 參加獎`,
    );
  }

  // 統計總覽
  console.log("\n=== 總覽 ===");
  console.log(`  總大滿貫次數     : ${totalGrandSlams}`);
  console.log(`  總參加獎次數     : ${totalParticipationAwards}`);
  console.log(`  獨立作者         : ${allAuthors.size}`);
  console.log(
    `  曾拿過 ≥1 次大滿貫: ${[...allAuthors.values()].filter((a) => a.grandSlams > 0).length}`,
  );

  // Top-50 marathoners（按 grandSlams desc, totalArticles desc）
  const marathoners = [...allAuthors.values()]
    .map((a) => ({
      userName: a.userName,
      displayName: a.displayName,
      avatar: a.avatar,
      totalArticles: a.totalArticles,
      campaignsParticipated: a.campaigns.size,
      grandSlams: a.grandSlams,
      grandSlamCampaigns: a.grandSlamCampaigns.sort(),
    }))
    .sort(
      (x, y) =>
        y.grandSlams - x.grandSlams || y.totalArticles - x.totalArticles,
    )
    .slice(0, 50);

  console.log(`\n=== Top 10 ===`);
  for (const [i, m] of marathoners.slice(0, 10).entries()) {
    console.log(
      `  ${String(i + 1).padStart(2, " ")}. ${(m.displayName || m.userName).padEnd(20, "　")} ${String(m.grandSlams).padStart(2)} 大滿貫 / ${String(m.totalArticles).padStart(3)} 篇`,
    );
  }

  if (shouldWrite) {
    const outPath = path.join(REPO_ROOT, "src/data/freewrite-marathoners.ts");
    const today = new Date().toISOString().slice(0, 10);
    const ts = (val) => JSON.stringify(val);
    const lines = [
      `// 七日書馬拉松選手 — 由 scripts/refresh-marathoners.mjs 自動產生 (${today})`,
      `// 抓取自 Matters GraphQL public schema (server.matters.town/graphql)`,
      `// 計算邏輯：對每期 campaign 撈所有 articles → group by author → count distinct stages`,
      `// 大滿貫 = 投全部 N 個 stage；參加獎 = 投 ≥ ${PARTICIPATION_MIN_STAGES} 個但 < N 個`,
      ``,
      `export interface Marathoner {`,
      `  userName: string;`,
      `  displayName: string;`,
      `  avatar: string | null;`,
      `  totalArticles: number;       // 累積投稿總篇數（含未獲大滿貫的期）`,
      `  campaignsParticipated: number; // 參與過幾期`,
      `  grandSlams: number;          // 拿到大滿貫的期數`,
      `  grandSlamCampaigns: string[];  // 那幾期 campaign shortHash`,
      `}`,
      ``,
      `export const totalGrandSlams = ${totalGrandSlams};`,
      `export const totalParticipationAwards = ${totalParticipationAwards};`,
      `export const totalAuthorsWithArticles = ${allAuthors.size};`,
      `export const eventCount = ${CAMPAIGNS.length};`,
      ``,
      `export const marathoners: Marathoner[] = [`,
      ...marathoners.map(
        (m) =>
          `  { userName: ${ts(m.userName)}, displayName: ${ts(m.displayName || m.userName)}, avatar: ${m.avatar ? ts(m.avatar) : "null"}, totalArticles: ${m.totalArticles}, campaignsParticipated: ${m.campaignsParticipated}, grandSlams: ${m.grandSlams}, grandSlamCampaigns: ${ts(m.grandSlamCampaigns)} },`,
      ),
      `];`,
      ``,
    ];
    fs.writeFileSync(outPath, lines.join("\n"), "utf-8");
    console.log(`\n✓ 寫入 ${path.relative(REPO_ROOT, outPath)}`);
  } else {
    console.log(
      `\n(dry-run — 不寫檔；加 --write 可寫入 src/data/freewrite-marathoners.ts)`,
    );
  }
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
