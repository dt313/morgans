import Image from "next/image";
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
      <a
        href="#"
        className="article-card-link"
        onClick={(event) => event.preventDefault()}
      >
        <div className="article-copy">
          <p className="eyebrow">{article.category}</p>
          <h2>{article.title}</h2>
          <p className="article-summary">{article.summary}</p>
          <ArticleMeta article={article} />
        </div>
        <div className="article-image-wrap">
          <Image
            src={article.thumbnail}
            alt=""
            fill
            sizes="(max-width: 600px) 105px, 180px"
            className="article-image"
          />
        </div>
      </a>
      <BookmarkButton active={bookmarked} onClick={onBookmark} />
    </article>
  );
}
