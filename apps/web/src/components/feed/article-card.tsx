import { ArticleAudioPlayer } from "@/components/feed/article-audio-player";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { ArticleMeta } from "@/components/feed/article-meta";
import { useLanguage } from "@/hooks/use-language";
import type { Article } from "@/types/news";

export function ArticleCard({
  article,
  bookmarked,
  onBookmark,
  activeAudioId,
  onAudioActivate,
}: {
  article: Article;
  bookmarked: boolean;
  onBookmark: () => void;
  activeAudioId: string | null;
  onAudioActivate: (articleId: string) => void;
}) {
  const { language } = useLanguage();
  const title =
    language === "ko"
      ? (article.koreanTitle ?? article.vietnameseTitle ?? article.title)
      : (article.vietnameseTitle ?? article.koreanTitle ?? article.title);
  const summary =
    language === "ko"
      ? (article.koreanSummary ?? article.vietnameseSummary ?? article.summary)
      : (article.vietnameseSummary ?? article.koreanSummary ?? article.summary);

  return (
    <article className="article-card">
      <div className="article-copy">
        <p className="eyebrow">{article.category}</p>
        <h2>{title}</h2>
        <ArticleMeta article={article} />
        <p className="article-summary">{summary}</p>
        {article.topics.length > 0 && (
          <div className="article-topics" aria-label="Article topics">
            {article.topics.map((topic) => (
              <span key={topic}>#{topic}</span>
            ))}
          </div>
        )}
        <div className="article-image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.thumbnail} alt="" className="article-image" />
        </div>
        <div className="article-actions">
          <ArticleAudioPlayer
            articleId={article.id}
            activeArticleId={activeAudioId}
            onActivate={onAudioActivate}
          />
          <a href={article.originalUrl} target="_blank" rel="noreferrer">
            Original source ↗
          </a>
        </div>
      </div>
      <BookmarkButton active={bookmarked} onClick={onBookmark} />
    </article>
  );
}
