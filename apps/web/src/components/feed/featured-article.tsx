import Link from "next/link";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { ArticleMeta } from "@/components/feed/article-meta";
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
  return (
    <article className="featured-card">
      <Link href={`/articles/${article.id}`} className="featured-link">
        <div className="featured-image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.thumbnail} alt="" />
        </div>
        <div className="featured-copy">
          <p className="eyebrow">{article.category}</p>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
          <ArticleMeta article={article} />
        </div>
      </Link>
      <BookmarkButton active={bookmarked} onClick={onBookmark} />
    </article>
  );
}
