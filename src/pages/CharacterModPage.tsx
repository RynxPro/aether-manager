import React, { useState } from "react";
import { useMods } from "../hooks/useMods";
import { useCharacters } from "../hooks/useCharacters";
import ModCard from "../components/ModCard";
import ModInstallDialog from "../components/ModInstallDialog";
import { cnButton } from "../styles/buttons";
import SortDropdown from "../components/characters/SortDropdown";
import SearchBar from "../components/characters/SearchBar";

interface CharacterModPageProps {
  characterId: string;
  onBack: () => void;
}

const CharacterModPage: React.FC<CharacterModPageProps> = ({
  characterId,
  onBack,
}) => {
  const { mods, loading, error, toggleModActive, deleteMod, fetchMods } = useMods();
  const { characters } = useCharacters();
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('name-asc');

  // Define sort options
  const SORT_OPTIONS = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "active", label: "Active First" },
    { value: "inactive", label: "Inactive First" },
  ];

  // Filter and sort mods for this specific character
  const characterMods = React.useMemo(() => {
    let filtered = (mods || [])
      .filter((mod) => mod.character === characterId)
      .filter((mod) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          mod.title.toLowerCase().includes(query) ||
          (mod.description && mod.description.toLowerCase().includes(query))
        );
      });

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'active':
          return (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0) || a.title.localeCompare(b.title);
        case 'inactive':
          return (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0) || a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [mods, characterId, searchQuery, sortBy]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Find character data
  const character = characters.find((c) => c.id === characterId) || {
    id: characterId,
    name: "Unknown Character",
    icon: "❓",
    installedMods: 0,
    activeMods: 0,
  };

  const handleToggleActive = async (modId: string) => {
    try {
      await toggleModActive(modId);
    } catch (err) {
      console.error("Failed to toggle mod active state:", err);
    }
  };

  const handleDelete = async (modId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this mod? This action cannot be undone."
      )
    ) {
      try {
        await deleteMod(modId);
      } catch (err) {
        console.error("Failed to delete mod:", err);
      }
    }
  };

  const handleUploadMod = () => {
    setShowInstallDialog(true);
  };

  const handleInstallSuccess = async () => {
    await fetchMods(); // Refresh the mods list after installation
  };

  const [isNavigating, setIsNavigating] = React.useState(false);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isNavigating) return;
    
    setIsNavigating(true);
    try {
      onBack();
    } catch (error) {
      console.error('Error during navigation:', error);
    } finally {
      // Reset after a short delay to ensure navigation completes
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  return (
    <div className="max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 py-4">
      {/* Install Dialog */}
      <ModInstallDialog
        isOpen={showInstallDialog}
        onClose={() => setShowInstallDialog(false)}
        onSuccess={handleInstallSuccess}
        initialCharacterId={characterId}
      />
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={handleBackClick}
          disabled={isNavigating}
          className="flex items-center space-x-2 text-[var(--moon-muted)] hover:text-[var(--moon-glow-violet)] hover:drop-shadow-[0_0_6px_var(--moon-glow-violet)] transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="flex pt-2 items-center space-x-4">
          <div className="relative w-20 h-20">
            <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden border-2 border-[var(--moon-glow-violet)] group-hover:border-[var(--moon-accent)] transition-colors bg-[var(--moon-bg)]">
              {"iconUrl" in character && character.iconUrl ? (
                <img
                  src={(character as any).iconUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-3xl">
                  {"icon" in character && character.icon
                    ? (character as any).icon
                    : "👤"}
                </span>
              )}
            </div>
            <div className="absolute -inset-1 rounded-full bg-[var(--moon-glow-violet)] opacity-20 group-hover:opacity-30 blur-md -z-10 transition-opacity"></div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--moon-text)] tracking-tight mb-1">
              {character.name}
            </h1>
            <p className="text-lg text-[var(--moon-muted)]">
              Manage mods for {character.name}
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky top-0 z-10 bg-[var(--moon-bg)]/90 backdrop-blur-sm border-b border-[var(--moon-border)] -mx-6 px-6 pt-2 pb-4 mb-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search mods..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-full sm:w-48">
              <SortDropdown
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={handleSortChange}
              />
            </div>
          </div>
          <button
            onClick={handleUploadMod}
            className={cnButton({ variant: 'primary', className: 'flex items-center space-x-2' })}
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
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[var(--moon-glow-violet)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--moon-muted)]">Loading mods...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h3 className="text-xl font-semibold text-[var(--moon-text)] mb-2">
            Error loading mods
          </h3>
          <p className="text-[var(--moon-muted)]">{error}</p>
        </div>
      ) : characterMods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {characterMods.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : searchQuery ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--moon-surface)] flex items-center justify-center mb-6 border-2 border-dashed border-[var(--moon-glow-violet)]">
            <svg className="w-10 h-10 text-[var(--moon-glow-violet)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[var(--moon-text)] mb-2">No mods found</h3>
          <p className="text-[var(--moon-muted)] max-w-md">
            No mods match "{searchQuery}". Try a different search term or upload a new mod.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-6 px-4 py-2 text-sm font-medium text-[var(--moon-accent)] hover:text-[var(--moon-glow-violet)] transition-colors"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--moon-surface)] border-2 border-dashed border-[var(--moon-glow-violet)] flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-[var(--moon-glow-violet)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-[var(--moon-text)] mb-3">
            No Mods Found for {character.name}
          </h3>
          <p className="text-[var(--moon-muted)] max-w-md mb-8">
            You haven't added any mods for {character.name} yet. Upload your
            first mod to enhance your game experience.
          </p>
          <button
            onClick={handleUploadMod}
            className={cnButton({ variant: 'primary', size: 'xl', className: 'flex items-center space-x-2' })}
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
      )}
    </div>
  );
};

export default CharacterModPage;
