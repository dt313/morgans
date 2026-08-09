"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories as fallbackCategories } from "@/data/news";
import { CategoryTabs } from "@/components/feed/category-tabs";
import { FeaturedArticle } from "@/components/feed/featured-article";
import { NewsFeed } from "@/components/feed/news-feed";
import { ErrorState } from "@/components/feed/error-state";
import { LoadingSkeleton } from "@/components/feed/loading-skeleton";
import { Header } from "@/layout/header";
import { Sidebar } from "@/layout/sidebar";
import { useBookmarks } from "@/hooks/use-bookmarks";
import {
  getArticles,
  getArticlesByCategory,
  getCategories,
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
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const { bookmarks, toggleBookmark } = useBookmarks();

  const categoryId = searchParams.get("category") ?? "all";
  const category = categoryId === "all" ? "All" : capitalize(categoryId);
  const isAll = category === "All";
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
    const request =
      cat === "All" ? getArticles() : getArticlesByCategory(cat.toLowerCase());

    request
      .then((fetched) => {
        if (!cancelled) {
          setArticles(fetched);
          setLoadedCategory(cat);
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
  }, [category, retryKey]);

  const handleRetry = () => {
    setError(null);
    setLoadedCategory(null);
    setRetryKey((key) => key + 1);
  };

  const topStories = useMemo(
    () => (isAll ? articles.slice(0, 3) : []),
    [articles, isAll],
  );
  const feed = useMemo(
    () => (isAll ? articles.slice(3) : articles),
    [articles, isAll],
  );

  return (
    <main className="news-page">
      <Header />
      <CategoryTabs
        categories={categories}
        selected={category}
        onSelect={handleSelectCategory}
      />
      <div className="content-shell">
        <section className="main-feed">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={handleRetry} />
          ) : articles.length > 0 ? (
            <>
              {isAll && topStories.length > 0 && (
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
                </>
              )}
              <div className="feed-heading">
                <h2>Latest news</h2>
                <span>{isAll ? "Curated for you" : category}</span>
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
