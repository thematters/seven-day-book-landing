#!/usr/bin/env node
/**
 * Curate Community Quotes
 *
 * 從 src/data/freewrite-featured.ts (531 篇精選文) 中抽 6-8 句最值得摘錄的
 * 句子作為 landing page Section 2 「社群溫度」顯示。
 *
 * 文本分析策略（不只取開頭句）：
 *   1. 把每篇 summary + title 切句（中文按 「。」「？」「！」 切，含結束標點）
 *   2. 為每句打分數：
 *      a. 長度 score：12-40 字最佳（太短沒記憶點、太長像論文）
 *      b. 具體性 score：含「我」「你」「他/她」「一」「那」「這」第一第二人稱與指示詞加分
 *      c. 情感詞 score：含情感動詞「愛/恨/想/怕/逃/留/記/忘/見/聽/說」加分
 *      d. 詩意 score：含對仗/比喻線索（「像」「彷彿」「如同」「終於」）加分
 *      e. 排除：含 URL / 過多英文 / 全是數字 / 過度抒情陳腔 (「很美好」「真的好棒」)
 *   3. 每期取最高分 1 句（避免同期 over-represent）
 *   4. 跨期取 top 8 句，確保不同期分布
 *
 * 用法：
 *   node scripts/curate-community-quotes.mjs                 # dry-run 印出 top 8
 *   node scripts/curate-community-quotes.mjs --write         # 寫入 src/data/community-quotes.ts
 *   node scripts/curate-community-quotes.mjs --count 12      # 改抽 12 句（預設 8）
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

// 讀 research/freewrite-featured.json，shape: { campaigns: [{ shortHash, name, articles: [...] }] }
const FEATURED_JSON = path.join(REPO_ROOT, "research/freewrite-featured.json");
const OUT_TS = path.join(REPO_ROOT, "src/data/community-quotes.ts");

function loadArticles() {
  const data = JSON.parse(fs.readFileSync(FEATURED_JSON, "utf-8"));
  const flat = [];
  for (const camp of data.campaigns || []) {
    for (const art of camp.articles || []) {
      flat.push({
        ...art,
        campaignHash: camp.shortHash,
        campaignName: camp.name,
      });
    }
  }
  return flat;
}

const SCORE_WEIGHTS = {
  length: 1.0,
  specificity: 1.5,
  emotion: 1.5,
  poetic: 1.2,
  penalty: -3.0,
};

function scoreSentence(s) {
  // 中文字長度，去掉空白
  const txt = s.trim();
  const len = [...txt].length;
  if (len < 8 || len > 60) return -10;

  // a. 長度（12-40 中文字最佳）
  let lengthScore;
  if (len >= 12 && len <= 40) lengthScore = 1.0;
  else if (len <= 50) lengthScore = 0.6;
  else lengthScore = 0.2;

  // b. 具體性：人稱 + 指示詞
  const specificityPattern = /[我你他她它那這]/g;
  const specMatches = (txt.match(specificityPattern) || []).length;
  const specificityScore = Math.min(1, specMatches / 3);

  // c. 情感詞
  const emotionPattern = /[愛恨想念怕躲逃留記忘哭笑見聽說等離尋訪夢醒沉痛苦樂]/g;
  const emoMatches = (txt.match(emotionPattern) || []).length;
  const emotionScore = Math.min(1, emoMatches / 2);

  // d. 詩意 / 比喻線索
  const poeticPattern = /(像|彷彿|如同|彷如|宛如|猶如|終於|原來|忽然|偶爾|有時|曾經)/g;
  const poetMatches = (txt.match(poeticPattern) || []).length;
  const poeticScore = Math.min(1, poetMatches / 1);

  // e. 排除：URL / 過多英文 / 全數字 / 陳腔
  let penalty = 0;
  if (/https?:\/\//.test(txt)) penalty += 1;
  // 過多英文 (英文字佔比 > 30%)
  const englishChars = (txt.match(/[A-Za-z]/g) || []).length;
  if (englishChars / len > 0.3) penalty += 0.5;
  // 數字佔比過高
  const digitChars = (txt.match(/[0-9]/g) || []).length;
  if (digitChars / len > 0.2) penalty += 0.5;
  // 陳腔
  if (/(很好|真的好|超棒|期待下次|歡迎大家|感謝大家)/.test(txt)) penalty += 1;
  // 提及自己是七日書/題目（自我指涉）
  if (/(七日書|自由寫|這次的題目|今天的題目|第[一二三四五六七]天)/.test(txt)) penalty += 0.5;
  // 題目提示文特徵：泛泛詞 + 第二人稱（你/妳）大量使用
  // 例：「這可能是改變一個決定、跟以前的自己說話，又或者任何你想像到的」
  //     「請分享 / 試著寫下 / 你是否 / 你可能 / 你想 / 寫出你的」
  const promptCues = (txt.match(/(可能|或者|或許|建議|請|試著|寫下|分享|寫出|或是任何|任何你|每一個你)/g) || []).length;
  const youCount = (txt.match(/[你妳]/g) || []).length;
  if (promptCues >= 2 || (youCount >= 3 && promptCues >= 1)) penalty += 1.5;
  if (/(是否|有沒有|要不要).{0,8}[？?]/.test(txt)) penalty += 1; // 問句邀請

  return (
    SCORE_WEIGHTS.length * lengthScore +
    SCORE_WEIGHTS.specificity * specificityScore +
    SCORE_WEIGHTS.emotion * emotionScore +
    SCORE_WEIGHTS.poetic * poeticScore +
    SCORE_WEIGHTS.penalty * penalty
  );
}

function splitSentences(text) {
  if (!text) return [];
  // 中文標點切句：。 ？ ！ 後加結束標點本身；忽略過短片段
  const parts = text
    .split(/(?<=[。？！])/)
    .map((s) => s.trim())
    .filter(Boolean);
  // 也對「，」做次要切割（取較長的子句，但保留標點）
  const sentences = [];
  for (const part of parts) {
    // 如果整段 > 50 字，再用 ，; 切
    if ([...part].length > 50) {
      const subs = part.split(/(?<=[，；])/).map((s) => s.trim()).filter(Boolean);
      sentences.push(...subs);
    } else {
      sentences.push(part);
    }
  }
  return sentences;
}

function topQuotePerArticle(article) {
  const body = [article.title, article.summary].filter(Boolean).join("。 ");
  const sentences = splitSentences(body);
  let best = null;
  for (const s of sentences) {
    const sc = scoreSentence(s);
    if (!best || sc > best.score) {
      // 去掉句尾標點以利顯示
      const display = s.replace(/[，；。？！]+$/u, "");
      best = { score: sc, text: display, raw: s };
    }
  }
  return best;
}

async function main() {
  const args = process.argv.slice(2);
  const shouldWrite = args.includes("--write");
  const countIdx = args.indexOf("--count");
  const COUNT = countIdx >= 0 ? Number(args[countIdx + 1]) : 8;

  console.log(`\n=== Curate Community Quotes (target ${COUNT}) ===\n`);

  const articles = loadArticles();
  console.log(`Loaded ${articles.length} featured articles`);

  // 1. 每篇取最高分句子
  const candidates = [];
  for (const a of articles) {
    const top = topQuotePerArticle(a);
    if (!top || top.score < 1.5) continue;
    candidates.push({
      score: top.score,
      text: top.text,
      title: a.title,
      author: a.author?.displayName || a.author?.userName,
      userName: a.author?.userName,
      avatar: a.author?.avatar,
      campaignHash: a.campaignHash,
      campaignName: a.campaignName,
      articleHash: a.shortHash,
    });
  }
  console.log(`Candidates (score >= 1.5): ${candidates.length}`);

  // 2. 跨期分布：每期最多 1 句
  const byCampaign = new Map();
  for (const c of candidates.sort((a, b) => b.score - a.score)) {
    if (!byCampaign.has(c.campaignHash)) byCampaign.set(c.campaignHash, c);
  }
  const oneTopPerCampaign = [...byCampaign.values()].sort((a, b) => b.score - a.score);
  console.log(`One-top-per-campaign 後剩: ${oneTopPerCampaign.length} 期`);

  // 3. 取 top N，並做多樣性：盡量分散到 5+ 不同 campaign
  const final = oneTopPerCampaign.slice(0, COUNT);

  console.log(`\n=== Top ${final.length} quotes ===\n`);
  for (const [i, q] of final.entries()) {
    console.log(`${i + 1}. [${q.score.toFixed(2)}] (${q.campaignName.replace("七日書｜", "")} · ${q.author})`);
    console.log(`   「${q.text}」`);
    console.log(`   from: matters.town/a/${q.articleHash}\n`);
  }

  if (!shouldWrite) {
    console.log("(dry-run — 加 --write 寫入 src/data/community-quotes.ts)");
    return;
  }

  const ts = (v) => JSON.stringify(v);
  const today = new Date().toISOString().slice(0, 10);
  const out = [
    `// 七日書社群精華句子 — 由 scripts/curate-community-quotes.mjs (${today}) 自動產生`,
    `// 從 freewriteFeatured 用文本分析評分（長度 / 具體性 / 情感 / 詩意）抽出每期最高分句`,
    `// 跨期分散，目前取 ${final.length} 句。`,
    `// 重跑：node scripts/curate-community-quotes.mjs --write`,
    `//`,
    `// ⚠️ 抽出來後人工再 review 一遍，可以手動調整 text / 順序`,
    ``,
    `export interface CommunityQuote {`,
    `  text: string;             // 引文（不含開頭引號 / 句尾標點）`,
    `  author: string;           // displayName`,
    `  userName: string;         // matters handle`,
    `  avatar: string | null;`,
    `  campaignName: string;     // 完整 campaign name`,
    `  campaignLabel: string;    // 簡短 label (去「七日書｜」)`,
    `  articleHash: string;      // matters.town/a/{hash}`,
    `}`,
    ``,
    `export const communityQuotes: CommunityQuote[] = [`,
    ...final.map(
      (q) =>
        `  { text: ${ts(q.text)}, author: ${ts(q.author)}, userName: ${ts(q.userName)}, avatar: ${q.avatar ? ts(q.avatar) : "null"}, campaignName: ${ts(q.campaignName)}, campaignLabel: ${ts(q.campaignName.replace(/^七日書[｜：]|^三日書[｜：]?|^兩廳院藝術出走：給自己的情書「三日書」?徵文活動.*?\(.*?[：:]|^兩廳院藝術出走：/, "").trim().split(/[（(]/)[0].trim())}, articleHash: ${ts(q.articleHash)} },`,
    ),
    `];`,
    ``,
  ].join("\n");

  fs.writeFileSync(OUT_TS, out, "utf-8");
  console.log(`\n✓ 寫入 ${path.relative(REPO_ROOT, OUT_TS)}`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
