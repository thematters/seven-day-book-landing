// 金句牆的「主題面向」分類 —— 下拉只列這 6 個大面向。
//
// 使用者看不到各期主題名稱，只看到面向；某期活動選出的金句，會依 themeToFacet
// 自動歸到所屬面向（例如「曖昧時刻」的金句 → 呈現在「關係與情感」底下）。
//
// 新增活動時：在 themeToFacet 補一行「主題 → 面向」即可，其餘不用動。

export type FacetKey =
  | "relation"
  | "self"
  | "place"
  | "daily"
  | "memory"
  | "life";

// 下拉列出的 6 個面向（含前面的小色點顏色）
export const FACETS: { key: FacetKey; label: string; dot: string }[] = [
  { key: "relation", label: "關係與情感", dot: "#ED93B1" },
  { key: "self", label: "自我與認同", dot: "#AFA9EC" },
  { key: "place", label: "地方與空間", dot: "#5DCAA5" },
  { key: "daily", label: "日常與物件", dot: "#EF9F27" },
  { key: "memory", label: "記憶與感官", dot: "#F0997B" },
  { key: "life", label: "生命與存在", dot: "#85B7EB" },
];

// 活動主題（正式標題）→ 面向
export const themeToFacet: Record<string, FacetKey> = {
  // 關係與情感
  曖昧時刻: "relation",
  "長女症候群，燃燒自我的故事": "relation",
  我的家庭故事: "relation",
  愛與親密關係: "relation",
  // 自我與認同
  我的職場人格: "self",
  數位雲端的我: "self",
  衣櫥裡的自我: "self",
  "我的（不）完美人生": "self",
  "島嶼精神，另類人生": "self",
  我的成長軌跡: "self",
  // 地方與空間
  書寫地方: "place",
  家與故鄉: "place",
  空間與地方: "place",
  // 日常與物件
  我的人生帳本: "daily",
  "物的體系，我的物件錄": "daily",
  我的人生飯桌: "daily",
  // 記憶與感官
  集體記憶: "memory",
  氣味博物館: "memory",
  人間鬼故事: "memory",
  // 生命與存在
  無用之用: "life",
  "說聲告別，走向新的自己": "life",
  重構生活: "life",
  標記回憶的位置與意義: "life",
  "關於人生，我想說的是": "life",
  "What if 人生有如果": "life",
  書寫人生的靈魂提問: "life",
};
