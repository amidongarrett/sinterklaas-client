'use client';

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800">
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="text-red-600 hover:text-red-800 font-bold leading-none"
      >
        &times;
      </button>
    </div>
  );
}
