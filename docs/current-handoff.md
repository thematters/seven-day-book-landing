# 七日書 Landing 目前交接狀態

建立日期：2026-05-08

這份文件給下一位接手者快速理解目前狀態。請注意，現在頁面不是完成稿，使用者已明確指出仍有多處問題：圖片尺寸、AI 生圖品質、文字字重、版面精緻度都需要修。

## 交接文件

- Claude Code prompt: `docs/claude-code-prompt.md`
- Claude Design prompt: `docs/claude-design-prompt.md`
- 上一輪拆解 prompts: `docs/landing-redesign-expert-prompts.md`

## 目前路由

- `/`: 給個人寫作者的 landing page
- `/partners/`: 給機構合作方的 landing page
- `/seven-day-book/`: 舊路由，目前 redirect 到 `/partners/`

## 目前主要改動

- `src/pages/index.astro` 被改成寫作者頁。
- 新增 `src/pages/partners.astro` 作為機構合作頁。
- 新增 `src/data/seven-day-campaign.ts` 集中管理兩頁資料與文案。
- 新增 `src/styles/seven-day-campaign.css` 作為兩頁共用樣式。
- 新增 `src/components/WritingCardGrid.astro` 作為文章互動卡片草稿。
- 新增 `public/images/seven-day/optimized/` 六張臨時圖片。
- `src/pages/seven-day-book.astro` 改成 redirect。
- `src/site.config.ts` 改成七日書通用描述。

## 臨時圖片狀態

目前六張圖片都只是 placeholder：

- `studio-workplace-persona.jpg`
- `studio-closet-self.jpg`
- `studio-smell-museum.jpg`
- `studio-life-ledger.jpg`
- `icon-theme-cocreation.jpg`
- `icon-author-lecture.jpg`

重要：這些圖片透過 matters-studio 遠端 Worker 產生，呼叫時指定 `gpt-image-2`，但 Worker response header 顯示實際 fallback 到 `gpt-image-1`。使用者已指出品質不夠，因此下一輪應重新產圖或改用 Figma / 官方素材。

## 已驗證

- Astro compiler parse: `index.astro`、`partners.astro`、`seven-day-book.astro`、`WritingCardGrid.astro` 通過。
- Prettier with Astro plugin 通過。
- `git diff --check` 通過。
- 本機 dev server 上 `/` 與 `/partners/` 回 200。
- 六張 local image 回 200。
- In-app browser DOM 檢查：首頁有 7 張 Day card、6 張 writing card；合作頁有 2 個新 icon image、6 張 writing card；console 沒有 error / warning。

## 尚未完整驗證

- `astro check` / build 在目前 Codex 環境被 Rollup native binding code signature 問題擋住。下一位接手者要在可用 Node/npm 環境重跑 `npm install`、`npm run check`、`npm run build`。
- in-app browser screenshot 曾 timeout，沒有留下可靠截圖驗證。
- mobile / tablet 尚未做完整視覺 QA。
- Lighthouse 尚未跑。

## 使用者已指出或暗示的問題

- 圖片尺寸與裁切策略不穩。
- AI 圖品質不符合預期。
- 文字字重太重，不像 Matters design system。
- 頁面還有很多地方需要設計級重修。
- 目前版本只能當接續草稿，不能直接上線。

## 接手原則

1. 先做設計診斷，再做工程修正。
2. 不要沿用目前臨時 AI 圖作為 final。
3. 不要只修局部 CSS；應該重新整理 image system、typography、spacing、card density。
4. 寫作者頁與機構頁要維持兩條不同敘事。
5. 所有數據與合作成效不要誇大。
6. 正式上線前需要 Matters 確認素材授權、作家頭像、講座文字稿、兩廳院案例補充資料。
