"use client";

import { useEffect, useState } from "react";
import { getTrendingTopics } from "@/services/article-service";

const fallbackTopics = [
  "#ArtificialIntelligence",
  "#Samsung",
  "#Climate",
  "#Korea",
  "#Startups",
  "#Markets",
];

export function TrendingTopics() {
  const [topics, setTopics] = useState<string[]>(fallbackTopics);

  useEffect(() => {
    let cancelled = false;
    getTrendingTopics(10)
      .then((fetched) => {
        if (cancelled) return;
        const list = fetched.map((t) => `#${t.topic}`).filter(Boolean);
        if (list.length > 0) setTopics(list);
      })
      .catch(() => {
        if (!cancelled) setTopics(fallbackTopics);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="side-section">
      <h2>Trending topics</h2>
      <div className="topics">
        {topics.map((topic) => (
          <button key={topic}>{topic}</button>
        ))}
      </div>
    </section>
  );
}
