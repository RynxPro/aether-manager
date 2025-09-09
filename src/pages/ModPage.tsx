import React, { useState } from "react";

interface ModCardProps {
  mod: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    isActive: boolean;
    dateAdded: string;
    character: string;
  };
  onToggleActive: (id: string) => void;
}

const ModCard: React.FC<ModCardProps> = ({ mod, onToggleActive }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors">
      <div className="flex items-start space-x-4">
        {/* Thumbnail */}
        <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
          {mod.thumbnail ? (
            <img
              src={mod.thumbnail}
              alt={mod.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-2xl">🎮</span>
          )}
        </div>

        {/* Mod Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white truncate">
              {mod.title}
            </h3>
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {mod.character}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {mod.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Added: {mod.dateAdded}
            </span>
            <button
              onClick={() => onToggleActive(mod.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mod.isActive
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {mod.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OtherModsPage: React.FC = () => {
  const [mods] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      thumbnail: string;
      isActive: boolean;
      dateAdded: string;
      character: string;
    }>
  >([
    // Mock data - will be replaced with real data from hooks
  ]);

  const handleToggleActive = (id: string) => {
    console.log(`Toggle mod ${id}`);
    // Will be implemented with actual mod management logic
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Other Mods</h1>
        <p className="text-gray-400">
          Manage mods that don't belong to specific characters
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search mods..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
            <option value="all">All Characters</option>
            <option value="belle">Belle</option>
            <option value="nicole">Nicole</option>
            <option value="anby">Anby</option>
          </select>
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Mods Grid */}
      {mods.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mods.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎮</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No mods found
          </h3>
          <p className="text-gray-400 mb-6">
            Start by installing some mods to manage them here
          </p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Browse Characters
          </button>
        </div>
      )}
    </div>
  );
};

export default OtherModsPage;
