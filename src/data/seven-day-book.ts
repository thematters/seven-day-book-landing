// 七日書 Landing legacy data slim — 已剔除過時 stats / pulse / partners 等
// 大多數欄位（CC ys 第三階段後 active code 不再引用，數字也跟現實脫節）。
//
// 目前僅保留 seven-day-campaign.ts 透過 `legacy.*` 真正引用的兩個 field：
//   - avatarWall：頭像跑馬燈（landing #stats / partnership #impact 用）
//   - passport.link：landing 「看大滿貫名單與徽章公告」連結
//
// 所有累計數字現在統一從 src/data/freewrite-marathoners.ts ground truth import。
// 舊版完整檔（含過時 9,000/3,000/189 hardcoded 等）見 git history (commits 早於 020f85a)。

const CDN = "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod";

export const sevenDayBookLanding = {
  avatarWall: [
    { handle: "xiaomaomigigi", name: "司陶", src: `${CDN}/avatar/99e44d7b-052d-45dc-ae9b-a7bc24c650a8.jpeg/public` },
    { handle: "yuuuuu_cc", name: "俞木瑜", src: `${CDN}/avatar/1fa50bea-4bbc-4211-8cf3-772ec5394232.jpeg/public` },
    { handle: "yumimatcha", name: "裕美抹茶", src: `${CDN}/avatar/d930d2f8-3360-46e0-8e29-e9a1b72314e3.jpeg/public` },
    { handle: "nomatterwhat123", name: "K的一生", src: `${CDN}/avatar/ea91fbd6-717b-4b3f-b138-97d50b13653f.jpeg/public` },
    { handle: "potions_17", name: "野貓", src: `${CDN}/avatar/5e65ffc9-237e-4618-b320-90225ddd9121.png/public` },
    { handle: "katodot", name: "'' 空瓦", src: `${CDN}/avatar/f769da76-d0ba-429a-b854-15a459695ff8.jpeg/public` },
    { handle: "heresydcomes", name: "锡德不在此", src: `${CDN}/avatar/f2e7eee2-b24c-450e-b5e9-3f3ecdd906c5.jpeg/public` },
    { handle: "inmyewigkeit", name: "inmyewigkeit", src: `${CDN}/avatar/8de197d2-ae74-4a53-a162-7df89bd908d3.jpeg/public` },
    { handle: "moe645184", name: "Chechin", src: `${CDN}/avatar/768fe48a-edb9-40d4-8496-74d725079ea3.jpeg/public` },
    { handle: "rrjw0902", name: "攝氏衛生", src: `${CDN}/avatar/00b8913c-61bb-459c-8cff-1f53aee11ab0.jpeg/public` },
    { handle: "histeria", name: "小樹", src: `${CDN}/avatar/2fe83d99-0843-4884-95b4-8917220f3597.jpeg/public` },
    { handle: "thermometer", name: "Thermometer", src: `${CDN}/avatar/7e640fc4-8c2a-4602-9791-cba955c87c37.jpeg/public` },
    { handle: "eatandsheet", name: "eatandsheet", src: `${CDN}/avatar/fb48d335-892a-4854-bfd1-6ecbaf04059b.jpeg/public` },
    { handle: "some_any_nothin", name: "小隱於野", src: `${CDN}/avatar/bf2f8559-6215-4ea0-984e-c2e64df07af8.jpeg/public` },
    { handle: "hana2002", name: "Hana", src: `${CDN}/avatar/40b3cfb2-15eb-44d6-82cc-e9ba993fe5d8.png/public` },
    { handle: "paperplanedown", name: "零号样本", src: `${CDN}/avatar/3adefcf6-6c56-46ce-bf6b-204134986d82.jpeg/public` },
    { handle: "charlesmungerai", name: "窮查理．蒙哥", src: `${CDN}/avatar/e5b8d49a-e0e2-40a4-a517-07f39f0c9de1.png/public` },
    { handle: "belivelyyy", name: "Belive", src: `${CDN}/avatar/4f805927-f74f-4b39-8a5e-a6f40198e7e3.jpeg/public` },
    { handle: "Jyuan1023", name: "YuAn", src: `${CDN}/avatar/1f2fc00f-8aaf-4e59-9c0a-137e11c25415.jpeg/public` },
    { handle: "leeannetour", name: "Anne", src: `${CDN}/avatar/233c2fca-f34c-48d6-8cdf-2ccc2579a5d1.jpeg/public` },
    { handle: "westbamboo", name: "竹西", src: `${CDN}/avatar/b296e669-5929-41b4-a3ff-9a5585123839.jpeg/public` },
    { handle: "Denji_333", name: "飛非", src: `${CDN}/avatar/5ff0ac6b-fba8-430e-8422-3660358870af.jpeg/public` },
    { handle: "linnea", name: "Linnea", src: `${CDN}/avatar/dbbbf9d9-f41f-4c1e-b489-80fe45b5b7ed.png/public` },
    { handle: "iforissac", name: "鯨魚男孩", src: `${CDN}/avatar/aa42ea23-8d10-47c9-90cd-d6900cddf600.jpeg/public` },
    { handle: "katetukt", name: "凱特的故事沙龍", src: `${CDN}/avatar/6e8f05c0-cce6-474a-96c9-585c3dcce8f6.jpeg/public` },
    { handle: "ingotw", name: "因田木", src: `${CDN}/avatar/36f9d854-6168-46ee-afad-9f3a96f41cd7.jpeg/public` },
    { handle: "ningning", name: "yunlu6", src: `${CDN}/avatar/16c788c6-2b4f-4882-bec8-fe76f2f9e81d.jpeg/public` },
    { handle: "yomi", name: "yomi", src: `${CDN}/avatar/8f4c4b94-fdde-4c50-ad89-0c06f70ed790.jpeg/public` },
    { handle: "ecrire", name: "岱兮", src: `${CDN}/avatar/c65d5bd2-a0f3-40fd-abe1-3d7d4807b8b1.jpeg/public` },
  ],

  // legacy.passport — 只剩 link 被引用為 landing #badge 旁的「看大滿貫名單與徽章公告」連結
  passport: {
    link: {
      label: "看大滿貫名單與徽章公告",
      href: "https://matters.town/a/u1510gz5by6o",
    },
  },
};
