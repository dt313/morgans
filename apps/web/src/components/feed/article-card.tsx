import Link from "next/link";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { ArticleMeta } from "@/components/feed/article-meta";
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
  return (
    <article className="article-card">
      <Link href={`/articles/${article.id}`} className="article-card-link">
        <div className="article-copy">
          <p className="eyebrow">{article.category}</p>
          <h2>{article.title}</h2>
          <p className="article-summary">{article.summary}</p>
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
