export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="empty-state">
      <span>!</span>
      <h2>Couldn&apos;t load the news.</h2>
      <p>{message}</p>
      <button className="retry-button" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
