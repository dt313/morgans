"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories as fallbackCategories } from "@/data/news";
import { CategoryTabs } from "@/components/feed/category-tabs";
import { NewsFeed } from "@/components/feed/news-feed";
import { ErrorState } from "@/components/feed/error-state";
import { LoadingSkeleton } from "@/components/feed/loading-skeleton";
import { LoadMoreIndicator } from "@/components/feed/load-more-indicator";
import { Header } from "@/layout/header";
import { Sidebar } from "@/layout/sidebar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { useBookmarks } from "@/hooks/use-bookmarks";
import {
  getArticles,
  getArticlesByCategory,
  getCategories,
  searchArticles,
  type ArticlePage,
} from "@/services/article-service";
import type { Article, Category } from "@/types/news";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function NewsFeedLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadedCategory, setLoadedCategory] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const { bookmarks, toggleBookmark } = useBookmarks();
  const skipRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const categoryId = searchParams.get("category") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";
  const category = categoryId === "all" ? "All" : capitalize(categoryId);
  const isSearch = searchQuery.trim().length > 0;
  const isLoading = loadedCategory !== category;

  const handleSelectCategory = (name: string) => {
    const id = name.toLowerCase();
    router.replace(id === "all" ? "/feed" : `/feed?category=${id}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((fetched) => {
        if (!cancelled) {
          setCategories(fetched);
          const id = categoryId;
          if (id !== "all" && !fetched.some((cat) => cat.id === id)) {
            router.replace("/feed", { scroll: false });
          }
        }
      })
      .catch(() => {
        if (!cancelled) setCategories(fallbackCategories);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    const cat = category;

    let request: Promise<ArticlePage>;
    if (isSearch) {
      request = searchArticles(searchQuery);
    } else if (cat === "All") {
      request = getArticles();
    } else {
      request = getArticlesByCategory(cat.toLowerCase());
    }

    request
      .then((page) => {
        if (!cancelled) {
          setArticles(page.articles);
          setHasMore(page.hasMore);
          setLoadedCategory(cat);
          skipRef.current = page.articles.length;
          setIsLoadingMore(false);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load articles.",
          );
          setLoadedCategory(cat);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [category, isSearch, searchQuery, retryKey]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return;

    setIsLoadingMore(true);
    const skip = skipRef.current;
    try {
      let request: Promise<ArticlePage>;
      if (isSearch) {
        request = searchArticles(searchQuery, { skip });
      } else if (category === "All") {
        request = getArticles({ skip });
      } else {
        request = getArticlesByCategory(category.toLowerCase(), { skip });
      }
      const page = await request;
      setArticles((prev) => [
        ...prev,
        ...page.articles.filter(
          (a) => !prev.some((existing) => existing.id === a.id),
        ),
      ]);
      skipRef.current = skip + page.articles.length;
      setHasMore(page.hasMore);
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [category, hasMore, isLoading, isLoadingMore, isSearch, searchQuery]);

  const handleSentinelRef = useCallback((node: HTMLDivElement | null) => {
    sentinelRef.current = node;
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoadingMore, isLoading]);

  const handleRetry = () => {
    setError(null);
    setLoadedCategory(null);
    setRetryKey((key) => key + 1);
  };

  return (
    <main className="news-page">
      <Header />
      {!isSearch && (
        <CategoryTabs
          categories={categories}
          selected={category}
          onSelect={handleSelectCategory}
        />
      )}
      <div className="content-shell">
        <section className="main-feed">
          {isSearch && (
            <div className="search-results-heading">
              <button
                onClick={() => router.replace("/feed", { scroll: false })}
                className="search-back-btn"
                aria-label="Back to feed"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to feed
              </button>
              <h1>Search results</h1>
              <p>
                {articles.length > 0
                  ? `${articles.length} result${articles.length === 1 ? "" : "s"} for "${searchQuery}"`
                  : `No results for "${searchQuery}"`}
              </p>
            </div>
          )}
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={handleRetry} />
          ) : articles.length > 0 ? (
            <>
              <NewsFeed
                articles={articles}
                bookmarkedIds={bookmarks}
                onBookmark={toggleBookmark}
                activeAudioId={activeAudioId}
                onAudioActivate={setActiveAudioId}
                showCategory={true}
              />
              <div ref={handleSentinelRef} />
              {hasMore && <LoadMoreIndicator loading={isLoadingMore} />}
              {!hasMore && (
                <p className="feed-end">You&apos;re all caught up.</p>
              )}
            </>
          ) : (
            <div className="empty-state">
              <span>☼</span>
              <h2>No news available.</h2>
              <p>
                {isSearch
                  ? `Nothing found for "${searchQuery}". Try different keywords.`
                  : "Try another category to discover more stories."}
              </p>
            </div>
          )}
        </section>
        <Sidebar />
      </div>
      <ScrollToTop />
    </main>
  );
}
