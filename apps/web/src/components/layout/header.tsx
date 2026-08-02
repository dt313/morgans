import { Icon } from "@/components/ui/icon";

export function Header() {
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
