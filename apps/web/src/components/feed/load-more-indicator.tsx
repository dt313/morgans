export function LoadMoreIndicator({ loading }: { loading: boolean }) {
  return (
    <div className="load-more-indicator" role="status" aria-live="polite">
      {loading ? (
        <span
          className="skeleton-line wide"
          style={{ height: 120, margin: 0 }}
        />
      ) : (
        <span className="load-more-hint">Scroll to load more</span>
      )}
    </div>
  );
}
