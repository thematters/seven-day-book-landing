// 金句牆專用的「本期」設定 —— 跟博物館的 currentIssue 拆開、各管各的。
//
// 每出一期新活動，只要改下面這三行 → commit / push → GitHub 自動 build＋部署，
// 金句牆的本期便利貼＋「參與本期寫作」按鈕就會更新。
//
// 注意：博物館首頁的「本月七題」是另一份資料（src/data/seven-day-campaign.ts 的
// currentIssue），不受這裡影響，要分開維護。
export const memoWallCurrent = {
  title: "無用之用", // 本期主題（正式標題）
  month: "2026 年 6 月", // 顯示在便利貼上的活動月份
  eventHref: "https://matters.town/e/nxy5zqcjs7lt", // 「參與本期寫作」連到的活動頁
};
