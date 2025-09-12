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
  const { mods, loading, error, toggleModActive, deleteMod } = useMods();
  const { characters } = useCharacters();

  // Filter mods for this specific character
  const characterMods =
    mods?.filter((mod) => mod.character === characterId) || [];

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
    console.log(`Upload new mod for character ${characterId}`);
    // Will be implemented with actual file upload logic
  };

  return (
    <div className="max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 py-4">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-[var(--moon-muted)] hover:text-[var(--moon-glow-violet)] hover:drop-shadow-[0_0_6px_var(--moon-glow-violet)] transition-colors mb-4"
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
      <div className="sticky top-0 z-10 bg-[var(--moon-bg)]/90 backdrop-blur-md border-b border-[var(--moon-border)] mb-8 px-4 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search mods..."
                className="w-full px-3 py-1.5 pl-10 bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[var(--moon-glow-violet)] focus:ring-2 focus:ring-[var(--moon-glow-violet)]"
              />
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-[var(--moon-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <button
            onClick={handleUploadMod}
            className="px-6 py-2 bg-[var(--moon-accent)] hover:bg-[var(--moon-glow-violet)] text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
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
            You haven't added any mods for {character.name} yet. Upload your first mod to enhance your game experience.
          </p>
          <button
            onClick={handleUploadMod}
            className="px-8 py-3 bg-[var(--moon-accent)] hover:bg-[var(--moon-glow-violet)] text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-[var(--moon-glow-violet)]/20"
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
