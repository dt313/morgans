export interface Article {
  id: string;
  title: string;
  summary: string;
  thumbnail: string;
  category: string;
  publisher: string;
  publishedAt: string;
  readTime: number;
}

export interface Category {
  id: string;
  name: string;
}
