import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">❌</span>
      </div>
      <h3 className="text-xl font-semibold text-[var(--moon-text)] mb-2">
        Something went wrong
      </h3>
      <p className="text-[var(--moon-muted)] mb-6">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium bg-gradient-to-br from-gray-700/40 to-gray-800/40 hover:from-gray-600/40 hover:to-gray-700/40 text-gray-300 hover:text-white rounded-xl transition-all duration-200 border border-gray-600/50"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
