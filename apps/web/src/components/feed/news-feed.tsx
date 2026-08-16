import { ArticleCard } from "@/components/feed/article-card";
import type { Article } from "@/types/news";

export function NewsFeed({
  articles,
  bookmarkedIds,
  onBookmark,
  activeAudioId,
  onAudioActivate,
}: {
  articles: Article[];
  bookmarkedIds: string[];
  onBookmark: (id: string) => void;
  activeAudioId: string | null;
  onAudioActivate: (articleId: string) => void;
}) {
  return (
    <div className="article-list">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          bookmarked={bookmarkedIds.includes(article.id)}
          onBookmark={() => onBookmark(article.id)}
          activeAudioId={activeAudioId}
          onAudioActivate={onAudioActivate}
        />
      ))}
    </div>
  );
}
