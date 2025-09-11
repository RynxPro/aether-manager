import React, { useState, useMemo } from "react";
import { useCharacters } from "../hooks/useCharacters";
import CharacterCard from "../components/CharacterCard";

// Sort options type
type SortOption = "name-asc" | "name-desc" | "mods-asc" | "mods-desc" | "active-asc" | "active-desc";

// Sort option labels
const sortOptions = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "mods-desc", label: "Most Mods" },
  { value: "mods-asc", label: "Fewest Mods" },
  { value: "active-desc", label: "Most Active" },
  { value: "active-asc", label: "Fewest Active" },
] as const;

interface CharactersPageProps {
  onCharacterClick: (characterId: string) => void;
}

const CharactersPage: React.FC<CharactersPageProps> = ({
  onCharacterClick,
}) => {
  const { characters, loading, error } = useCharacters();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  const handleCharacterClick = (id: string) => {
    onCharacterClick(id);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  const filteredAndSortedCharacters = useMemo(() => {
    // Filter characters based on search query
    let result = [...characters];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(character => {
        // Search by name (case insensitive)
        if (character.name.toLowerCase().includes(query)) return true;
        
        // Search by attribute (e.g., 'fire', 'ice')
        if (character.attribute.toLowerCase().includes(query)) return true;
        
        // Search by specialty (e.g., 'attack', 'defense')
        if (character.specialty.toLowerCase().includes(query)) return true;
        
        // Search by rank (e.g., 'a', 's')
        if (character.rank.toLowerCase() === query) return true;
        
        return false;
      });
    }

    // Sort characters based on selected sort option
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'mods-asc':
          return a.installedMods - b.installedMods;
        case 'mods-desc':
          return b.installedMods - a.installedMods;
        case 'active-asc':
          return a.activeMods - b.activeMods;
        case 'active-desc':
          return b.activeMods - a.activeMods;
        default:
          return 0;
      }
    });
  }, [characters, searchQuery, sortBy]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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

      <div className="mb-12 max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
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
          
          {/* Sort Dropdown */}
          <div className="w-full sm:w-64">
            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full appearance-none px-4 py-2 pr-10 bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-lg text-white focus:outline-none focus:border-[var(--moon-glow-violet)] focus:ring-2 focus:ring-[var(--moon-glow-violet)]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {searchQuery && (
          <p className="text-sm text-[var(--moon-muted)] mt-2 text-center sm:text-left">
            Showing {filteredAndSortedCharacters.length} {filteredAndSortedCharacters.length === 1 ? 'result' : 'results'}
          </p>
        )}
      </div>

      {/* Characters Grid */}
      <div className="w-full">
        {filteredAndSortedCharacters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
            {filteredAndSortedCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={handleCharacterClick}
              />
            ))}
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-[var(--moon-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--moon-text)] mb-2">
              No characters found
            </h3>
            <p className="text-[var(--moon-muted)]">
              No characters are available
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-[var(--moon-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--moon-text)] mb-2">
              No matching characters found
            </h3>
            <p className="text-[var(--moon-muted)]">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharactersPage;
