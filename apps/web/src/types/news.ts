export interface Article {
  id: string;
  title: string;
  summary: string;
  thumbnail: string;
  category: string;
  publisher: string;
  publishedAt: string;
  readTime: number;
  originalUrl: string;
  koreanSummary: string | null;
  vietnameseSummary: string | null;
  topics: string[];
}

export interface Category {
  id: string;
  name: string;
}
