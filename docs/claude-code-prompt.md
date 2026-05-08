# Claude Code 接手 Prompt

你是 Claude Code，請接手 Matters「七日書」兩個 landing page 的工程修正。請先讀完整 repo 與本文件，不要把目前畫面視為完成稿。現在的版本只是 Codex 快速拆出兩個網址後的可預覽草稿，仍有明顯品質問題需要你修。

請用繁體中文、台灣用語回報進度。實作時遵守現有 Astro 專案結構、Matters design system token 與 Freewrite palette，不要重做成另一套設計語言。

## 專案位置與預覽

- Repo: `/Users/mashbean/Documents/AI-Agent/external/seven-day-book-landing`
- 寫作者頁: `http://127.0.0.1:4321/`
- 機構合作頁: `http://127.0.0.1:4321/partners/`
- 舊路由: `/seven-day-book/` 目前只是 redirect 到 `/partners/`
- 目前 Figma 參考: `https://www.figma.com/design/HQ5Y6bBc9dVDT99u8Qvkb5/CC---Branding?node-id=17-672&p=f&t=yxVya6Qed2kE7b9c-0`

## 目前重要檔案

- `src/pages/index.astro`: 寫作者 landing page
- `src/pages/partners.astro`: 機構合作 landing page
- `src/pages/seven-day-book.astro`: 舊路由 redirect
- `src/data/seven-day-campaign.ts`: 兩頁共用資料與文案
- `src/styles/seven-day-campaign.css`: 目前主要樣式，仍過於龐大，需整理
- `src/components/WritingCardGrid.astro`: 「他們正在寫這些」互動卡片草稿
- `src/components/GrandBadge.astro`: 現有大滿貫徽章 SVG
- `src/styles/vendor/matters-ds/tokens/tokens.css`: Matters design system tokens
- `src/styles/base.css`: Freewrite palette aliases
- `public/images/seven-day/optimized/`: 目前臨時生成圖與 icon，品質未通過
- `docs/landing-redesign-expert-prompts.md`: 上一輪任務拆解 prompt，可參考但不是最終交接

## 目前已完成但需要重修的部分

- 已拆成兩個 landing page: 寫作者頁 `/`、機構合作頁 `/partners/`
- 已加入本期 Day 1 到 Day 7 橫向解鎖卡
- 已把 `ol` 預設序號外露問題修掉
- 已把文章區改成可翻面的互動卡片
- 已新增合作頁三個合作模組，其中兩個使用臨時 icon
- 已新增四張自由寫主題底圖: `我的職場人格`、`衣櫥裡的自我`、`氣味博物館`、`我的人生帳本`
- 已避免部分縮圖用 `object-fit: cover` 裁切含中文字的原始活動封面
- 已跑過 Astro compiler parse、Prettier、`git diff --check`、兩頁 HTTP 200、圖片 HTTP 200、瀏覽器 DOM 基本檢查

## 明確已知問題，請優先修正

1. 圖片品質不合格
   目前 `public/images/seven-day/optimized/*.jpg` 是透過 matters-studio 遠端 Worker 產出，呼叫時要求 `gpt-image-2`，但 Worker header 顯示實際 fallback 到 `gpt-image-1`。這批圖只能當 placeholder。請不要把它們視為 final asset。需要重新從 Figma / matters-studio / 正式 OpenAI image workflow 取得更穩定素材。

2. 圖片尺寸與裁切策略未定稿
   現在 hero、issue cover、theme card、theme row 各自使用不同 aspect ratio 與 `object-fit`。請重新定義 image system：hero、主題縮圖、文章卡縮圖、合作案例圖、icon 的尺寸、比例、載入策略、mobile 行為。所有含中文字的既有活動封面不得被裁掉。

3. 字重太重
   現在大量 heading 使用 `font-weight: 900`，看起來不像 Matters design system。請依 `tokens.css` 與既有 Matters UI 語氣調整，尤其 h1/h2、卡片標題、button、eyebrow。建議優先用 600/700，少量使用 800，避免全頁黑重。

4. CSS 過度集中且卡片感太重
   `src/styles/seven-day-campaign.css` 很大，而且卡片、陰影、圓角密度偏高。請依現有版型拆分區塊樣式，減少重複 card-on-card 感，讓頁面更像 Matters / Freewrite 而不是 generic SaaS landing。

5. 文章卡互動還只是草稿
   `WritingCardGrid.astro` 是原生 JS 翻面卡，不是從 `mashbean/blog-pro` 精準移植。請查 `/Users/mashbean/Documents/AI-Agent/external/blog-pro` 的互動卡片模式，再決定要復用視覺與互動邏輯，或重寫成更符合本頁的版本。手機上不要讓 hover-only 或 3D flip 造成閱讀困難。

6. 文案可再精修
   `src/data/seven-day-campaign.ts` 的文案已比任務型文字自然，但仍需要品牌文案校稿。寫作者頁要更有「有人一起寫」的陪伴感；合作頁要更清楚對機構說明可策展、可延伸、可合作的價值，但不能誇大沒有證據的成效。

7. 資料仍是靜態
   最新文章、作者頭像、本期題目、參與數字都是靜態寫在 data 檔。若本輪要正式化，請至少把「哪些需要手動更新」寫清楚；若有時間，再抽成可替換資料結構或 build-time fetch。

8. 驗證仍不完整
   原環境跑 `astro check` 時被 Rollup native binding code signature 擋住。你需要在可用 Node/npm 環境重新跑 `npm install`、`npm run check`、`npm run build`。如果失敗，請分清楚是既有 repo 問題、環境問題，還是本次頁面改動造成。

## 你的工程任務

1. 先確認目前畫面問題
   在 desktop、tablet、mobile 檢查 `/` 與 `/partners/`。重點看圖片比例、中文字裁切、字重、行高、卡片密度、CTA 層級、互動卡可用性、FAQ、modal、mail link。

2. 整理設計與資料邊界
   把頁面分成 writing-audience 與 institutional-partners 兩條敘事，不要再混成單一合作頁。兩頁可以共用 data，但目的與語氣要分清楚。

3. 修正視覺系統
   使用 Matters tokens：`--color-freewrite-background`、`--color-freewrite-text`、`--color-freewrite-text-dark`、`--color-freewrite-label`、grey scale、space tokens、shadow tokens。避免新增一堆未命名 raw colors。若需要補充 semantic tokens，放在 `base.css` 或本頁 CSS 開頭並註明用途。

4. 重做圖片資產引用
   把 placeholder 圖替換成合格圖。若暫時無法重生圖，請回退到 Figma/官方活動封面並用 contain/padded frame 避免裁字。若重生圖，請產出 web-ready JPG/WebP，至少有桌面 hero、card thumbnail、icon 三種規格。

5. 重整 component
   建議拆出:
   - `SevenDayHero.astro`
   - `StatsWithAvatars.astro`
   - `DayUnlockStrip.astro`
   - `WritingCardGrid.astro`
   - `ThemeGrid.astro`
   - `LectureGrid.astro`
   - `PartnerImpact.astro`
   - `PartnerPackages.astro`
   - `CampaignCta.astro`

6. 修正互動與可及性
   文章卡可以點擊與鍵盤操作；email reminder dialog 可聚焦、可關閉；所有外部連結有 `target="_blank"` 與 `rel="noopener"`；圖片 alt 不能空到失去意義，但裝飾圖可保留空 alt。

7. 驗證與回報
   完成後提供修改檔案、驗證指令、還沒解的問題、需要 Matters 人工確認的內容。

## 必須保留的產品需求

### 寫作者頁 `/`

順序：

1. 封面圖 + 文案
2. 右上角按鈕：「加入寫作」
3. 「洽談合作」進入 `/partners/`
4. 數據統計 + 作者頭像
5. 本月主題
6. Day 1 到 Day 7，本期題目，橫向日期卡片感
7. 本期精選，文案「他們正在寫這些」
8. 最近一期精選文章；若不夠，用最新文章補
9. 大滿貫徽章介紹
10. 過去主題：「如果你也想寫更多」
11. 每期主題用小區塊，不要時間軸
12. 名家講座：作家頭像 + 有逐字稿才放文字稿
13. FAQ：關於七日書
14. CTA：「下一個七天，一起寫。」
15. CTA button：「獲得活動提醒郵件」，點擊開 email 輸入彈窗

### 機構合作頁 `/partners/`

順序：

1. 封面圖 + 文案
2. 「洽談合作」點擊 mailto `freewrite@matters.town`
3. 「加入寫作」回寫作者頁
4. 七日書歷次主題：每個主題列出摘要與執行日期
5. 七日書執行內容介紹
6. 累積參與：凸顯 3000 人次、9000+ 篇文章、七天寫作完成率、每期新加入用戶平均數
7. 滾動創作者頭像
8. 給機構看的商業/合作角度數據
9. 名家講座
10. 精選文章
11. 合作案例：「一起設計下一個，能被上千人持續書寫的題目。」
12. 兩廳院藝術出走 · 給自己的情書
13. 後續可補兩廳院實體展覽照片與入選文章清單
14. 合作內容：主題共創、名家講座、書寫憑證
15. FAQ：如何與七日書合作
16. CTA：「用書寫，擴大你的社群」
17. CTA buttons：洽談合作、參與七日書寫作

## 品質標準

- 不要有圖片與文字重疊
- 不要有中文字被裁半
- 不要有預設 list numbering 跑到卡片外
- 手機版文字不能擠壓或溢出
- 字重、行高、間距要像 Matters，而不是 generic landing template
- 圖片資產不能看起來像低品質 AI 圖
- CTA 層級要清楚
- 不要新增未授權第三方素材
- 不要做超出目前資料證據的宣稱

## 驗收指令

請在你的環境執行：

```bash
npm install
npm run check
npm run build
git diff --check
```

如果 `npm run check` 或 build 被本機 native binding 擋住，請補充可替代驗證：

```bash
node --input-type=module <<'NODE'
import { parse } from '@astrojs/compiler';
import fs from 'node:fs/promises';
for (const file of ['src/pages/index.astro', 'src/pages/partners.astro', 'src/pages/seven-day-book.astro']) {
  await parse(await fs.readFile(file, 'utf8'), { position: true });
  console.log(`parsed ${file}`);
}
NODE
```

並用瀏覽器實測：

- `/`
- `/partners/`
- mobile viewport
- article card interaction
- email reminder dialog
- mailto link
- all local images return 200

## 回報格式

請用以下格式回報：

1. 已修正
2. 尚未修正 / 需要設計決策
3. 需要 Matters 提供的素材或確認
4. 已跑驗證
5. 建議下一步
