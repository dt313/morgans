"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/layout/header";
import { ErrorState } from "@/components/feed/error-state";
import { LoadingSkeleton } from "@/components/feed/loading-skeleton";
import { ArticleMeta } from "@/components/feed/article-meta";
import { NewsFeed } from "@/components/feed/news-feed";
import { ArticleAudioPlayer } from "@/components/article-detail/article-audio-player";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useLanguage } from "@/hooks/use-language";
import { getArticle, getRelatedArticles } from "@/services/article-service";
import type { Article } from "@/types/news";

export function ArticleDetailPage() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { language } = useLanguage();

  const loadArticle = async () => {
    setError(null);
    try {
      setArticle(await getArticle(params.id));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load article.",
      );
    }
  };

  useEffect(() => {
    let cancelled = false;
    getArticle(params.id)
      .then((result) => {
        if (!cancelled) setArticle(result);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load article.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  useEffect(() => {
    let cancelled = false;
    getRelatedArticles(params.id)
      .then((items) => {
        if (!cancelled) setRelated(items);
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (error)
    return (
      <>
        <Header />
        <main className="detail-shell">
          <ErrorState message={error} onRetry={loadArticle} />
        </main>
      </>
    );
  if (!article)
    return (
      <>
        <Header />
        <main className="detail-shell">
          <LoadingSkeleton />
        </main>
      </>
    );

  const title =
    language === "ko"
      ? (article.koreanTitle ?? article.vietnameseTitle ?? article.title)
      : (article.vietnameseTitle ?? article.koreanTitle ?? article.title);
  const summary =
    language === "ko"
      ? (article.koreanSummary ?? article.vietnameseSummary ?? article.summary)
      : (article.vietnameseSummary ?? article.koreanSummary ?? article.summary);

  return (
    <main className="news-page">
      <Header />
      <article className="detail-shell">
        <Link className="back-link" href="/feed">
          ← Back to news
        </Link>
        <p className="eyebrow">{article.category}</p>
        <h1>{title}</h1>
        <ArticleMeta article={article} />
        {article.topics.length > 0 && (
          <div className="article-topics" aria-label="Article topics">
            {article.topics.map((topic) => (
              <span key={topic}>#{topic}</span>
            ))}
          </div>
        )}
        <div className="detail-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.thumbnail} alt="" />
        </div>
        <div className="summary-header">
          <ArticleAudioPlayer articleId={article.id} />
          <a
            className="source-link"
            href={article.originalUrl}
            target="_blank"
            rel="noreferrer"
          >
            Read original article ↗
          </a>
        </div>
        <section className="summary-content">
          <p>{summary}</p>
        </section>
      </article>

      {related.length > 0 && (
        <section className="related-section">
          <div className="related-inner">
            <div className="feed-heading">
              <h2>Related stories</h2>
            </div>
            <NewsFeed
              articles={related}
              bookmarkedIds={bookmarks}
              onBookmark={toggleBookmark}
            />
          </div>
        </section>
      )}
    </main>
  );
}
