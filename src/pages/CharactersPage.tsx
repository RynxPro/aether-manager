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

  // Memoize the character cards to prevent unnecessary re-renders
  const characterCards = useMemo(() => 
    filteredAndSortedCharacters.map((character) => (
      <CharacterCard
        key={character.id}
        character={character}
        onClick={handleCharacterClickInternal}
        className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      />
    )),
    [filteredAndSortedCharacters, handleCharacterClickInternal]
  );

  return (
    <PageContainer className="pb-12">
      {/* Page Title */}
      <PageHeader 
        title="Character Library"
        description="Browse and manage your character mods"
        className="mb-6"
      />

      {/* Sticky Search & Sort Bar */}
      <div className="sticky top-0 z-10 bg-[var(--moon-bg)]/90 backdrop-blur-sm border-b border-[var(--moon-border)] -mx-6 px-6 pb-4 pt-2 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[1800px] mx-auto">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, element, or role..."
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <SortDropdown
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={handleSortChange}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div>
        {/* Results Count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--moon-text)]">
              {searchQuery ? 'Search Results' : 'All Characters'}
            </h2>
            <p className="text-sm text-[var(--moon-muted)]">
              {filteredAndSortedCharacters.length} {filteredAndSortedCharacters.length === 1 ? 'character' : 'characters'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSortBy('name-asc');
              }}
              className="text-sm font-medium text-[var(--moon-accent)] hover:text-[var(--moon-glow-violet)] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[var(--moon-surface)]"
            >
              <span>Clear filters</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Character Grid */}
        {filteredAndSortedCharacters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-[var(--moon-border)] rounded-xl bg-[var(--moon-surface)]/50">
            <div className="w-20 h-20 rounded-full bg-[var(--moon-surface)] flex items-center justify-center mb-6 border-2 border-dashed border-[var(--moon-glow-violet)]">
              <svg className="w-10 h-10 text-[var(--moon-glow-violet)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--moon-text)] mb-2">No characters found</h3>
            <p className="text-[var(--moon-muted)] max-w-md mb-6">
              {searchQuery 
                ? `No characters match "${searchQuery}". Try a different search term.`
                : 'No characters are currently available.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--moon-accent)] hover:bg-[var(--moon-accent-hover)] rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
            {characterCards}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default CharactersPage;
