import React from "react";
import { useMods } from "../hooks/useMods";
import { useCharacters } from "../hooks/useCharacters";
import ModCard from "../components/ModCard";

interface CharacterModPageProps {
  characterId: string;
  onBack: () => void;
}

const CharacterModPage: React.FC<CharacterModPageProps> = ({
  characterId,
  onBack,
}) => {
  const { mods, loading, error, toggleModActive } = useMods();
  const { characters } = useCharacters();

  // Filter mods for this specific character
  const characterMods = mods.filter(mod => mod.character === characterId);

  // Find character data
  const character = characters.find(c => c.id === characterId) || {
    id: characterId,
    name: "Unknown Character",
    icon: "❓",
    installedMods: 0,
    activeMods: 0
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleModActive(id);
    } catch (error) {
      console.error('Failed to toggle mod:', error);
    }
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
            <p className="text-gray-400">Manage mods for {character.name}</p>
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

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading mods...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Error loading mods</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      ) : characterMods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {characterMods.map((mod) => (
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
