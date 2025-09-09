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
  onViewDetails?: (modId: string) => void;
}

const ModCard: React.FC<ModCardProps> = ({ mod, onToggleActive, onViewDetails }) => {
  const handleToggleActive = () => {
    onToggleActive(mod.id);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(mod.id);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200 group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-900 overflow-hidden">
        {mod.thumbnail ? (
          <img
            src={mod.thumbnail}
            alt={mod.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23374151'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236B7280' font-family='Arial' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <div className="text-4xl mb-2">🎮</div>
              <div className="text-sm">No Preview</div>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              mod.isActive
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
            }`}
          >
            {mod.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Character */}
        <div className="mb-3">
          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {mod.title}
          </h3>
          {mod.character && (
            <p className="text-gray-400 text-sm">
              Character: <span className="text-blue-400">{mod.character}</span>
            </p>
          )}
        </div>

        {/* Description */}
        {mod.description && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {mod.description}
          </p>
        )}

        {/* Date Added */}
        <p className="text-gray-500 text-xs mb-4">
          Added: {new Date(mod.dateAdded).toLocaleDateString()}
        </p>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleToggleActive}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              mod.isActive
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {mod.isActive ? "Deactivate" : "Activate"}
          </button>
          
          {onViewDetails && (
            <button
              onClick={handleViewDetails}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg font-medium text-sm transition-all duration-200"
            >
              Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModCard;
