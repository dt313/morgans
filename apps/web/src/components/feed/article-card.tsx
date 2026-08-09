import Link from "next/link";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { ArticleMeta } from "@/components/feed/article-meta";
import { useLanguage } from "@/hooks/use-language";
import type { Article } from "@/types/news";

export function ArticleCard({
  article,
  bookmarked,
  onBookmark,
}: {
  article: Article;
  bookmarked: boolean;
  onBookmark: () => void;
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
      <Link href={`/articles/${article.id}`} className="article-card-link">
        <div className="article-copy">
          <p className="eyebrow">{article.category}</p>
          <h2>{title}</h2>
          <p className="article-summary">{summary}</p>
          <ArticleMeta article={article} />
        </div>
        <div className="article-image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.thumbnail} alt="" className="article-image" />
        </div>
      </Link>
      <BookmarkButton active={bookmarked} onClick={onBookmark} />
    </article>
  );
}
