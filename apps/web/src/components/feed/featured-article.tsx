import Image from "next/image";
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
      <a
        href="#"
        onClick={(event) => event.preventDefault()}
        className="featured-link"
      >
        <div className="featured-image-wrap">
          <Image
            src={article.thumbnail}
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="featured-copy">
          <p className="eyebrow">{article.category}</p>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
          <ArticleMeta article={article} />
        </div>
      </a>
      <BookmarkButton active={bookmarked} onClick={onBookmark} />
    </article>
  );
}
