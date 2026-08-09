import Link from "next/link";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { ArticleMeta } from "@/components/feed/article-meta";
import { useLanguage } from "@/hooks/use-language";
import type { Article } from "@/types/news";

export function FeaturedArticle({
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
    <article className="featured-card">
      <Link href={`/articles/${article.id}`} className="featured-link">
        <div className="featured-image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.thumbnail} alt="" />
        </div>
        <div className="featured-copy">
          <p className="eyebrow">{article.category}</p>
          <h1>{title}</h1>
          <p>{summary}</p>
          <ArticleMeta article={article} />
        </div>
      </Link>
      <BookmarkButton active={bookmarked} onClick={onBookmark} />
    </article>
  );
}
