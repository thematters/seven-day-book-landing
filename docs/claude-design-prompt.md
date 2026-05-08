# Claude Design 接手 Prompt

你是 Claude Design，請接手 Matters「七日書」兩個 landing page 的設計審查與改版。請把目前頁面視為資訊架構草稿，不要把視覺當成完成稿。這次交接的目標是產出可給工程實作的設計方向、素材規格、排版規範與修正優先序。

請用繁體中文、台灣用語回覆。你的設計判斷要符合 Matters design system 與 Freewrite 的活動語氣：公共書寫、文友同行、安靜但有生命感。不要做成 generic SaaS、活動模板或過度裝飾的行銷頁。

## 目前可預覽頁面

- 寫作者頁: `http://127.0.0.1:4321/`
- 機構合作頁: `http://127.0.0.1:4321/partners/`
- Figma 參考: `https://www.figma.com/design/HQ5Y6bBc9dVDT99u8Qvkb5/CC---Branding?node-id=17-672&p=f&t=yxVya6Qed2kE7b9c-0`
- Matters design tokens 在 repo: `src/styles/vendor/matters-ds/tokens/tokens.css`
- Freewrite aliases 在 repo: `src/styles/base.css`

## 目前視覺問題，請優先診斷

1. 圖片品質不夠
   目前 `public/images/seven-day/optimized/` 裡的自由寫底圖與兩個 icon 是 AI placeholder。產生時要求 `gpt-image-2`，但實際 Worker fallback 到 `gpt-image-1`。圖像質感、圖像語言與 icon 風格都未通過，不可視為 final。

2. 圖片比例與裁切不穩定
   現在 hero、主題卡、合作案例、文章卡各用不同 image behavior。請重新制定 image system。含中文字的原活動封面不能被裁切；text-free AI / editorial background 可以裁，但要有安全區。

3. 字重太重
   目前頁面 h1/h2/card title 大量使用 900，整體過黑。請依 Matters design system 指定推薦字重、行高、字級、heading hierarchy。尤其要修：hero h1、section h2、card h3、button、eyebrow、metric number。

4. 卡片密度過高
   現在幾乎每段都是卡片、框線、陰影，頁面節奏偏呆板。請提出哪些段落應該保留卡片，哪些應該改成 full-width band、列表、橫向軸、無框圖文、或更接近 Matters feed 的形式。

5. 寫作者頁與機構頁風格需要區分
   寫作者頁要像「加入一週共同書寫」；機構頁要像「把公共命題轉成可被持續書寫的合作機制」。兩者可以共享 Freewrite palette，但節奏、文案重心與資料呈現應不同。

6. 互動卡片需要重新判斷
   「他們正在寫這些」目前是 flip card 草稿。請評估是否真的適合翻面；若沿用 mashbean/blog-pro 互動卡，請給出可工程化的 hover / click / mobile fallback 規範。

7. Day 1 到 Day 7 橫向卡需要 refinement
   目前已改回橫向解鎖卡，但視覺仍像卡片列表。請調整成更像「七天慢慢解鎖一本小書」的節奏：日期、Day、題目、已開放/今日/即將開放狀態要清楚，但不要像任務管理工具。

## 必須保留的資訊架構

### 寫作者頁

順序不能大改：

1. 封面圖 + 文案
2. 右上角「加入寫作」
3. 「洽談合作」進入機構合作頁
4. 數據統計 + 作者頭像
5. 本月主題
6. Day 1 到 Day 7 本期題目
7. 本期精選：「他們正在寫這些」
8. 大滿貫徽章介紹
9. 過去主題：「如果你也想寫更多」
10. 名家講座
11. FAQ：關於七日書
12. CTA：「下一個七天，一起寫。」+ email 提醒

### 機構合作頁

順序不能大改：

1. 封面圖 + 文案
2. 洽談合作 mailto `freewrite@matters.town`
3. 加入寫作回到寫作者頁
4. 七日書歷次主題
5. 七日書執行內容
6. 累積參與與合作指標
7. 滾動創作者頭像
8. 商業/合作角度數據
9. 名家講座
10. 精選文章
11. 合作案例：兩廳院藝術出走 · 給自己的情書
12. 合作內容：主題共創、名家講座、書寫憑證
13. FAQ：如何與七日書合作
14. CTA：「用書寫，擴大你的社群」

## 請輸出給工程的設計規格

請不要只給抽象建議。請產出以下可交付內容：

1. 頁面級設計診斷
   分別說明寫作者頁與機構頁的問題、優先序、修正方向。

2. Typography spec
   指定 h1、h2、h3、body、meta、button、metric number 的 font family、font weight、font size range、line height、letter spacing。請對齊 Matters tokens，不要任意使用過重字重。

3. Image system spec
   指定 hero、current issue cover、theme card、theme row、article card、lecture avatar、partner case image、package icon 的比例、尺寸、object-fit、padding、安全區、mobile 行為。

4. AI asset prompt refinement
   重新寫出可用於生成自由寫系列底圖與兩個 icon 的 prompt。要求：
   - 不要有文字、假字、Logo、水印、UI 截圖
   - 使用 Freewrite palette: `#F0F9FE`, `#1999D0`, `#045898`, `#83BAD1`
   - 可加入少量暖色: `#FFC688`, `#CC4B32`
   - 底圖要有 left / right safe area 版本
   - icon 要和現有大滿貫徽章一致，但不要複製徽章

5. Section-by-section wire guidance
   對每個 section 給出 layout 建議、spacing、是否用卡片、是否用背景 band、是否需要插圖。

6. Mobile behavior
   特別指定小螢幕 hero、Day card strip、article cards、theme grid、partner theme list、CTA、FAQ 怎麼排列。

7. 素材清單
   列出需要 Matters / Figma / Studio 補交的素材：
   - 七日書本期主視覺
   - 自由寫歷史主題系列底圖
   - 主題共創 icon
   - 名家講座 icon
   - 兩廳院展場照片
   - 入選文章清單
   - 作家講座頭像與逐字稿連結

8. Engineering acceptance checklist
   給 Claude Code 可以逐項核對的 checklist。

## 設計限制

- 不要把 hero 做成左右分割卡片
- 不要使用大量深藍、紫藍、單一色階造成一色到底
- 不要使用抽象漸層球、bokeh、裝飾 orb
- 不要把每個 section 都做成卡片
- 不要讓中文字壓縮、重疊或被圖片裁切
- 不要使用太多 font-weight 900
- 不要用看起來像 stock AI 的人物或假字圖
- 不要讓合作頁像企業簡報模板；它仍然要有 Matters 的公共書寫感

## 回報格式

請用以下格式：

1. 一句話總判斷
2. 寫作者頁設計修正
3. 機構合作頁設計修正
4. Typography spec
5. Image system spec
6. AI asset prompts
7. Section wire guidance
8. Mobile spec
9. 工程 checklist
10. 需要 Matters 補素材 / 決策
