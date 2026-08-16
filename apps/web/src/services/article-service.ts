import api from "@/lib/axios";
import type { Article, Category } from "@/types/news";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
interface ApiArticle {
  id: number;
  url: string;
  korean_title: string | null;
  vietnamese_title: string | null;
  descriptions: string | null;
  category: string | null;
  publisher: string | null;
  korean_summary: string | null;
  vietnamese_summary: string | null;
  topics: string[] | null;
  thumbnail_url: string | null;
  author: string | null;
  published_at: string | null;
}

const fallbackThumbnail =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=85";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toFeedArticle(article: ApiArticle): Article {
  const date = article.published_at ? new Date(article.published_at) : null;
  return {
    id: String(article.id),
    originalUrl: article.url,
    title:
      article.korean_title ??
      article.vietnamese_title ??
      article.descriptions ??
      "Untitled",
    summary:
      article.korean_summary ??
      article.vietnamese_summary ??
      article.descriptions ??
      "No summary available.",
    thumbnail: article.thumbnail_url ?? fallbackThumbnail,
    category: article.category ? capitalize(article.category) : "News",
    publisher: article.publisher ?? article.author ?? "News AI",
    publishedAt:
      date && !Number.isNaN(date.getTime())
        ? new Intl.DateTimeFormat("en", {
            month: "short",
            day: "numeric",
          }).format(date)
        : "Recently",
    readTime: 3,
    koreanTitle: article.korean_title,
    vietnameseTitle: article.vietnamese_title,
    koreanSummary: article.korean_summary,
    vietnameseSummary: article.vietnamese_summary,
    topics: article.topics ?? [],
  };
}

export async function getArticles(): Promise<Article[]> {
  const response = await api.get<ApiResponse<ApiArticle[]>>("/articles", {
    params: { skip: 0, limit: 50 },
  });
  if (!response.data.success)
    throw new Error(response.data.message || "Unable to load articles.");
  return response.data.data.map(toFeedArticle);
}

export async function getArticlesByCategory(
  category: string,
): Promise<Article[]> {
  const response = await api.get<ApiResponse<ApiArticle[]>>("/articles", {
    params: { category, skip: 0, limit: 50 },
  });
  if (!response.data.success)
    throw new Error(response.data.message || "Unable to load articles.");
  return response.data.data.map(toFeedArticle);
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<ApiResponse<string[]>>("/articles/categories");
  if (!response.data.success)
    throw new Error(response.data.message || "Unable to load categories.");
  const all: Category = { id: "all", name: "All" };
  const rest: Category[] = response.data.data.map((name) => ({
    id: name,
    name: capitalize(name),
  }));
  return [all, ...rest];
}
