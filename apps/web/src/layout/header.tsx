"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useLanguage } from "@/hooks/use-language";

export function Header() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/feed?q=${encodeURIComponent(value)}` : "/feed");
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Briefly home">
          briefly<span>.</span>
        </Link>
        <form className="search-box" role="search" onSubmit={handleSubmit}>
          <Icon name="search" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search news, topics, publishers"
            aria-label="Search news"
          />
        </form>
        <nav className="header-actions" aria-label="Account actions">
          <label className="language-select">
            <Icon name="globe" size={16} />
            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as "ko" | "vi")
              }
              aria-label="Language"
            >
              <option value="ko">한국어</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </label>
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
  );
}
