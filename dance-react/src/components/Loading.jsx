import './Loading.css';

export function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{message || 'Unable to load data. Please try again.'}</p>
      {onRetry && (
        <button className="btn primary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
