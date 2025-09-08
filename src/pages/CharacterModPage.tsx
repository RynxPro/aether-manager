import React, { useState } from "react";

interface ModCardProps {
  mod: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    isActive: boolean;
    dateAdded: string;
  };
  onToggleActive: (id: string) => void;
}

const ModCard: React.FC<ModCardProps> = ({ mod, onToggleActive }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors">
      <div className="flex items-start space-x-3">
        {/* Thumbnail */}
        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
          {mod.thumbnail ? (
            <img
              src={mod.thumbnail}
              alt={mod.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-xl">🎮</span>
          )}
        </div>

        {/* Mod Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate mb-1">
            {mod.title}
          </h3>
          <p className="text-gray-400 text-sm mb-2 line-clamp-2">
            {mod.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Added: {mod.dateAdded}
            </span>
            <button
              onClick={() => onToggleActive(mod.id)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
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

interface CharacterModPageProps {
  characterId: string;
  onBack: () => void;
}

const CharacterModPage: React.FC<CharacterModPageProps> = ({
  characterId,
  onBack,
}) => {
  const [mods] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      thumbnail: string;
      isActive: boolean;
      dateAdded: string;
    }>
  >([
    // Mock data - will be replaced with real data from hooks
  ]);

  // Mock character data - will be replaced with real data
  const characterData = {
    belle: {
      name: "Belle",
      icon: "👩‍💼",
      description:
        "The energetic and optimistic protagonist of Zenless Zone Zero",
    },
    nicole: {
      name: "Nicole",
      icon: "👩‍🎨",
      description: "A mysterious artist with unique abilities",
    },
    anby: {
      name: "Anby",
      icon: "👩‍🚀",
      description: "A skilled fighter with a cool demeanor",
    },
    billy: {
      name: "Billy",
      icon: "👨‍💻",
      description: "A tech-savvy character with hacking abilities",
    },
    corin: {
      name: "Corin",
      icon: "👨‍🔬",
      description: "A brilliant scientist and researcher",
    },
    ellen: {
      name: "Ellen",
      icon: "👩‍🎭",
      description: "A performer with a flair for the dramatic",
    },
  };

  const character = characterData[
    characterId as keyof typeof characterData
  ] || {
    name: "Unknown Character",
    icon: "❓",
    description: "Character not found",
  };

  const handleToggleActive = (id: string) => {
    console.log(`Toggle mod ${id} for character ${characterId}`);
    // Will be implemented with actual mod management logic
  };

  const handleUploadMod = () => {
    console.log(`Upload new mod for character ${characterId}`);
    // Will be implemented with actual file upload logic
  };

  return (
    <div className="p-8">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Characters</span>
        </button>

        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-4xl">{character.icon}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{character.name}</h1>
            <p className="text-gray-400">{character.description}</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search mods..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleUploadMod}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Upload Mod</span>
        </button>
      </div>

      {/* Mods List */}
      {mods.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            No mods for {character.name}
          </h3>
          <p className="text-gray-400 mb-6">
            Upload your first mod to get started
          </p>
          <button
            onClick={handleUploadMod}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Upload Mod
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterModPage;
