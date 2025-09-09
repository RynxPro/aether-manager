import React from "react";
import { useCharacters } from "../hooks/useCharacters";

interface CharacterCardProps {
  character: {
    id: string;
    name: string;
    iconUrl?: string;
    icon?: string;
    installedMods: number;
    activeMods: number;
    description?: string;
  };
  onClick: (id: string) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick,
}) => {
  return (
    <div
      className="flex flex-col items-center p-4 rounded-xl transition-all duration-200 cursor-pointer group bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 hover:border-gray-700/50 hover:bg-gray-900/50"
      onClick={() => onClick(character.id)}
    >
      {/* Character Portrait */}
      <div className="relative mb-3">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden group-hover:bg-gray-600 transition-colors border-2 border-gray-600">
          {character.iconUrl ? (
            <img
              src={character.iconUrl}
              alt={character.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-2xl">{character.icon || '👤'}</span>
          )}
        </div>
        
        {/* Status indicators */}
        <div className="absolute -bottom-1 -right-1 flex space-x-1">
          {character.installedMods > 0 && (
            <div className="w-3 h-3 bg-orange-500 rounded-full border border-gray-900"></div>
          )}
          {character.activeMods > 0 && (
            <div className="w-3 h-3 bg-green-500 rounded-full border border-gray-900"></div>
          )}
        </div>
      </div>

      {/* Character Name */}
      <h3 className="text-white font-medium text-sm mb-2 text-center group-hover:text-blue-400 transition-colors">
        {character.name}
      </h3>

      {/* Stats */}
      <div className="flex items-center space-x-4 text-xs text-gray-400">
        <div className="flex items-center space-x-1">
          <span>{character.installedMods}</span>
          <span>Total</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>{character.activeMods}</span>
          <span>Active</span>
        </div>
      </div>
    </div>
  );
};

interface CharactersPageProps {
  onCharacterClick: (characterId: string) => void;
}

const CharactersPage: React.FC<CharactersPageProps> = ({
  onCharacterClick,
}) => {
  const { characters, loading, error } = useCharacters();

  const handleCharacterClick = (id: string) => {
    onCharacterClick(id);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Characters</h1>
          <p className="text-gray-400">Browse mods by character</p>
        </div>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading characters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Characters</h1>
          <p className="text-gray-400">Browse mods by character</p>
        </div>
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Error loading characters</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Characters</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-400">Browse mods by character</p>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="flex items-center space-x-1">
              <span>📁 Drag & drop mods anywhere to import</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by name, attribute, or specialty..."
            className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onClick={handleCharacterClick}
          />
        ))}
      </div>

      {/* Empty State (if no characters) */}
      {characters.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No characters found
          </h3>
          <p className="text-gray-400">
            Characters will appear here once mods are installed
          </p>
        </div>
      )}
    </div>
  );
};

export default CharactersPage;
