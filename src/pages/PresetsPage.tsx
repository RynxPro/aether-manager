import React, { useMemo, useState } from "react";
import { usePresets } from "../hooks/usePresets";
import PresetCreateDialog from "../components/PresetCreateDialog";
import { Preset } from "../types/preset";
import PageContainer, {
  PageHeader,
} from "../components/characters/PageContainer";
import ConfirmDialog from "../components/ConfirmDialog";
import { cnButton } from "../styles/buttons";
import { useMods } from "../hooks/useMods";
import LoadingSpinner from "../components/characters/LoadingSpinner";
import ErrorState from "../components/characters/ErrorState";
import SearchBar from "../components/characters/SearchBar";
import SortDropdown from "../components/characters/SortDropdown";

interface PresetsPageProps {
  onPresetClick?: (presetId: string) => void;
}

const PresetsPage: React.FC<PresetsPageProps> = ({ onPresetClick }) => {
  const { presets, loading, error, applyPreset, deletePreset } = usePresets();
  const { mods } = useMods();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<Preset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name-asc");

  const SORT_OPTIONS = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  const filteredAndSorted = useMemo(() => {
    let list = presets || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    const sorted = [...list].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        default:
          return 0;
      }
    });
    return sorted;
  }, [presets, searchQuery, sortBy]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Loading state similar to OtherModsPage/CharacterModPage
  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Presets"
          description="Create and manage mod presets. Quickly switch between saved sets of active mods."
        />
        <div className="py-16">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Presets"
        description="Create and manage mod presets. Quickly switch between saved sets of active mods."
      />

      {/* Action Bar (sticky) */}
      <div className="sticky top-0 z-10 bg-[var(--moon-bg)]/90 backdrop-blur-sm border-b border-[var(--moon-border)] -mx-6 px-6 pt-2 pb-4 mb-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search presets..."
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
                onChange={setSortBy}
              />
            </div>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className={cnButton({
              variant: "primary",
              className: "flex items-center gap-2",
            })}
            title="Create a new preset"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Preset</span>
          </button>
        </div>
      </div>

      <PresetCreateDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />

      {error && (
        <ErrorState
          error={error}
          onRetry={() => {
            /* no-op for now */
          }}
        />
      )}

      {filteredAndSorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--moon-surface)] flex items-center justify-center mb-6 border-2 border-dashed border-[var(--moon-glow-violet)]">
            <svg
              className="w-10 h-10 text-[var(--moon-glow-violet)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
            No Presets Found
          </h3>
          <p className="text-[var(--moon-muted)] max-w-md mb-8">
            You haven't created any presets yet. Create a preset from your
            current active mods or by selecting mods.
          </p>
          <button
            onClick={() => setDialogOpen(true)}
            className={cnButton({
              variant: "primary",
              size: "xl",
              className: "flex items-center space-x-2",
            })}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create Preset</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSorted.map((p) => {
            const activeIds = new Set(
              mods.filter((m) => m.isActive).map((m) => m.id)
            );
            const isApplied =
              p.mod_ids.length === activeIds.size &&
              p.mod_ids.every((id) => activeIds.has(id));
            return (
              <div
                key={p.id}
                className="bg-[var(--moon-surface)] rounded-xl border border-[var(--moon-border)] overflow-hidden flex flex-col hover:border-[var(--moon-glow-violet)] hover:shadow-[0_0_15px_rgba(122,90,248,0.2)] transition-all duration-300 cursor-pointer"
                onClick={() => onPresetClick?.(p.id)}
              >
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className="text-[var(--moon-text)] font-semibold truncate"
                      title={p.name}
                    >
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {isApplied && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 whitespace-nowrap">
                          Applied
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--moon-bg)] border border-[var(--moon-border)] text-[var(--moon-muted)] whitespace-nowrap">
                        {p.mod_ids.length}{" "}
                        {p.mod_ids.length === 1 ? "mod" : "mods"}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--moon-muted)]">
                    {new Date(p.created_at).toLocaleString()}
                  </div>
                  <div
                    className="mt-auto pt-3 border-t border-[var(--moon-border)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <button
                        onClick={() => applyPreset(p.id)}
                        disabled={isApplied}
                        className={`px-2 py-1 text-xs rounded-lg border transition ${
                          isApplied
                            ? "bg-gray-500/10 text-gray-400 border-gray-500/30 cursor-not-allowed"
                            : "bg-[var(--moon-accent)]/20 text-[var(--moon-accent)] border-[var(--moon-glow-violet)]/30 hover:bg-[var(--moon-accent)]/25"
                        }`}
                      >
                        {isApplied ? "Applied" : "Apply"}
                      </button>
                      <button
                        onClick={() => setDeleting(p)}
                        className="px-2 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/15 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleting}
        title="Delete Preset"
        message={
          deleting
            ? `Are you sure you want to delete "${deleting.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleting) {
            deletePreset(deleting.id);
            setDeleting(null);
          }
        }}
        onCancel={() => setDeleting(null)}
      />
    </PageContainer>
  );
};

export default PresetsPage;
