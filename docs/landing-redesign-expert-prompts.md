# 七日書 Landing 改版專家 Prompts

## 1. 文案改寫 Prompt

你是資深華文品牌文案與文化活動策展寫手。請為 Matters「七日書」重寫兩個 landing page 的全部可見文案：一頁面向個人寫作者，一頁面向機構合作方。語氣使用繁體中文、台灣用語，保留 Matters 自由寫的溫度與公共書寫感，不要像任務說明、需求清單或臨時 placeholder。寫作者頁要讓人感覺「我不是一個人在寫」，機構頁要讓人理解這是一套能把公共命題轉成可持續書寫、策展與社群連結的活動機制。保留既有事實與 CTA：加入寫作、洽談合作、獲得活動提醒郵件、參與七日書寫作。避免誇大不可驗證的數據，不使用行銷空話。

## 2. 版型與圖片修復 Prompt

你是資深 landing page art director 與前端設計師。請診斷七日書 landing page 中圖片中文字被裁切、日期卡序號錯位、圖文卡資訊過密、合作頁模組缺乏視覺節奏的問題。修正方向：所有含中文字的活動封面不得被 `object-fit: cover` 裁掉，若作為縮圖必須改成 contain 或改用 text-free background；Day 1 到 Day 7 改成橫向解鎖卡片；文章卡改成可互動翻轉卡片；合作模組需有成套 icon；整體遵守 Matters design system 的 Freewrite palette，避免重複卡片堆疊造成呆板。

## 3. gpt-image-2 Icon Prompt：主題共創

Create a square icon asset in the same warm, dimensional emblem style as a Seven Day Book Writing Passport badge. Subject: theme co-creation for a literary writing challenge. Visual metaphor: two folded paper sheets or book pages meeting at the center, with a small pencil spark and a calendar notch. Use warm golden orange, coral red, soft cream, and deep ink details. Rounded shield-like silhouette, subtle layered paper depth, clean vector-like edges, no readable text, no logo, no watermark. Centered composition, generous padding, suitable for a 96px website icon. Output as a polished raster icon on a flat removable background.

## 4. gpt-image-2 Icon Prompt：名家講座

Create a square icon asset in the same warm, dimensional emblem style as a Seven Day Book Writing Passport badge. Subject: author lecture / literary talk. Visual metaphor: an open book forming a small stage, a microphone, and a warm spotlight arc. Use warm golden orange, coral red, soft cream, and deep ink details. Rounded shield-like silhouette, subtle layered paper depth, clean vector-like edges, no readable text, no logo, no watermark. Centered composition, generous padding, suitable for a 96px website icon. Output as a polished raster icon on a flat removable background.

## 5. gpt-image-2 自由寫底圖 Prompt

Create a text-free Seven Day Book / Freewrite prompt-card background for a batch of Traditional Chinese topic cards. It should feel literary, playful but calm, and suitable for Matters Freewrite. Use a consistent series visual system with books, page edges, bookmarks, calendar tabs, quiet reading objects, and small town commons motifs. Leave large clean areas for code-native day numbers and Traditional Chinese topic text. Use the Freewrite palette: airy pale blue, clear blue accent, deep blue text tone, white paper, small warm orange/coral details inspired by the Writing Passport badge. No readable text, no logo, no watermark. Produce multiple variants for themes: workplace persona, closet/self, smell museum, life ledger.

## 6. Blog-pro 互動卡片 Prompt

你是互動敘事介面設計師。請把「他們正在寫這些」改成 mashbean/blog-pro 風格的互動卡片：卡片正面是作者與標題，背面是短摘句與閱讀 CTA；點擊翻面，背面可進入文章；桌面有細緻翻轉、hover elevation、紙張紋理與個別色彩，手機上保持單欄、不卡頓、文字不被裁切。不依賴 React，在 Astro 頁面用 HTML/CSS/少量原生 JS 完成。

## 7. 七天解鎖卡 Prompt

你是活動產品設計師。請把 Day 1 到 Day 7 題目改回橫向日期卡片：每張卡包含日期、Day、短標題、題目提示，呈現已開放、今日、尚未開放的差異。整排要像一週慢慢翻開的小書，不像表格或工作任務。桌面可橫向一排或輕微 overflow，手機保留水平滑動。不得顯示預設 `ol` 序號，避免序號卡在欄位中間。
