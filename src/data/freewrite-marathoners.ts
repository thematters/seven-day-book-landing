// 七日書馬拉松選手 — 從 24 期 freewrite campaigns 的 participants 累計而成
// 抓取日期 2026-05-09，來源 server.matters.town/graphql
// 全站累計參與 3913 人次、2011 位獨立文友
// 詳見 research/freewrite-marathoners.json (含全部 50 名 + 各 campaign meta)

export interface Marathoner {
  userName: string;
  displayName: string;
  avatar: string;
  count: number;          // 參與過幾期七日書 / 三日書
  campaigns: string[];    // 那幾期的 campaign shortHash
}

export const totalParticipations = 3913;
export const uniqueUsers = 2011;
export const eventCount = 24;

export const marathoners: Marathoner[] = [
  {
    userName: "jerryku2003",
    displayName: "JK_talk",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/25ab67ca-201a-415e-b6b6-9110034f0b64.jpeg/public",
    count: 24,
    campaigns: ["wem6xy6u7okv", "aiafcgbu89p2", "q48dv6ve4g2m", "4v5mndkbz44v", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "kn7h01eku617", "26uhbm3uh6rg", "2hb97w8rdn7k", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "jingthereforeim",
    displayName: "KJOH",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/9131eb1a-ac6a-474d-94bf-3587f2cc36f0.jpeg/public",
    count: 24,
    campaigns: ["wem6xy6u7okv", "aiafcgbu89p2", "q48dv6ve4g2m", "4v5mndkbz44v", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "kn7h01eku617", "26uhbm3uh6rg", "2hb97w8rdn7k", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "yingshinlee",
    displayName: "映昕",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/d4912a5e-978f-43fd-aa9c-fc7458b164c6.png/public",
    count: 24,
    campaigns: ["wem6xy6u7okv", "aiafcgbu89p2", "q48dv6ve4g2m", "4v5mndkbz44v", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "kn7h01eku617", "26uhbm3uh6rg", "2hb97w8rdn7k", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "hahahappyqq",
    displayName: "Hsuan",
    avatar: "",
    count: 23,
    campaigns: ["wem6xy6u7okv", "aiafcgbu89p2", "q48dv6ve4g2m", "4v5mndkbz44v", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "26uhbm3uh6rg", "2hb97w8rdn7k", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "qianfluentleap",
    displayName: "Moonleap",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/dba0352e-73b1-4254-ba8e-b6b314d9d608.png/public",
    count: 22,
    campaigns: ["wem6xy6u7okv", "q48dv6ve4g2m", "4v5mndkbz44v", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "kn7h01eku617", "26uhbm3uh6rg", "2hb97w8rdn7k", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "alyssandtige",
    displayName: "Alyssa 亞莉莎",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/5288ffda-8915-4667-94c1-4e53583fb5cb.jpeg/public",
    count: 20,
    campaigns: ["wem6xy6u7okv", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "kn7h01eku617", "26uhbm3uh6rg", "2hb97w8rdn7k", "4nqnizsygmcn", "f7rpyecg32mg", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "dobby",
    displayName: "自由精靈｜多比",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/28e3a21a-e92f-4d5a-ae71-3d438bd2d6d2.jpeg/public",
    count: 20,
    campaigns: ["wem6xy6u7okv", "aiafcgbu89p2", "q48dv6ve4g2m", "4v5mndkbz44v", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "kn7h01eku617", "26uhbm3uh6rg", "2hb97w8rdn7k", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "ybs0lqsrpmhn"],
  },
  {
    userName: "xiaohanliu0105",
    displayName: "千翊晨",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/608eebb1-9f70-4e55-83d1-ef1df5686952.jpeg/public",
    count: 20,
    campaigns: ["aiafcgbu89p2", "q48dv6ve4g2m", "4v5mndkbz44v", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "26uhbm3uh6rg", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "gunshock",
    displayName: "根叔｜gunshock",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/d44f05ce-b60f-4825-82a7-1b33a981f685.png/public",
    count: 19,
    campaigns: ["wem6xy6u7okv", "q48dv6ve4g2m", "nqbeo3cdn585", "ox9fmcz6zxxj", "owt3jxplay6z", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "kn7h01eku617", "26uhbm3uh6rg", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "iceyuzu",
    displayName: "IceYuzu",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/d78220da-1d68-4f94-bf0c-87e0c6181a4f.jpeg/public",
    count: 18,
    campaigns: ["wem6xy6u7okv", "aiafcgbu89p2", "q48dv6ve4g2m", "4v5mndkbz44v", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "rt04oolqbexh", "5zhf2bpty274", "efkk0l9hcg96", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "jrandtime",
    displayName: "蘇禕Suy",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/457bc512-a308-4068-bfe9-113d9923dd26.jpeg/public",
    count: 18,
    campaigns: ["wem6xy6u7okv", "aiafcgbu89p2", "q48dv6ve4g2m", "4v5mndkbz44v", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "26uhbm3uh6rg", "2hb97w8rdn7k", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u"],
  },
  {
    userName: "klaviercindy",
    displayName: "YSC 。角落與世界 。",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/7eebba52-2c0b-40cb-8423-d56184a552f8.jpeg/public",
    count: 17,
    campaigns: ["q48dv6ve4g2m", "4v5mndkbz44v", "3uskpxsbzmz5", "rt04oolqbexh", "5zhf2bpty274", "efkk0l9hcg96", "kn7h01eku617", "26uhbm3uh6rg", "2hb97w8rdn7k", "4nqnizsygmcn", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "leeannetour",
    displayName: "Anne",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/233c2fca-f34c-48d6-8cdf-2ccc2579a5d1.jpeg/public",
    count: 16,
    campaigns: ["wem6xy6u7okv", "aiafcgbu89p2", "q48dv6ve4g2m", "4v5mndkbz44v", "ox9fmcz6zxxj", "3uskpxsbzmz5", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "26uhbm3uh6rg", "2hb97w8rdn7k", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u", "scx3f16y37v6"],
  },
  {
    userName: "histeria",
    displayName: "小魔莉",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/2fe83d99-0843-4884-95b4-8917220f3597.jpeg/public",
    count: 15,
    campaigns: ["wem6xy6u7okv", "aiafcgbu89p2", "4v5mndkbz44v", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "kn7h01eku617", "26uhbm3uh6rg", "4nqnizsygmcn", "f7rpyecg32mg"],
  },
  {
    userName: "coalpp2020",
    displayName: "李炜",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/2a7ed553-f321-4030-bc3d-ca730d6a7839.jpeg/public",
    count: 15,
    campaigns: ["q48dv6ve4g2m", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "h2ya9xxjubd2", "efkk0l9hcg96", "kn7h01eku617", "26uhbm3uh6rg", "2hb97w8rdn7k", "eqsfuc3qph6u", "8t5liudbtpup", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "ceres",
    displayName: "Ceres",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/8dc19286-53b9-46e0-b55a-6e015a17bd0b.jpeg/public",
    count: 14,
    campaigns: ["3uskpxsbzmz5", "owt3jxplay6z", "5zhf2bpty274", "efkk0l9hcg96", "26uhbm3uh6rg", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "klg50130",
    displayName: "大風",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/17250908-4968-4ba0-b367-1f0a5f680077.jpeg/public",
    count: 14,
    campaigns: ["rt04oolqbexh", "h2ya9xxjubd2", "efkk0l9hcg96", "kn7h01eku617", "26uhbm3uh6rg", "4nqnizsygmcn", "f7rpyecg32mg", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "chen0708",
    displayName: "si薰",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/9dbc77e4-b382-4eda-b443-3cf2904c6222.png/public",
    count: 13,
    campaigns: ["4v5mndkbz44v", "ox9fmcz6zxxj", "3uskpxsbzmz5", "rt04oolqbexh", "5zhf2bpty274", "efkk0l9hcg96", "2hb97w8rdn7k", "f7rpyecg32mg", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "wenqian",
    displayName: "文倩",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/5b5dd8ba-34bc-4e60-8b4d-739ddf6ca6c1.jpeg/public",
    count: 13,
    campaigns: ["ox9fmcz6zxxj", "3uskpxsbzmz5", "rt04oolqbexh", "efkk0l9hcg96", "26uhbm3uh6rg", "4nqnizsygmcn", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "nilongqiuqiu77",
    displayName: "隆秀",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/fac815f9-c1cf-4ac9-b7ee-61fac449e30d.jpeg/public",
    count: 13,
    campaigns: ["3uskpxsbzmz5", "owt3jxplay6z", "5zhf2bpty274", "efkk0l9hcg96", "kn7h01eku617", "26uhbm3uh6rg", "4nqnizsygmcn", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "chloe21",
    displayName: "西日",
    avatar: "",
    count: 12,
    campaigns: ["aiafcgbu89p2", "nqbeo3cdn585", "3uskpxsbzmz5", "h2ya9xxjubd2", "efkk0l9hcg96", "26uhbm3uh6rg", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y"],
  },
  {
    userName: "nowevernthen",
    displayName: "明天的昨日_",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/5bcf06a8-812c-48b2-a8dc-703d77a47b41.jpeg/public",
    count: 12,
    campaigns: ["aiafcgbu89p2", "q48dv6ve4g2m", "4v5mndkbz44v", "nqbeo3cdn585", "ox9fmcz6zxxj", "3uskpxsbzmz5", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "26uhbm3uh6rg", "4nqnizsygmcn"],
  },
  {
    userName: "bearqq",
    displayName: "sandy.yinping",
    avatar: "",
    count: 12,
    campaigns: ["4v5mndkbz44v", "5zhf2bpty274", "h2ya9xxjubd2", "26uhbm3uh6rg", "2hb97w8rdn7k", "f7rpyecg32mg", "x4rv6dwgk68o", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "gaagwai",
    displayName: "賈瑰",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/2a79bcb4-5dc3-4c1c-9a27-c21e13e28767.jpeg/public",
    count: 12,
    campaigns: ["ox9fmcz6zxxj", "owt3jxplay6z", "efkk0l9hcg96", "26uhbm3uh6rg", "2hb97w8rdn7k", "4nqnizsygmcn", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "cheukkiucc",
    displayName: "絕羽",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/827d6b23-21b7-451c-995a-762ba18e8b99.png/public",
    count: 12,
    campaigns: ["ox9fmcz6zxxj", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "26uhbm3uh6rg", "4nqnizsygmcn", "f7rpyecg32mg", "eqsfuc3qph6u", "8t5liudbtpup", "ybs0lqsrpmhn", "ia800figcq9y"],
  },
  {
    userName: "wujie",
    displayName: "無解",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/bf51be04-253a-4b3e-8fc9-b9ae2fef8026.jpeg/public",
    count: 12,
    campaigns: ["3uskpxsbzmz5", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "kn7h01eku617", "26uhbm3uh6rg", "4nqnizsygmcn", "f7rpyecg32mg", "eqsfuc3qph6u", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "greymulan",
    displayName: "灰木蘭",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/b181f9c0-b967-4721-9742-97f2f7ffccc4.jpeg/public",
    count: 11,
    campaigns: ["wem6xy6u7okv", "4v5mndkbz44v", "ox9fmcz6zxxj", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "h2ya9xxjubd2", "efkk0l9hcg96", "26uhbm3uh6rg", "4nqnizsygmcn", "f7rpyecg32mg"],
  },
  {
    userName: "Benno",
    displayName: "Benno",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/3e30f88d-4436-4681-ac59-eebbcef3c282.jpeg/public",
    count: 11,
    campaigns: ["wem6xy6u7okv", "q48dv6ve4g2m", "4v5mndkbz44v", "nqbeo3cdn585", "efkk0l9hcg96", "26uhbm3uh6rg", "4nqnizsygmcn", "f7rpyecg32mg", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
  {
    userName: "vantisse",
    displayName: "胃食道逆流",
    avatar: "",
    count: 11,
    campaigns: ["q48dv6ve4g2m", "nqbeo3cdn585", "3uskpxsbzmz5", "owt3jxplay6z", "rt04oolqbexh", "5zhf2bpty274", "h2ya9xxjubd2", "efkk0l9hcg96", "26uhbm3uh6rg", "eqsfuc3qph6u", "8t5liudbtpup"],
  },
  {
    userName: "rnwang54",
    displayName: "枯北",
    avatar: "https://imagedelivery.net/kDRCweMmqLnTPNlbum-pYA/prod/avatar/0abc943a-e1d3-4489-b50c-9b6adacbe4a3.jpeg/public",
    count: 11,
    campaigns: ["q48dv6ve4g2m", "3uskpxsbzmz5", "owt3jxplay6z", "efkk0l9hcg96", "x4rv6dwgk68o", "eqsfuc3qph6u", "8t5liudbtpup", "scx3f16y37v6", "ybs0lqsrpmhn", "ia800figcq9y", "5sdzhvyf3imb"],
  },
];
