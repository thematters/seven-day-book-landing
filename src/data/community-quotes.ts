// 七日書社群精華句子 — 由 scripts/curate-community-quotes.mjs (2026-06-25) 自動產生
// 從 freewriteFeatured 用文本分析評分（長度 / 具體性 / 情感 / 詩意）抽出每期最高分句
// 跨期分散，目前取 8 句。
// 重跑：node scripts/curate-community-quotes.mjs --write
//
// ⚠️ 抽出來後人工再 review 一遍，可以手動調整 text / 順序

export interface CommunityQuote {
  text: string;             // 引文（不含開頭引號 / 句尾標點）
  author: string;           // displayName
  userName: string;         // matters handle
  avatar: string | null;
  campaignName: string;     // 完整 campaign name
  campaignLabel: string;    // 簡短 label (去「七日書｜」)
  articleHash: string;      // matters.town/a/{hash}
}

export const communityQuotes: CommunityQuote[] = [
  { text: "虽然它不再实用，我还是把它像纪念品似的留在身边，用来纪念那些漫长的冬天", author: "岱兮", userName: "ecrire", avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/c65d5bd2-a0f3-40fd-abe1-3d7d4807b8b1.jpeg/public", campaignName: "七日書｜衣櫥裡的自我", campaignLabel: "衣櫥裡的自我", articleHash: "jsqrgrt8yf2h" },
  { text: "這是一種奇怪、恰到好處的距離：遠到不需要互動，近到偶爾會想看看她現在過得如何", author: "Tony_Chan", userName: "voxmirror", avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/bdd22741-d5fe-4446-ab44-9b027688f236.png/public", campaignName: "七日書｜數位雲端的我", campaignLabel: "數位雲端的我", articleHash: "7a0mdm7rq3qe" },
  { text: "這些「如果」從未發生，但這些想像，讓我知道人生不只一種可能", author: "A.J.", userName: "alexwu5", avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/2bf9997c-212a-439e-8aa2-8ab37bf5d095.jpeg/public", campaignName: "七日書一週年｜寫作，給人生的靈魂提問", campaignLabel: "七日書一週年｜寫作，給人生的靈魂提問", articleHash: "122mm1d8kuhm" },
  { text: "我走在人行道边缘，听见鞋底摩擦地面的声音，忽然想起很多年前在县城念书时的夜晚，那…", author: "jaded.chen", userName: "jadedchen", avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/89f9a9df-ab1d-4517-a01f-8eb0dbf94997.png/public", campaignName: "七日書｜重構生活", campaignLabel: "重構生活", articleHash: "vjt2eetiw6hp" },
  { text: "搭乘著夢想裡的飛機，從迪士尼的公主禮服中，看見了自己原來可以這麼滿足", author: "糖果屋", userName: "bonbonbinich", avatar: null, campaignName: "七日書｜我的人生帳本", campaignLabel: "我的人生帳本", articleHash: "g1k9h7kas6go" },
  { text: "是離開海島、重返現實的那一刻——所有的美好像夢一樣迅速消散", author: "yomi", userName: "yomi", avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/8f4c4b94-fdde-4c50-ad89-0c06f70ed790.jpeg/public", campaignName: "七日書：書寫地方", campaignLabel: "書寫地方", articleHash: "8kgndejck9vm" },
  { text: "或者是記下你曾經去過的島，來回水陸路上的風景、島上風光、人際交流等", author: "YSC 。角落與世界 。", userName: "klaviercindy", avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/7eebba52-2c0b-40cb-8423-d56184a552f8.jpeg/public", campaignName: "七日書：島嶼精神，另類人生", campaignLabel: "島嶼精神，另類人生", articleHash: "n8vd225ekc8a" },
  { text: "比方說，那些曾讓你放不下、纏繞著你、坐立不安的事情，終於「come out」的時刻", author: "siaosiaosiusiu", userName: "wuxiaoxiao", avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/b414206b-f2a6-4369-b372-69873f57fea5.jpeg/public", campaignName: "七日書：人間鬼故事", campaignLabel: "人間鬼故事", articleHash: "6o5msh712w94" },
];
