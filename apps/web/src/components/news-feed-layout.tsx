"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Article = {
  id: string;
  title: string;
  summary: string;
  thumbnail: string;
  category: string;
  publisher: string;
  publishedAt: string;
  readTime: number;
};

const categories = [
  "All",
  "Politics",
  "Economy",
  "Society",
  "World",
  "Technology",
  "Sports",
  "Entertainment",
];

const articles: Article[] = [
  {
    id: "1",
    category: "Technology",
    publisher: "The Korea Herald",
    publishedAt: "2 hours ago",
    readTime: 5,
    title: "Korea's AI ambitions are reshaping how the country works",
    summary:
      "From chipmakers to classrooms, a new generation of Korean companies is putting artificial intelligence at the center of everyday life.",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "2",
    category: "Economy",
    publisher: "Yonhap News",
    publishedAt: "3 hours ago",
    readTime: 4,
    title:
      "Seoul markets find their footing as investors look to the second half",
    summary:
      "A resilient tech sector and renewed foreign interest are giving local shares a welcome lift this week.",
    thumbnail:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "3",
    category: "Society",
    publisher: "KBS News",
    publishedAt: "5 hours ago",
    readTime: 3,
    title: "The small neighborhood changes making Seoul easier to walk",
    summary:
      "Residents and planners are reclaiming narrow streets with more shade, seating, and room to linger.",
    thumbnail:
      "https://images.unsplash.com/photo-1538485399081-7c8979d29f2d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "4",
    category: "World",
    publisher: "The Korea Times",
    publishedAt: "6 hours ago",
    readTime: 6,
    title: "A new era for cities built around resilient, local energy",
    summary:
      "As extreme weather tests grids around the world, municipalities are investing closer to home.",
    thumbnail:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "5",
    category: "Sports",
    publisher: "SBS Sports",
    publishedAt: "8 hours ago",
    readTime: 4,
    title: "A summer of fresh starts for Korea's next sporting generation",
    summary:
      "Young athletes are stepping into larger roles with an international season ahead.",
    thumbnail:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85",
  },
];

function Icon({
  name,
  size = 20,
}: {
  name: "search" | "bell" | "bookmark" | "chevron";
  size?: number;
}) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 22h4" />
      </>
    ),
    bookmark: (
      <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V22l-6-3.8L6 22V3.5Z" />
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function BookmarkButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`bookmark-button ${active ? "is-saved" : ""}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      aria-label={active ? "Remove bookmark" : "Bookmark article"}
    >
      <Icon name="bookmark" size={19} />
    </button>
  );
}

function Meta({ article }: { article: Article }) {
  return (
    <p className="article-meta">
      {article.publisher}
      <span>·</span>
      {article.publishedAt}
      <span>·</span>
      {article.readTime} min read
    </p>
  );
}

function ArticleCard({
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
          <Meta article={article} />
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

function Sidebar() {
  const mostRead = articles.slice(0, 3);
  return (
    <aside className="sidebar">
      <section className="side-section">
        <h2>Trending topics</h2>
        <div className="topics">
          {[
            "#ArtificialIntelligence",
            "#Samsung",
            "#Climate",
            "#Korea",
            "#Startups",
            "#Markets",
          ].map((topic) => (
            <button key={topic}>{topic}</button>
          ))}
        </div>
      </section>
      <section className="side-section">
        <h2>Most read</h2>
        <ol className="most-read">
          {mostRead.map((article, index) => (
            <li key={article.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{article.title}</h3>
                <p>{article.publisher}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="side-section">
        <h2>Recommended publishers</h2>
        <ul className="publisher-list">
          {[
            "Yonhap News",
            "Korea Herald",
            "KBS News",
            "SBS News",
            "JoongAng Daily",
          ].map((publisher) => (
            <li key={publisher}>
              <span className="publisher-mark">{publisher.slice(0, 1)}</span>
              {publisher}
              <Icon name="chevron" size={16} />
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

export function NewsFeedLayout() {
  const [category, setCategory] = useState("All");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const visibleArticles = useMemo(
    () =>
      category === "All"
        ? articles
        : articles.filter((article) => article.category === category),
    [category],
  );
  const featured = visibleArticles[0];
  const feed = visibleArticles.slice(1);
  const toggleBookmark = (id: string) =>
    setBookmarks((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  return (
    <main className="news-page">
      <header className="site-header">
        <div className="header-inner">
          <a
            href="#"
            className="brand"
            aria-label="Briefly home"
            onClick={(event) => event.preventDefault()}
          >
            briefly<span>.</span>
          </a>
          <label className="search-box">
            <Icon name="search" size={18} />
            <input
              placeholder="Search news, topics, publishers"
              aria-label="Search news"
            />
          </label>
          <nav className="header-actions" aria-label="Account actions">
            <button aria-label="Notifications">
              <Icon name="bell" />
            </button>
            <button aria-label="Saved articles">
              <Icon name="bookmark" />
            </button>
            <button className="avatar" aria-label="Your profile">
              JD
            </button>
          </nav>
        </div>
      </header>
      <nav className="category-nav" aria-label="News categories">
        <div className="category-inner">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={category === item ? "active" : ""}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
      <div className="content-shell">
        <section className="main-feed">
          {featured ? (
            <>
              <p className="section-kicker">Top story</p>
              <article className="featured-card">
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="featured-link"
                >
                  <div className="featured-image-wrap">
                    <Image
                      src={featured.thumbnail}
                      alt=""
                      fill
                      priority
                      sizes="(max-width: 900px) 100vw, 50vw"
                    />
                  </div>
                  <div className="featured-copy">
                    <p className="eyebrow">{featured.category}</p>
                    <h1>{featured.title}</h1>
                    <p>{featured.summary}</p>
                    <Meta article={featured} />
                  </div>
                </a>
                <BookmarkButton
                  active={bookmarks.includes(featured.id)}
                  onClick={() => toggleBookmark(featured.id)}
                />
              </article>
              <div className="feed-heading">
                <h2>Latest news</h2>
                <span>{category === "All" ? "Curated for you" : category}</span>
              </div>
              <div className="article-list">
                {feed.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    bookmarked={bookmarks.includes(article.id)}
                    onBookmark={() => toggleBookmark(article.id)}
                  />
                ))}
              </div>
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
