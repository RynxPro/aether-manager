import React from "react";
import { useCharacters } from "../hooks/useCharacters";
import CharacterCard from "../components/CharacterCard";

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

  // Show all characters regardless of mod count

  if (loading) {
    return (
      <div className="w-full max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 py-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[var(--moon-text)] mb-2">
            Characters
          </h1>
          <p className="text-[var(--moon-muted)]">Browse mods by character</p>
        </div>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--moon-muted)]">Loading characters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 py-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[var(--moon-text)] mb-2">
            Characters
          </h1>
          <p className="text-[var(--moon-muted)]">Browse mods by character</p>
        </div>
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h3 className="text-xl font-semibold text-[var(--moon-text)] mb-2">
            Error loading characters
          </h3>
          <p className="text-[var(--moon-muted)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 py-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--moon-text)] mb-2">
          Characters
        </h1>
        <p className="text-[var(--moon-muted)]">Browse mods by character</p>
      </div>

      {/* Search Bar */}
      <div className="mb-12 max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, attribute, or specialty..."
            className="w-full px-4 py-2 pl-10 bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[var(--moon-glow-violet)] focus:ring-2 focus:ring-[var(--moon-glow-violet)]"
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onClick={handleCharacterClick}
          />
        ))}
      </div>

      {/* Empty State (if no characters found) */}
      {characters.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-[var(--moon-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold text-[var(--moon-text)] mb-2">
            No characters found
          </h3>
          <p className="text-[var(--moon-muted)]">
            Characters will appear here once mods are installed
          </p>
        </div>
      )}
    </div>
  );
};

export default CharactersPage;
