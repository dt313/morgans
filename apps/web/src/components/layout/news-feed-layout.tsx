"use client";

import { useMemo, useState } from "react";
import { categories, articles } from "@/data/news";
import { CategoryTabs } from "@/components/feed/category-tabs";
import { FeaturedArticle } from "@/components/feed/featured-article";
import { NewsFeed } from "@/components/feed/news-feed";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useBookmarks } from "@/hooks/use-bookmarks";

export function NewsFeedLayout() {
  const [category, setCategory] = useState("All");
  const { bookmarks, toggleBookmark } = useBookmarks();
  const visibleArticles = useMemo(
    () =>
      category === "All"
        ? articles
        : articles.filter((article) => article.category === category),
    [category],
  );
  const [featured, ...feed] = visibleArticles;

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
          {featured ? (
            <>
              <p className="section-kicker">Top story</p>
              <FeaturedArticle
                article={featured}
                bookmarked={bookmarks.includes(featured.id)}
                onBookmark={() => toggleBookmark(featured.id)}
              />
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
