"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { ErrorState } from "@/components/feed/error-state";
import { LoadingSkeleton } from "@/components/feed/loading-skeleton";
import { ArticleMeta } from "@/components/feed/article-meta";
import { getArticle } from "@/services/article-service";
import type { Article } from "@/types/news";

type Language = "ko" | "vi";

export function ArticleDetailPage() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [language, setLanguage] = useState<Language>("ko");
  const [error, setError] = useState<string | null>(null);

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

  const summary =
    language === "ko" ? article.koreanSummary : article.vietnameseSummary;
  const selectedSummary =
    summary ??
    (language === "ko" ? article.vietnameseSummary : article.koreanSummary) ??
    article.summary;

  return (
    <main className="news-page">
      <Header />
      <article className="detail-shell">
        <Link className="back-link" href="/">
          ← Back to news
        </Link>
        <p className="eyebrow">{article.category}</p>
        <h1>{article.title}</h1>
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
          <div className="summary-tabs">
            <button
              className={language === "ko" ? "active" : ""}
              onClick={() => setLanguage("ko")}
            >
              한국어 요약
            </button>
            <button
              className={language === "vi" ? "active" : ""}
              onClick={() => setLanguage("vi")}
            >
              Tóm tắt tiếng Việt
            </button>
          </div>
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
          <p>{selectedSummary}</p>
        </section>
      </article>
    </main>
  );
}
