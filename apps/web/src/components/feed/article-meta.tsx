import type { Article } from "@/types/news";

export function ArticleMeta({ article }: { article: Article }) {
  return (
    <p className="article-meta">
      {article.publisher}
      <span>·</span>
      {article.publishedAt}
      <span>·</span>
      {article.readTime} min read
    </p>
  );
}
