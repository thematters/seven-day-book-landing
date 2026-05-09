# Matters 七日書 Landing

> B2B + 社群導向的 Matters 七日書 landing page。
> 情感敘事優先，承接合作方 / 新訪客 / 既有文友三種動線。

**Canonical repo**：`thematters/seven-day-book-landing` (public)

## 部署網址

| 階段 | URL | 狀態 |
|---|---|---|
| 目前（GH Pages） | https://thematters.github.io/seven-day-book-landing/ | live |
| 目前（GH Pages） | https://thematters.github.io/seven-day-book-landing/partners/ | live |
| 目前（GH Pages） | https://thematters.github.io/seven-day-book-landing/archive/ | live |
| **正式網址** | **https://freewriting.matters.town** | 切換中（覆蓋舊 GH Pages 三頁） |
| **正式網址** | **https://freewriting.matters.town/partnership** | 切換中（`partnership` 單數，非 `partners`） |
| **正式網址** | **https://freewriting.matters.town/museum** | 切換中（從 `archive` 改名 `museum`） |

source 已切換完成（commit 進度見 git log）：

- ✅ `astro.config.ts` 預設 `site = "https://freewriting.matters.town"`、`base = "/"`
- ✅ GH Actions repo vars：`SITE_URL=https://freewriting.matters.town`、`BASE_PATH=/`
- ✅ 新檔名：`src/pages/partnership.astro`（原 partners.astro）、`src/pages/museum.astro`（原 archive.astro）
- ✅ 舊路徑 `partners.astro` / `archive.astro` 改成 client-side redirect stubs，避免外連 404
- ✅ 所有 `withBase("partners/")` → `withBase("partnership/")`、`withBase("archive/")` → `withBase("museum/")`

GH Pages custom domain 切換步驟（需 ops 配合）：

1. **釋出舊 domain**：`mashbean/seven-day-book-landing-preview` 目前持有
   `freewriting.matters.town` CNAME，要先 PUT pages with `cname=""` 釋出
2. **DNS 設定**（matters.town DNS 提供商；現況指向 mashbean.github.io）：
   - 改為：`freewriting.matters.town CNAME thematters.github.io.`
   - 或加 4 個 GH Pages anycast A records：`185.199.108.153` / `109.153` / `110.153` / `111.153`
3. **Claim 新 owner**：`gh api -X PUT repos/thematters/seven-day-book-landing/pages -f cname=freewriting.matters.town -F https_enforced=true`
4. **驗證憑證自動簽發**：GH Pages 自動 Let's Encrypt（10-30 分鐘），完成後 https://freewriting.matters.town 可用
5. （可選）保留 `https://thematters.github.io/seven-day-book-landing/` 作為備援，自動 redirect 到 custom domain

---

## 現況（2026-04-24）

- ✅ Astro 5 靜態站，0 errors / 0 warnings
- ✅ GitHub Pages 自動部署（push 到 `main` 即更新）
- ✅ 12 期真實 events（2025-03 → 2026-05）、30 位真實頭像、6 段真實文章節錄
- ✅ Matters 官方 wordmark + grand-slam badge SVG 內嵌
- ✅ Freewrite palette（option A：`#045898` 主色 AAA、`#1999D0` accent、`#F0F9FE` 底）
- ✅ Noto Serif TC + PingFang TC 字體
- ✅ Matters favicon（retire 豆泥部落格 favicon）
- ✅ 動態：scroll reveal / pulse dot / 頭像 hover lift / 時間軸 pulsing dot / passport float + ray-burst / prefers-reduced-motion 全域 honor

## 框架選擇

Astro 5.13 static + React 可擴充（目前 0 React island，後續若要加互動再裝）。選 Astro 的理由：
- 靜態輸出（GitHub Pages 友好）
- 支援元件化 + scoped CSS + 可直接用 TS 資料
- SEO metadata + sitemap 內建
- 未來若要掛 matters.town 子網域、或搬到其他 CDN，檔案就是純 HTML

## Repo 結構

```
.
├── src/
│   ├── pages/
│   │   ├── index.astro        ← Landing 主頁（整頁 inline）
│   │   └── 404.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── BaseHead.astro
│   │   ├── MattersWordmark.astro  ← 官方 wordmark SVG
│   │   └── GrandBadge.astro       ← 大滿貫 shield SVG
│   ├── data/
│   │   └── seven-day-book.ts  ← 單一內容設定檔（hero / pulse / cadence / 12 events / voices / gallery / passport / partners / FAQ / closing）
│   ├── styles/
│   │   └── base.css           ← 全站 tokens + reset
│   ├── utils/paths.ts
│   └── site.config.ts
├── public/
│   └── images/
│       ├── matters-favicon-32.png
│       ├── matters-favicon-128.png
│       └── matters-apple-touch-icon.png
├── .github/workflows/deploy.yml
├── astro.config.ts
├── package.json
├── research/                  ← @freewrite 擷取資料（不 build 進 site）
│   └── freewrite/
│       ├── articles_full.json
│       ├── assets/images/     ← 185 張 embed / cover PNG
│       └── SUMMARY.md
├── scripts/                   ← 原始擷取腳本
└── docs/
    ├── handoff-plan.md
    ├── claude-code-prompt.md
    └── next-steps.md          ← ★ 下個 session 要做什麼
```

## Landing 結構（index.astro 自上而下）

| # | Section | 主角 | 素材 / 資料來源 |
|---|---|---|---|
| 1 | Sticky topbar | Matters wordmark + nav + chip CTAs | 官方 inline SVG |
| 2 | **Hero** | 3 行標題「七日書 / 一座每個月都 / 重新長出來的小鎮。」+ 12 頭像漂浮帶 | `hero.heroCover` = 最新一期 campaignCover |
| 3 | **Pulse** | 4 stats（280+ / 189 / 3,000+ / 9,000+）+ 30 頭像牆 | 2026-04 大滿貫公告 + 4 期事件頁抽取 |
| 4 | **七天的形狀** | 7 格 day chips，三階段：open / dim / locked | 抽象 prompt（非特定期） |
| 5 | **時間軸** | 12 期 zigzag timeline | `articles_full.json` cover + events SSR meta |
| 6 | **Voices** | 6 段真實引文 | `src/data/seven-day-book.ts` `voices[]` |
| 7 | **Visual memory** | 12 張 mosaic gallery | `research/freewrite/assets/` 精選 embed |
| 8 | **Passport** | 大滿貫 shield SVG + 漂浮動畫 | `GrandBadge.astro`（取自 matters.town `?dialog=grand-badge`）|
| 9 | **Partners**（B2B）| 案例 + 3 合作包裝 | 兩廳院「給自己的情書」合作 |
| 10 | **FAQ** | 5 題常見提問 | 融合社群實況寫成 |
| 11 | **Closing + contact** | CTA 對 + mailto fallback 表單 | — |
| 12 | Footer | mini | — |

## 本機開發

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/
npm run check    # astro check
```

## 部署

**自動**：push 到 `main` → `.github/workflows/deploy.yml` → build → GitHub Pages

**GitHub repo vars**（preview mirror）：
| Var | 預設 | 用途 |
|---|---|---|
| `SITE_URL` | `https://mashbean.github.io` | canonical / og url |
| `BASE_PATH` | `/seven-day-book-landing-preview` | 子路徑 prefix |

**掛 matters.town 子網域時**（未來）：
1. 改 `BASE_PATH=/`、`SITE_URL=https://landing.matters.town`（或類似）
2. repo Settings → Pages → Custom domain 填子網域
3. Matters DNS 設 CNAME → `thematters.github.io`
4. Vercel / Cloudflare Pages / 自家 CDN 改那個 deploy target 也能直接用 dist/

## 設計決議（PM / GM 已簽）

| 日期 | 項目 | 決議 |
|---|---|---|
| 2026-04-24 | Brand direction | canonical = Brand Guidelines purple `#7258FF` + lime `#C3F432`；七日書 landing 用 freewrite palette，不套紫/綠 |
| 2026-04-24 | Freewrite palette option | A：`#045898` (textDark) 為主 CTA / 文字 AAA；`#1999D0` (text) 降為 accent / hover |
| 2026-04-24 | Logo 呈現 | 用 matters.town 現行 inline wordmark SVG（純字標，無獨立 mark）|
| 2026-04-24 | 大滿貫徽章 | 用 matters.town `?dialog=grand-badge` 的 shield SVG（非長條證書圖）|

## 重要提醒

- 數字必須保留來源與日期，**不要**把累計參與人次寫成不重複人數
- 主 CTA 平衡點：「洽談合作」（B2B）與「看作品 / 加入下期」（社群）並陳，不偏任何一方
- 修改資料請編 `src/data/seven-day-book.ts`，頁面會自動吃新內容
- 若要替換 hero cover，用 Matters Cloudflare Images URL 參數（`w=1920,h=1080,fit=cover,anim=false`）控制尺寸/動畫

## 歷史沿革

| Commit | 變更 |
|---|---|
| `229314a` | 初始 fork（從豆泥部落格 Astro template）|
| `c757abd` | Strip blog cruft；單頁 + freewrite palette |
| `0183b03` | 真實資料 + C-direction emotion-first redesign |
| `6c80868` | 清理 hero / zigzag timeline / locked days / grand-slam SVG / Matters favicon |
| `4297578` | 3 行 hero title / 12 期 events / timeline 對齊 |

## 下一步

見 [`docs/next-steps.md`](docs/next-steps.md)。
