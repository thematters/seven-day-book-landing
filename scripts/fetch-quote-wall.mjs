#!/usr/bin/env node
/**
 * Fetch Quote Wall（金句牆資料抓取）
 *
 * 從 Matters 公開 GraphQL 把各期七日書「上牆」的金句（階段 3 的 quote 資料）
 * 撈下來，寫進 src/data/quote-wall.ts，供 memo-wall.astro 靜態渲染。
 *
 * 與既有 curate-community-quotes.mjs 的差別：
 *   - curate：從「精選文章」用演算法自動「摘」句（系統挑的）
 *   - 本腳本：抓使用者「真的選了上牆」的金句（社群挑的）→ 這才是 Memo Wall 的內容
 *
 * 資料流（沿用 repo 既有慣例）：
 *   scripts/*.mjs（打 Matters public GraphQL，無需密鑰）
 *     → src/data/quote-wall.ts（靜態資料檔）
 *     → GitHub Action 定期重跑 + 開 PR（.github/workflows/refresh-quote-wall.yml）
 *     → Astro 靜態 build
 *
 * 用法：
 *   node scripts/fetch-quote-wall.mjs              # dry-run，印出統計
 *   node scripts/fetch-quote-wall.mjs --write      # 寫入 src/data/quote-wall.ts
 *
 * 依賴：階段 3 後端（WritingChallenge.quotes / quoteCount）需先部署上線，
 *       否則 quotes 會是空的（腳本仍會正常跑、寫出空牆）。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const ENDPOINT = "https://server.matters.town/graphql";
// 七日書各期 campaign 清單（沿用 curate 腳本同一份來源）
const FEATURED_JSON = path.join(REPO_ROOT, "research/freewrite-featured.json");
const OUT_TS = path.join(REPO_ROOT, "src/data/quote-wall.ts");

// 每期最多抓幾則（牆是隨機抽樣展示，不需要全部；可調）
const PER_CAMPAIGN_LIMIT = 100;

const QUOTES_QUERY = `
  query ($shortHash: String!, $first: Int!) {
    campaign(input: { shortHash: $shortHash }) {
      ... on WritingChallenge {
        name(input: { language: zh_hant })
        quoteCount
        quotes(input: { first: $first }) {
          edges {
            node {
              id
              content
              createdAt
              poster { userName displayName }
              article { shortHash title author { userName } }
            }
          }
        }
      }
    }
  }
`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchQuotes(shortHash) {
  // 單期失敗（HTTP 非 2xx / 回應不是 JSON / 網路錯誤）只警告、視為 0 則，
  // 不中斷整支腳本 — 與下方 GraphQL errors 的 per-campaign fallback 同一模式。
  let json;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: QUOTES_QUERY,
        variables: { shortHash, first: PER_CAMPAIGN_LIMIT },
      }),
    });
    if (!res.ok) {
      console.warn(`  ⚠ ${shortHash}: HTTP ${res.status} ${res.statusText}`);
      return { name: null, quotes: [] };
    }
    json = await res.json();
  } catch (e) {
    console.warn(`  ⚠ ${shortHash}: ${e.message}`);
    return { name: null, quotes: [] };
  }
  if (json.errors) {
    // 階段 3 未上線時 quotes 欄位可能不存在 → 視為該期 0 則，不中斷
    console.warn(`  ⚠ ${shortHash}: ${json.errors[0].message}`);
    return { name: null, quotes: [] };
  }
  const c = json.data?.campaign;
  if (!c) return { name: null, quotes: [] };
  return {
    name: c.name,
    quotes: (c.quotes?.edges || []).map((e) => e.node),
  };
}

function loadCampaigns() {
  if (!fs.existsSync(FEATURED_JSON)) {
    throw new Error(`找不到 ${FEATURED_JSON}（campaign 清單來源）`);
  }
  const data = JSON.parse(fs.readFileSync(FEATURED_JSON, "utf-8"));
  // shape: { campaigns: [{ shortHash, name, ... }] }
  return (data.campaigns || []).filter((c) => c.shortHash);
}

function toItem(node, campaignName) {
  return {
    id: node.id,
    content: node.content,
    // 顯示用作者名（原文作者）；poster 是「貼上牆的人」
    author: node.article?.author?.userName || "",
    articleTitle: node.article?.title || "",
    articleHash: node.article?.shortHash || "",
    campaignName: campaignName || "",
    createdAt: node.createdAt || "",
  };
}

async function main() {
  const write = process.argv.includes("--write");
  const campaigns = loadCampaigns();
  console.log(`抓取 ${campaigns.length} 期的金句牆…`);

  const items = [];
  for (const camp of campaigns) {
    const { name, quotes } = await fetchQuotes(camp.shortHash);
    const campaignName = name || camp.name || "";
    for (const node of quotes) {
      items.push(toItem(node, campaignName));
    }
    console.log(`  ${campaignName || camp.shortHash}: ${quotes.length} 則`);
    await sleep(200); // 對 API 客氣一點
  }

  console.log(`\n共 ${items.length} 則金句。`);

  if (!write) {
    console.log("(dry-run — 加 --write 寫入 src/data/quote-wall.ts)");
    return;
  }

  const lines = [
    "// 由 scripts/fetch-quote-wall.mjs 自動產生，請勿手改。",
    "// 來源：Matters 公開 GraphQL（各期七日書 WritingChallenge.quotes）。",
    "",
    "export interface WallQuote {",
    "  id: string;",
    "  content: string;",
    "  author: string;",
    "  articleTitle: string;",
    "  articleHash: string;",
    "  campaignName: string;",
    "  createdAt: string;",
    "}",
    "",
    `export const quoteWall: WallQuote[] = ${JSON.stringify(items, null, 2)};`,
    "",
    "export const quoteWallCount = quoteWall.length;",
    "",
    "// 牆上出現過的屆數（給篩選用）",
    "export const quoteWallCampaigns: string[] = Array.from(",
    "  new Set(quoteWall.map((q) => q.campaignName).filter(Boolean))",
    ");",
    "",
  ];
  fs.writeFileSync(OUT_TS, lines.join("\n"), "utf-8");
  console.log(`✓ 寫入 ${OUT_TS}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
