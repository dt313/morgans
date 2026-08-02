import type { Category } from "@/types/news";

interface CategoryTabsProps {
  categories: Category[];
  selected: string;
  onSelect: (name: string) => void;
}

export function CategoryTabs({
  categories,
  selected,
  onSelect,
}: CategoryTabsProps) {
  return (
    <nav className="category-nav" aria-label="News categories">
      <div className="category-inner">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.name)}
            className={selected === category.name ? "active" : ""}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
