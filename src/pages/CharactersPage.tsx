import React, { useState, useMemo, useCallback } from "react";
import { useCharacters } from "../hooks/useCharacters";
import CharacterCard from "../components/CharacterCard";
import { 
  LoadingSpinner, 
  ErrorState, 
  EmptyState, 
  SearchBar, 
  SortDropdown, 
  PageContainer,
  PageHeader,
  type SortOption
} from "../components/characters";

// Sort option labels
const SORT_OPTIONS: SortOption[] = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "mods-desc", label: "Most Mods" },
  { value: "mods-asc", label: "Fewest Mods" },
  { value: "active-desc", label: "Most Active" },
  { value: "active-asc", label: "Fewest Active" },
];

type SortOptionType = typeof SORT_OPTIONS[number]['value'];

interface CharactersPageProps {
  onCharacterClick: (characterId: string) => void;
}

const CharactersPage: React.FC<CharactersPageProps> = ({ onCharacterClick }) => {
  const { characters, loading, error } = useCharacters();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOptionType>("name-asc");

  const handleCharacterClickInternal = useCallback((id: string) => {
    onCharacterClick(id);
  }, [onCharacterClick]);

  const filteredAndSortedCharacters = useMemo(() => {
    if (!characters) return [];
    
    // Filter characters based on search query
    let result = [...characters];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((character) => {
        return (
          character.name.toLowerCase().includes(query) ||
          character.attribute.toLowerCase().includes(query) ||
          character.specialty.toLowerCase().includes(query) ||
          character.rank.toLowerCase() === query
        );
      });
    }

    // Sort characters based on selected sort option
    return result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "mods-asc": return a.installedMods - b.installedMods;
        case "mods-desc": return b.installedMods - a.installedMods;
        case "active-asc": return a.activeMods - b.activeMods;
        case "active-desc": return b.activeMods - a.activeMods;
        default: return 0;
      }
    });
  }, [characters, searchQuery, sortBy]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as SortOptionType);
  }, []);

  // Loading state
  if (loading) {
    return (
      <PageContainer>
        <PageHeader 
          title="Character Library"
          description="Manage and explore your characters' mods"
        />
        <div className="py-16">
          <LoadingSpinner message="Loading characters..." />
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <PageContainer>
        <PageHeader 
          title="Character Library"
          description="Manage and explore your characters' mods"
        />
        <ErrorState 
          error={error} 
          onRetry={() => window.location.reload()} 
        />
      </PageContainer>
    );
  }

  // Empty state
  if (characters.length === 0) {
    return (
      <PageContainer>
        <PageHeader 
          title="Character Library"
          description="Manage and explore your characters' mods"
        />
        <EmptyState
          title="No Characters Found"
          description="You don't have any characters with mods installed yet."
          icon="🎮"
        />
      </PageContainer>
    );
  }

  // Main content
  return (
    <PageContainer>
      <PageHeader 
        title="Character Library"
        description="Manage and explore your characters' mods"
      >
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 sm:mt-0">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search characters..."
            className="w-full sm:w-64"
          />
          <SortDropdown
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={handleSortChange}
            className="w-full sm:w-48"
          />
        </div>
      </PageHeader>

      <div className="mb-8">
        <div className="text-sm text-gray-400 mb-2">
          Showing {filteredAndSortedCharacters.length} {filteredAndSortedCharacters.length === 1 ? 'character' : 'characters'}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
        
        {filteredAndSortedCharacters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--moon-surface)] flex items-center justify-center mb-6 border-2 border-dashed border-[var(--moon-glow-violet)]">
              <svg className="w-10 h-10 text-[var(--moon-glow-violet)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--moon-text)] mb-2">No characters found</h3>
            <p className="text-[var(--moon-muted)] max-w-md mb-6">
              No characters match "{searchQuery}". Try a different search term.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSortBy('name-asc');
              }}
              className="px-4 py-2 text-sm font-medium text-[var(--moon-accent)] hover:text-[var(--moon-glow-violet)] transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => handleCharacterClickInternal(character.id)}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default CharactersPage;
