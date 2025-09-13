import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 py-4 ${className}`}>
      {children}
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  className = '',
  children,
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-[var(--moon-muted)] mt-1">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
