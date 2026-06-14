// 由 scripts/fetch-quote-wall.mjs 自動產生，請勿手改。
// 來源：Matters 公開 GraphQL（各期七日書 WritingChallenge.quotes）。

export interface WallQuote {
  id: string;
  content: string;
  author: string;
  articleTitle: string;
  articleHash: string;
  campaignName: string;
  createdAt: string;
}

export const quoteWall: WallQuote[] = [];

export const quoteWallCount = quoteWall.length;

// 牆上出現過的屆數（給篩選用）
export const quoteWallCampaigns: string[] = Array.from(
  new Set(quoteWall.map((q) => q.campaignName).filter(Boolean))
);
