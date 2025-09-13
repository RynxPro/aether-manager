import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = '📂',
  action,
}) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-[var(--moon-text)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--moon-muted)] mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
