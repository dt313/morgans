"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useLanguage } from "@/hooks/use-language";
import logo from "@/assets/imgs/logo.png";

export function Header() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [searchOpen, setSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      mobileInputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (value) router.push(`/feed?q=${encodeURIComponent(value)}`);
    else router.push("/feed");
    setSearchOpen(false);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Morgans home">
            <Image
              src={logo}
              alt="Morgans"
              width={40}
              height={40}
              className="brand-logo"
              priority
            />
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
            <button
              className="mobile-search-toggle"
              type="button"
              aria-label="Open search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Icon name="search" size={18} />
            </button>
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
          </nav>
        </div>
      </header>
      <div
        className={`mobile-search-overlay${searchOpen ? " is-open" : ""}`}
        aria-hidden="true"
        onClick={() => setSearchOpen(false)}
      />
      <div
        className={`mobile-search-panel${searchOpen ? " is-open" : ""}`}
        role="search"
      >
        <form className="mobile-search-inner" onSubmit={handleSubmit}>
          <Icon name="search" size={18} />
          <input
            ref={mobileInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search news, topics, publishers"
            aria-label="Search news"
          />
          <button
            type="button"
            className="mobile-search-close"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          >
            <Icon name="close" size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
