"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "@/data/news";
import { CategoryTabs } from "@/components/feed/category-tabs";
import { FeaturedArticle } from "@/components/feed/featured-article";
import { NewsFeed } from "@/components/feed/news-feed";
import { ErrorState } from "@/components/feed/error-state";
import { LoadingSkeleton } from "@/components/feed/loading-skeleton";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { getArticles } from "@/services/article-service";
import type { Article } from "@/types/news";

export function NewsFeedLayout() {
  const [category, setCategory] = useState("All");
  const [feedArticles, setFeedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { bookmarks, toggleBookmark } = useBookmarks();
  const loadArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setFeedArticles(await getArticles());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load articles.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    getArticles()
      .then((articles) => {
        if (!cancelled) setFeedArticles(articles);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load articles.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);
  const visibleArticles = useMemo(
    () =>
      category === "All"
        ? feedArticles
        : feedArticles.filter((article) => article.category === category),
    [category, feedArticles],
  );
  const topStories = visibleArticles.slice(0, 3);
  const feed = visibleArticles.slice(3);

  return (
    <main className="news-page">
      <Header />
      <CategoryTabs
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />
      <div className="content-shell">
        <section className="main-feed">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={loadArticles} />
          ) : topStories.length > 0 ? (
            <>
              <p className="section-kicker">Top story</p>
              <div className="top-stories">
                {topStories.map((article) => (
                  <FeaturedArticle
                    key={article.id}
                    article={article}
                    bookmarked={bookmarks.includes(article.id)}
                    onBookmark={() => toggleBookmark(article.id)}
                  />
                ))}
              </div>
              <div className="feed-heading">
                <h2>Latest news</h2>
                <span>{category === "All" ? "Curated for you" : category}</span>
              </div>
              <NewsFeed
                articles={feed}
                bookmarkedIds={bookmarks}
                onBookmark={toggleBookmark}
              />
            </>
          ) : (
            <div className="empty-state">
              <span>☼</span>
              <h2>No news available.</h2>
              <p>Try another category to discover more stories.</p>
            </div>
          )}
        </section>
        <Sidebar />
      </div>
    </main>
  );
}
