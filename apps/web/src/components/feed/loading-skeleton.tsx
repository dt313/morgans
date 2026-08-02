export function LoadingSkeleton() {
  return (
    <div className="loading-skeleton" aria-label="Loading articles">
      <div className="skeleton-feature" />
      <div className="skeleton-line wide" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-row" />
      <div className="skeleton-row" />
    </div>
  );
}
