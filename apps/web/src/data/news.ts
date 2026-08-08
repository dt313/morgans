import type { Article, Category } from "@/types/news";

export const categories: Category[] = [
  "All",
  "Politics",
  "Economy",
  "Society",
  "World",
  "Technology",
  "Sports",
  "Entertainment",
].map((name) => ({ id: name.toLowerCase(), name }));

export const articles: Article[] = [
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
].map((article) => ({
  ...article,
  originalUrl: "#",
  koreanSummary: null,
  vietnameseSummary: null,
  topics: [],
}));
