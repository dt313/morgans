import { Icon } from "@/components/ui/icon";

interface BookmarkButtonProps {
  active: boolean;
  onClick: () => void;
}

export function BookmarkButton({ active, onClick }: BookmarkButtonProps) {
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
