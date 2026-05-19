#!/usr/bin/env node
/**
 * Scrape Campaign Prompts (24 期 ≈ 168 題)
 *
 * 從 Matters GraphQL 撈每期公告文章的 markdown，解析「### 本月題目」段落
 * 抽出第一天到第七天的題目。三日書只抽 3 天。
 *
 * 來源：research/freewrite-themes.json 的 24 期 announceHref
 * 輸出：src/data/freewrite-prompts.ts （title-only 的題目陣列）
 *
 * Parsing 邏輯：
 *   1. 找 markdown 中「### 本月題目」（容錯：「### 七題」「### 本期題目」）
 *   2. 從該 anchor 開始切「第[一二三四五六七]天」block
 *   3. 每個 block 內容 = title (第一段) + body (其餘到下一個「第X天」前)
 *   4. 如果找不到 7 題，回報並 skip 該期（人工補）
 *
 * 用法：
 *   node scripts/scrape-campaign-prompts.mjs              # dry-run
 *   node scripts/scrape-campaign-prompts.mjs --write      # 寫入 src/data/freewrite-prompts.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const ENDPOINT = "https://server.matters.town/graphql";
const THEMES_JSON = path.join(REPO_ROOT, "research/freewrite-themes.json");
const OUT_TS = path.join(REPO_ROOT, "src/data/freewrite-prompts.ts");

const DAY_KANJI = ["一", "二", "三", "四", "五", "六", "七"];

const ARTICLE_QUERY = `
  query($shortHash: String!) {
    article(input: { shortHash: $shortHash }) {
      title
      contents { markdown }
    }
  }
`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAnnouncement(shortHash) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: ARTICLE_QUERY, variables: { shortHash } }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data.article;
}

/** 從 markdown 抽 7 (或 N) 題 */
function parsePrompts(markdown, expectedDays = 7) {
  if (!markdown) return null;
  // 去除 HTML tags 與 figure
  let md = markdown.replace(/<[^>]+>/g, "\n").replace(/\\\n/g, "\n");

  // 1. 找 anchor — 容錯 ### / ** / 純文字 三種寫法
  const anchorRegex = /(?:^|\n)(?:###\s*|\*\*\s*)?(本月題目|本期題目|七題|題目)\s*\**\s*\n/;
  const anchorMatch = md.match(anchorRegex);
  if (anchorMatch) {
    md = md.slice(anchorMatch.index + anchorMatch[0].length);
  } else {
    // 找第一個「第一天」位置作為 fallback
    const fallback = md.search(/第一天[\s：（(]/);
    if (fallback === -1) return null;
    md = md.slice(fallback);
  }

  // 2. 切「第N天」blocks
  const prompts = [];
  for (let i = 0; i < expectedDays; i++) {
    const day = DAY_KANJI[i];
    const nextDay = DAY_KANJI[i + 1];
    // 第N天 後面可能跟 (6 月 3 日)、（6月3日）、之後接換行或標題
    // 容錯：「第」字可選（某些公告缺字，如 S23「五天\」少了「第」字）
    const startPattern = new RegExp(`(?:^|\\n)第?${day}天[^\\n]*\\n+`);
    const endPattern = nextDay
      ? new RegExp(`(?:^|\\n)第?${nextDay}天[^\\n]*\\n+`)
      : /(?:###|---|\n\n\n)/;
    const startMatch = md.match(startPattern);
    if (!startMatch) return null; // 缺題
    const after = md.slice(startMatch.index + startMatch[0].length);
    const endMatch = after.match(endPattern);
    const block = (endMatch ? after.slice(0, endMatch.index) : after).trim();
    // 把多個 \n 收成一個 space，去掉 leading 標點
    const cleaned = block
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ");
    if (!cleaned) return null;
    // title = 第一句（到 「。」「？」「！」 或字長 25 之內）
    const titleMatch = cleaned.match(/^[^。？！]{1,40}[。？！]?/);
    const title = titleMatch ? titleMatch[0].replace(/[。？！]+$/u, "").trim() : cleaned.slice(0, 25);
    prompts.push({ day: `Day ${i + 1}`, title, prompt: cleaned });
  }
  return prompts;
}

function extractShortHash(href) {
  // matters.town/a/{shortHash}
  const m = href.match(/matters\.town\/[ae]\/([a-z0-9]+)/i);
  return m ? m[1] : null;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const shouldWrite = args.has("--write");

  const themes = JSON.parse(fs.readFileSync(THEMES_JSON, "utf-8"));
  console.log(`\n=== Scrape Campaign Prompts (${themes.length} 期) ===\n`);

  const results = [];
  let okCount = 0;
  let failCount = 0;

  for (const t of themes) {
    const hash = extractShortHash(t.announceHref || "");
    if (!hash) {
      console.log(`  ⚠ ${t.series} ${t.name.slice(0, 20)} — 無 announceHref hash`);
      failCount++;
      continue;
    }
    // 試 7 題，失敗再試 3 題（三日書 / 兩廳院特殊期）
    try {
      const article = await fetchAnnouncement(hash);
      if (!article) {
        console.log(`  ⚠ ${t.series} ${t.name.slice(0, 20)} — article null (hash=${hash})`);
        failCount++;
        continue;
      }
      let prompts = parsePrompts(article.contents?.markdown, 7);
      let actualDays = 7;
      if (!prompts) {
        prompts = parsePrompts(article.contents?.markdown, 3);
        actualDays = 3;
      }
      if (!prompts) {
        console.log(`  ✗ ${t.series} ${t.name.slice(0, 20)} — parse 失敗`);
        failCount++;
        continue;
      }
      results.push({
        series: t.series,
        name: t.name,
        monthLabel: t.monthLabel,
        announceHref: t.announceHref,
        prompts,
      });
      console.log(`  ✓ ${t.series.padEnd(4)} ${t.name.slice(0, 22).padEnd(24, "　")} ${prompts.length} 題`);
      okCount++;
    } catch (err) {
      console.log(`  ✗ ${t.series} ${t.name.slice(0, 20)} — ${err.message}`);
      failCount++;
    }
    await sleep(150);
  }

  console.log(`\n總共：${okCount} 期成功 / ${failCount} 期失敗 / ${results.reduce((s, r) => s + r.prompts.length, 0)} 題`);

  if (!shouldWrite) {
    console.log("\n(dry-run — 加 --write 寫入 src/data/freewrite-prompts.ts)");
    // 展示一期內容
    if (results.length > 0) {
      console.log(`\nSample (${results[0].series}):`);
      for (const p of results[0].prompts) {
        console.log(`  ${p.day} | ${p.title}`);
        console.log(`        ${p.prompt.slice(0, 60)}…`);
      }
    }
    return;
  }

  const ts = (v) => JSON.stringify(v);
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    `// 七日書全期題目資料 — 由 scripts/scrape-campaign-prompts.mjs (${today}) 自動產生`,
    `// 從各期 Matters 公告文章 markdown 解析「### 本月題目」段落抽 7 (三日書 3) 題`,
    `// 重跑：node scripts/scrape-campaign-prompts.mjs --write`,
    ``,
    `export interface FreewritePrompt {`,
    `  day: string;     // "Day 1" – "Day 7"`,
    `  title: string;   // 題目短標（第一句）`,
    `  prompt: string;  // 完整題目敘述`,
    `}`,
    ``,
    `export interface FreewriteIssue {`,
    `  series: string;       // "S1" – "S25"`,
    `  name: string;         // 完整期數名稱`,
    `  monthLabel: string;   // "2024 / 4"`,
    `  announceHref: string; // matters.town 公告連結`,
    `  prompts: FreewritePrompt[];`,
    `}`,
    ``,
    `export const freewriteIssues: FreewriteIssue[] = [`,
    ...results.map(
      (r) =>
        `  {\n    series: ${ts(r.series)},\n    name: ${ts(r.name)},\n    monthLabel: ${ts(r.monthLabel)},\n    announceHref: ${ts(r.announceHref)},\n    prompts: [\n${r.prompts.map((p) => `      { day: ${ts(p.day)}, title: ${ts(p.title)}, prompt: ${ts(p.prompt)} },`).join("\n")}\n    ],\n  },`,
    ),
    `];`,
    ``,
  ];
  fs.writeFileSync(OUT_TS, lines.join("\n"), "utf-8");
  console.log(`\n✓ 寫入 ${path.relative(REPO_ROOT, OUT_TS)}`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
