import { sevenDayBookLanding as legacy } from "./seven-day-book";

const CDN = "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod";

export const contactEmail = "hi@matters.town";

// Matters 官方 campaign cover (imagedelivery CDN) — 本期主視覺．
// 早期版本嘗試以 AI 生成 placeholder 但品質不合格，改回官方素材。
const CURRENT_COVER = `${CDN}/campaignCover/b0246b96-bb14-4c82-af86-62fffbd9b14b.png/public`;
const CURRENT_HERO_COVER = `${CDN}/campaignCover/b0246b96-bb14-4c82-af86-62fffbd9b14b.png/w=1920,h=1080,fit=contain,background=F0F9FE`;

export const currentIssue = {
  title: "我的職場人格",
  status: "進行中",
  period: "2026/5/4 - 2026/5/11",
  participants: "72",
  eventHref: "https://matters.town/e/wem6xy6u7okv",
  announcementHref: "https://matters.town/a/kp08wnkn1p0o",
  cover: CURRENT_COVER,
  heroCover: CURRENT_HERO_COVER,
  originalCover: CURRENT_COVER,
  summary:
    "這一期，我們把視線從職稱移開，寫那個會疲累、會逞強、會渴望被理解，也仍然想在工作裡保有自己的人。",
  prompts: [
    {
      day: "Day 1",
      date: "5/4",
      state: "past",
      title: "職業路徑",
      prompt:
        "回望你一路走來的工作選擇：那些轉彎、停留、被推著往前的時刻，怎麼把你帶到今天？",
    },
    {
      day: "Day 2",
      date: "5/5",
      state: "past",
      title: "不像自己的時刻",
      prompt:
        "想起一個你在工作裡「演得不像自己」的時刻。那個你是怎麼出現的？又替你擋下了什麼？",
    },
    {
      day: "Day 3",
      date: "5/6",
      state: "past",
      title: "身心痕跡",
      prompt:
        "工作曾在你的身體或心裡留下什麼痕跡？可能是一種疲憊、一個姿勢，也可能是很久才懂的警訊。",
    },
    {
      day: "Day 4",
      date: "5/7",
      state: "past",
      title: "經營人設",
      prompt:
        "你是否曾經有意識地經營某個職場面向？那個人設幫過你什麼，又讓你失去什麼？",
    },
    {
      day: "Day 5",
      date: "5/8",
      state: "today",
      title: "困難時刻",
      prompt:
        "寫下某個很難熬的工作時刻。現在回看，它照出了你哪一種原本沒發現的能力或脆弱？",
    },
    {
      day: "Day 6",
      date: "5/9",
      state: "locked",
      title: "甘願犧牲",
      prompt:
        "有沒有哪一次，你明知道會辛苦，仍然選擇多承擔一點？那份甘願背後，是什麼在支撐你？",
    },
    {
      day: "Day 7",
      date: "5/10",
      state: "locked",
      title: "工作也可以這樣",
      prompt:
        "寫一個讓你重新想像工作的時刻：原來工作也可以這樣安排、這樣相處，甚至這樣活。",
    },
  ],
};

export const shared = {
  joinHref: currentIssue.eventHref,
  partnersHref: "partners/",
  contactHref: `mailto:${contactEmail}?subject=${encodeURIComponent("七日書合作洽談")}`,
  avatarWall: legacy.avatarWall,
  grandBadge: legacy.passport,
};

export const audiencePage = {
  title: "七日書｜下一個七天，一起寫",
  description:
    "七日書是 Matters 每月一次的書寫活動：七天、七個題目，和其他文友一起把生活寫成一本小書。",
  hero: {
    eyebrow: "Matters 自由寫",
    headline: "把一週，寫成一本有人同行的小書。",
    lead: "每月初，七日書會打開七道題目。你可以從一段職場記憶、一件衣服、一種氣味開始，在同一個七天裡，和素未謀面的文友一起把生活寫下來。",
    primaryLabel: "加入寫作",
    secondaryLabel: "洽談合作",
  },
  stats: [
    {
      value: currentIssue.participants,
      label: "本期已加入文友",
      note: "我的職場人格活動頁",
    },
    { value: "3,000+", label: "累積參與人次", note: "自由寫官方整理" },
    { value: "9,000+", label: "累積作品", note: "寫下超過 800 萬字" },
    { value: "189", label: "大滿貫完成者", note: "完成七天七篇" },
  ],
  currentIssue,
  articlesHeading: "他們正在寫這些",
  articlesNote:
    "從最近一期作品開始讀起。精選不夠時，頁面會接上最新文章，讓正在發生的書寫被看見。",
  grandBadgeCopy: {
    kicker: "大滿貫徽章",
    title: "七天寫滿，為自己留下一枚時間印記。",
    body: "在正式寫作期完成七篇作品，就能獲得七日書大滿貫徽章。它不是排名，也不是獎盃，而是提醒你：有一週，你真的每天回到文字裡。",
  },
  pastThemesHeading: "如果你也想寫更多",
  lecturesHeading: "名家講座",
  faqHeading: "關於七日書",
  cta: {
    headline: "下一個七天，一起寫。",
    body: "不必先想好要成為怎樣的作者。留下 email，下一期題目開放時，我們提醒你一起開始。",
    button: "獲得活動提醒郵件",
  },
};

export const partnerPage = {
  title: "七日書｜機構合作",
  description:
    "七日書機構合作頁，整理歷次主題、參與數據、執行內容、講座與合作案例，提供文化機構與品牌洽談七日書共創。",
  // 機構頁 hero banner — 用「說聲告別，走向新的自己」主視覺，氣質適合對機構說明
  heroBanner: `${CDN}/campaignCover/94525f57-eb5e-4e4a-9b5c-88af2ccb097f.png/w=1376,h=5504,fit=scale-down,anim=false`,
  hero: {
    eyebrow: "For partners",
    headline: "把你的命題，交給上千個真實生活來回答。",
    lead: "七日書把展演、出版、公共議題或品牌主張轉成七天可書寫的提問。參與者寫下的不是問卷答案，而是能被閱讀、策展、收藏與延伸的生命經驗。",
    primaryLabel: "洽談合作",
    secondaryLabel: "加入寫作",
  },
  impact: [
    { value: "3,000+", label: "累積參與人次", emphasis: true },
    { value: "9,000+", label: "累積文章", emphasis: true },
    { value: "58%", label: "近四期七天寫作完成率", emphasis: false },
    { value: "約 40", label: "每期新加入用戶平均數", emphasis: false },
  ],
  businessSignals: [
    {
      title: "可策展的作品流",
      body: "同一組題目在七天內集中產出，活動結束後可以整理成選集、展場文字、電子報與社群內容。",
    },
    {
      title: "已被驗證的參與節奏",
      body: "七道題目、七天完成、徽章回饋，讓一次性徵文變成有節奏、有陪伴感的共同書寫。",
    },
    {
      title: "講座與內容資產可延伸",
      body: "自由寫講座累積出席人次超過 1000，可延伸成文字精華、逐字稿、問答與後續回放。",
    },
    {
      title: "線上到線下的轉接",
      body: "合作主題可延伸至實體展覽、入選文章清單、現場陳列與合作方自有社群導流。",
    },
  ],
  executionIntro: [
    {
      step: "01",
      title: "主題共創",
      body: "從合作方真正想打開的問題出發，把議題拆成七道有人願意回到自身經驗裡回答的題目。",
    },
    {
      step: "02",
      title: "七天同步書寫",
      body: "Matters 社群在同一週回應同一組題目，作品、作者與互動會自然聚合成可被追蹤的活動流。",
    },
    {
      step: "03",
      title: "整理為長期資產",
      body: "活動後留下的不只是參與數字，也可以是精選文章、講座文字稿、徽章、報告與展場內容。",
    },
  ],
  caseStudy: {
    ...legacy.caseStudy,
    headline: "一起設計下一個，能被上千人持續書寫的題目。",
    // 第一張為合作活動主視覺；其餘為近期合作脈絡相關 Matters 自由寫主題封面，
    // 暫作版面節奏輔助。實際兩廳院展場照片仍待 Matters 營運提供。
    gallery: [
      `${CDN}/cover/1060a3d5-cbb9-4140-9b04-a0acb011449a.jpeg/public`,
      `${CDN}/campaignCover/786b897f-c82d-4d4c-b92b-d20a75fe1218.png/public`,
      `${CDN}/campaignCover/98d56bea-4411-481f-947b-195438bae79c.png/public`,
    ],
    extension:
      "兩廳院合作之實體展覽照片、展場陳列說明與入選文章清單仍待 Matters 營運側補上。目前先以活動主視覺與相鄰主題封面呈現。",
  },
  packages: [
    {
      title: "主題共創",
      iconKind: "theme",
      body: "共同設計七道題目，讓你的議題被轉化成具體、可回應、可持續書寫的個人經驗。",
    },
    {
      title: "名家講座",
      iconKind: "lecture",
      body: "依主題邀請作家或專家主講，活動後整理文字精華，成為可長期搜尋與分享的內容資產。",
    },
    {
      title: "書寫憑證",
      iconKind: "badge",
      body: "完成者可獲得七日書徽章或鏈上參與憑證，讓參與感從活動週延伸到個人頁與社群關係。",
    },
  ],
  faqHeading: "如何與七日書合作",
  cta: {
    headline: "用書寫，擴大你的社群。",
    body: "從一個值得被回答的題目開始，讓你的社群用七天寫出比標語更長久的回聲。",
    primaryLabel: "洽談合作",
    secondaryLabel: "參與七日書寫作",
  },
};

// 過去主題視覺：直接引用 Matters 官方 campaignCover，避免 AI placeholder 的低完成度
const studioVisuals: Record<string, string> = {};

// 12 篇取自當期活動頁（matters.town/e/wem6xy6u7okv）SSR/__NEXT_DATA__ 解析；
// 不放 cover（多數作者未上傳），avatar 直接用真實 Matters CDN。
export const latestArticles = [
  {
    title: "易未央 AI 世界 × 我的職場人格5",
    author: "因田木",
    summary: "第五天：職場困難時刻。",
    href: "https://matters.town/a/3k94y9x4dzaq",
    avatar: `${CDN}/avatar/36f9d854-6168-46ee-afad-9f3a96f41cd7.jpeg/public`,
  },
  {
    title: "看不見的暴力，和一本沒人要求我寫的書",
    author: "mythogen.engine",
    summary: "「不知道有沒有救到」比「沒救到」更難捱──沒有事實，沒有結論，只有一個永遠不會被回答的問題。",
    href: "https://matters.town/a/iff4jej2f33p",
    avatar: `${CDN}/avatar/cf0835df-34d7-473e-a9df-a5d9463e26d8.webp/public`,
  },
  {
    title: "不想當間諜的採購經理，不是好藝術家",
    author: "Anne",
    summary: "我那橫跨三界的「專業」人設。",
    href: "https://matters.town/a/dgkyaadpyvql",
    avatar: `${CDN}/avatar/233c2fca-f34c-48d6-8cdf-2ccc2579a5d1.jpeg/public`,
  },
  {
    title: "職場進化論：從大聲通耳屎到優雅裝軟弱",
    author: "Anne",
    summary: "在職場打滾多年，重新理解責任感與清爽的距離。",
    href: "https://matters.town/a/bmffxkppo9r1",
    avatar: `${CDN}/avatar/233c2fca-f34c-48d6-8cdf-2ccc2579a5d1.jpeg/public`,
  },
  {
    title: "七日書 S21.4 — 只有一號表情",
    author: "Moonleap",
    summary: "不出錯、不沾鍋、準時下班、不需要說話就不說話。",
    href: "https://matters.town/a/99r3ryzts7c0",
    avatar: `${CDN}/avatar/dba0352e-73b1-4254-ba8e-b6b314d9d608.png/public`,
  },
  {
    title: "我的職場人格 — 傳承",
    author: "黎明之弧",
    summary: "傳承，是點一盞燈，照亮後來的路。",
    href: "https://matters.town/a/gjgjbgraujnh",
    avatar: `${CDN}/avatar/0effabfd-8a41-4a48-bfab-ff6f6386b45a.jpeg/public`,
  },
  {
    title: "第五天｜長期業績都是零",
    author: "waiwaili",
    summary: "我真的沒這本事，我認輸了。",
    href: "https://matters.town/a/vzlybqxf53zy",
    avatar: `${CDN}/avatar/05cf3c7b-6788-4d34-9d63-4f6f671a9975.jpeg/public`,
  },
  {
    title: "《我職七日書》第五天〈承擔不起的暗潮〉",
    author: "蘇禕Suy",
    summary: "我進連鎖文具店前，在藥局工作。沒有醫學背景，卻要面對配藥與過敏注意。",
    href: "https://matters.town/a/9ei1vs7fypmh",
    avatar: `${CDN}/avatar/457bc512-a308-4068-bfe9-113d9923dd26.jpeg/public`,
  },
  {
    title: "別人笑我太瘋癲",
    author: "陳費雪",
    summary: "我的職場人設就是「瘋子」。",
    href: "https://matters.town/a/51l83q4vz0fe",
    avatar: `${CDN}/avatar/55c2bcde-d024-43ca-a991-b879ee3cb830.jpeg/public`,
  },
  {
    title: "來者不拒是心裡的軟弱",
    author: "宥縈",
    summary: "為了滿足主管常常忘了自己也有極限，需要停下來休息。",
    href: "https://matters.town/a/8c2our5yg4on",
    avatar: `${CDN}/avatar/609d122b-ed12-41ee-b838-b2aa83c6f776.jpeg/public`,
  },
  {
    title: "《職場七日書》第四天 — 在溫和與強硬之間遊走",
    author: "crossing",
    summary: "職場如戲，我不停切換不同角色。",
    href: "https://matters.town/a/cqbipbg9pp1g",
    avatar: `${CDN}/avatar/4bf028dd-9464-4c2e-ad11-3fe17f67c661.png/public`,
  },
  {
    title: "[七日書] 職場人格 — 做老白男 让别人无路可走！",
    author: "IceYuzu",
    summary: "我多年的职场观察告诉我，最后赢的人永远都是老白男。",
    href: "https://matters.town/a/5bvbawrhwh1a",
    avatar: `${CDN}/avatar/d78220da-1d68-4f94-bf0c-87e0c6181a4f.jpeg/public`,
  },
];

// 將 season "YYYY-MM" 改為「YYYY / M」格式，給過去主題卡片用月份替代詳細日期
const toMonthLabel = (season: string) => {
  const [y, m] = season.split("-");
  return `${y} / ${Number(m)}`;
};

export const historicalThemes = legacy.events.map((event) => {
  const monthLabel = toMonthLabel(event.season);
  if (event.name === "我的職場人格") {
    return {
      ...event,
      phase: "進行中",
      participants: 72,
      writingWindow: "2026/5/4 - 5/11",
      monthLabel,
      description: currentIssue.summary,
      visual: studioVisuals[event.name] ?? event.cover,
    };
  }

  if (event.name === "氣味博物館") {
    return {
      ...event,
      phase: "完結",
      participants: 88,
      newcomers: 26,
      writingWindow: "2026/4/6 - 4/13",
      monthLabel,
      visual: studioVisuals[event.name] ?? event.cover,
    };
  }

  return {
    ...event,
    monthLabel,
    visual: studioVisuals[event.name] ?? event.cover,
  };
});

export const pastThemes = historicalThemes.filter(
  (theme) => theme.name !== currentIssue.title,
);

export const lectures = [
  {
    speaker: "陳雪",
    role: "作家",
    theme: "衣櫥裡的自我",
    title: "我與我所穿出的模樣：一場從衣櫥出發的自我探問",
    summary: "從衣著、品味與生命經驗出發，談如何在外界眼光中保護自己的自我。",
    href: "https://matters.town/a/ij9xgxuznv6a",
    image: `${CDN}/cover/9253170f-7cda-408f-a8fd-e38abbada800.png/public`,
    hasTranscript: true,
  },
  {
    speaker: "郭強生",
    role: "作家",
    theme: "兩廳院藝術出走 · 給自己的情書",
    title: "從記憶出發的書寫課：談寫作、生命與死亡",
    summary: "以寫作整理與療癒人生，把私人記憶轉化為能被閱讀的故事。",
    href: "https://matters.town/a/uhw6btkzwf63",
    image: `${CDN}/embed/7ec6e254-0d21-4e30-8bca-65c7b6526faf.jpeg/public`,
    hasTranscript: true,
  },
  {
    speaker: "宋尚緯",
    role: "詩人",
    theme: "我的人生帳本",
    title: "人生與金錢的書寫",
    summary: "從金錢、階級與安全感切入，陪文友把帳本背後的生命經驗寫出來。",
    href: "https://matters.town/a/zl1tkmcgkx3s",
    image: `${CDN}/campaignCover/2e4aac3f-a9e3-4155-8a4e-7276420e3655.png/public`,
    hasTranscript: false,
  },
  {
    speaker: "周慧",
    role: "作家",
    theme: "重構生活",
    title: "離開都市之後，如何重新搭起生活",
    summary: "從四十歲後的生活變動與日常書寫，談重構經驗如何變成作品。",
    href: "https://matters.town/e/3uskpxsbzmz5",
    image: `${CDN}/campaignCover/98d56bea-4411-481f-947b-195438bae79c.png/public`,
    hasTranscript: false,
  },
];

export const audienceFaq = [
  {
    q: "七日書一定要每天寫嗎？",
    a: "不一定，但我們鼓勵每天留下 20 到 30 分鐘。七日書的重點不是寫得完美，而是讓思緒連續七天有一個出口。",
  },
  {
    q: "我中途才看到活動，還可以加入嗎？",
    a: "可以。晚鳥期間一樣可以加入與發文；若想取得大滿貫徽章，需依當期規則完成正式報名與七篇作品。",
  },
  {
    q: "沒寫完會怎樣？",
    a: "沒寫完也沒關係，你已經留下了這一期的一部分。只是大滿貫徽章會保留給完成七篇的文友。",
  },
  {
    q: "我的文章會公開嗎？",
    a: "會依你在 Matters 發布文章時的設定公開。活動頁會依日期收錄參與七日書的文章，方便文友互相閱讀與留言。",
  },
];

export const partnerFaq = [
  {
    q: "合作方需要先準備完整題目嗎？",
    a: "不需要。合作通常從一個主題、展演、出版或公共議題開始，再由七日書團隊協助轉成七道可書寫的提問。",
  },
  {
    q: "合作可以只做線上活動嗎？",
    a: "可以。也可以加入講座、展場陳列、選集、實體活動或電子報，視合作方目標與檔期安排。",
  },
  {
    q: "活動成果可以怎麼交付？",
    a: "常見形式包括活動頁、精選文章清單、完結報告、講座文字精華、社群素材、展場文字與徽章參與紀錄。",
  },
  {
    q: "多久前需要開始洽談？",
    a: "建議至少提前四到六週，保留題目共創、視覺素材、講座邀請、宣傳節奏與活動頁整理時間。",
  },
];
