"use client";

import { Icon } from "@/components/ui/icon";
import { useLanguage } from "@/hooks/use-language";

export function Header() {
  const { language, setLanguage } = useLanguage();

  return (
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
