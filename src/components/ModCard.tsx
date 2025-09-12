import React from "react";

interface Mod {
  id: string;
  title: string;
  thumbnail?: string;
  isActive: boolean;
  dateAdded: string;
  character?: string;
  description?: string;
}

interface ModCardProps {
  mod: Mod;
  onToggleActive: (modId: string) => void;
  onDelete: (modId: string) => void;
  onViewDetails?: (modId: string) => void;
}

const ModCard: React.FC<ModCardProps> = ({ mod, onToggleActive, onDelete }) => {
  const handleToggleActive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleActive(mod.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${mod.title}"?`)) {
      onDelete(mod.id);
    }
  };

  return (
    <div
      className="bg-[var(--moon-surface)] backdrop-blur-sm rounded-xl border border-[var(--moon-border)] overflow-hidden group flex flex-col h-full w-full min-w-[280px] max-w-[320px] flex-shrink-0 hover:border-[var(--moon-glow-violet)] hover:shadow-[0_0_15px_rgba(122,90,248,0.2)] transition-all duration-300"
      style={{ flex: "0 0 auto" }}
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gray-900/20 overflow-hidden">
        {mod.thumbnail ? (
          <img
            src={mod.thumbnail}
            alt={mod.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231a1e2c'/%3E%3Cpath d='M30,40 L70,40 L70,60 L30,60 Z' fill='%232a3145'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='12'%3ENo Preview%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--moon-bg)] to-[#0f1320]">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--moon-surface)] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[var(--moon-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-xs text-[var(--moon-muted)]">No preview available</span>
            </div>
          </div>
        )}

        {/* Status indicators */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md bg-[rgba(0,0,0,0.7)] backdrop-blur-sm text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/30 hover:scale-110"
            aria-label="Delete mod"
            title="Delete mod"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div
            className={`w-2.5 h-2.5 rounded-full border border-[var(--moon-border)] ${
              mod.isActive 
                ? "bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.6)]" 
                : "bg-gray-600"
            }`}
            title={mod.isActive ? "Active" : "Inactive"}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 
          className="text-[var(--moon-text)] font-medium text-sm mb-1.5 line-clamp-2 group-hover:text-[var(--moon-glow-violet)] transition-colors duration-200"
          title={mod.title}
        >
          {mod.title}
        </h3>

        {/* Character */}
        {mod.character && (
          <div className="flex items-center text-xs text-[var(--moon-muted)] mb-3">
            <span className="truncate">
              {mod.character}
            </span>
          </div>
        )}

        {/* Date and Actions */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-[var(--moon-border)]">
          <span className="text-xs text-[var(--moon-muted)]">
            {new Date(mod.dateAdded).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <button
            onClick={handleToggleActive}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              mod.isActive
                ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                : "bg-green-500/15 text-green-400 hover:bg-green-500/25"
            }`}
          >
            {mod.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModCard;
