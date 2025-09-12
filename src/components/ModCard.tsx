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
      className="bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700/50 hover:bg-gray-900/50 transition-all duration-300 group flex flex-col h-full w-full min-w-[280px] max-w-[320px] flex-shrink-0"
      style={{ flex: '0 0 auto' }}
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gray-800/30 overflow-hidden">
        {mod.thumbnail ? (
          <img
            src={mod.thumbnail}
            alt={mod.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23374151'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236B7280' font-family='Arial' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <div className="text-3xl mb-1">🎮</div>
              <div className="text-xs">No Preview</div>
            </div>
          </div>
        )}

        {/* Status Badge and Delete Button */}
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete mod"
            title="Delete mod"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <div
            className={`w-3 h-3 rounded-full ${
              mod.isActive ? "bg-green-400" : "bg-gray-500"
            }`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-white font-medium text-sm mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {mod.title}
        </h3>

        {/* Character */}
        {mod.character && (
          <p className="text-gray-400 text-xs mb-2">{mod.character}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {new Date(mod.dateAdded).toLocaleDateString()}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleToggleActive}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                mod.isActive
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              }`}
            >
              {mod.isActive ? "Disable" : "Enable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModCard;
