import React, { useMemo, useState, useCallback } from "react";
import ModCard from "../components/ModCard";
import ModInstallDialog from "../components/ModInstallDialog";
import { useMods } from "../hooks/useMods";
import { useStats } from "../hooks/useStats";
import { cnButton } from "../styles/buttons";
import SearchBar from "../components/characters/SearchBar";
import SortDropdown from "../components/characters/SortDropdown";
import PageContainer, {
  PageHeader,
} from "../components/characters/PageContainer";
import LoadingSpinner from "../components/characters/LoadingSpinner";
import ErrorState from "../components/characters/ErrorState";
import EmptyState from "../components/characters/EmptyState";

const StatsCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  loading?: boolean;
}> = ({ title, value, icon, loading = false }) => {
  return (
    <div className="bg-[var(--moon-surface)] rounded-xl border border-[var(--moon-border)] p-6 transition-all hover:border-[var(--moon-glow-violet)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--moon-muted)] mb-1">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-20 bg-[var(--moon-bg)] rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-semibold text-[var(--moon-text)]">
              {value.toLocaleString()}
            </p>
          )}
        </div>
        <div className="p-2 rounded-lg bg-[var(--moon-bg)]">{icon}</div>
      </div>
    </div>
  );
};

const BoxIcon = () => (
  <svg
    className="w-5 h-5 text-[var(--moon-glow-violet)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const PauseIcon = () => (
  <svg
    className="w-5 h-5 text-amber-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PresetIcon = () => (
  <svg
    className="w-5 h-5 text-purple-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

type SortOption = {
  value: string;
  label: string;
};

const SORT_OPTIONS: SortOption[] = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "active", label: "Active First" },
  { value: "inactive", label: "Inactive First" },
];

type SortOptionType = (typeof SORT_OPTIONS)[number]["value"];

const DashboardPage: React.FC = () => {
  const {
    mods,
    loading: modsLoading,
    error: modsError,
    toggleModActive,
    deleteMod,
    fetchMods,
  } = useMods();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    fetchStats,
  } = useStats();
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOptionType>("name-asc");

  const statsData = [
    {
      title: "Total Mods",
      value: stats?.installedMods || 0,
      icon: <BoxIcon />,
      loading: statsLoading,
    },
    {
      title: "Active Mods",
      value: stats?.activeMods || 0,
      icon: <CheckIcon />,
      loading: statsLoading,
    },
    {
      title: "Inactive Mods",
      value: stats?.inactiveMods || 0,
      icon: <PauseIcon />,
      loading: statsLoading,
    },
    {
      title: "Presets",
      value: stats?.presets || 0,
      icon: <PresetIcon />,
      loading: statsLoading,
    },
  ];

  const handleToggleActive = useCallback(
    async (modId: string) => {
      await toggleModActive(modId);
      // Optionally refresh stats; comment out to avoid any visual updates
      // await fetchStats();
    },
    [toggleModActive, fetchStats]
  );

  const handleDeleteMod = useCallback(
    async (modId: string) => {
      try {
        await deleteMod(modId);
        await fetchMods();
        await fetchStats();
      } catch (error) {
        console.error("Failed to delete mod:", error);
      }
    },
    [deleteMod, fetchMods, fetchStats]
  );

  const handleInstallSuccess = useCallback(() => {
    fetchMods();
    fetchStats();
  }, [fetchMods, fetchStats]);

  const filteredAndSortedMods = useMemo(() => {
    let result = [...mods];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }
    return result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "active":
          return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
        case "inactive":
          return a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1;
        default:
          return 0;
      }
    });
  }, [mods, searchQuery, sortBy]);

  const renderHeaderControls = () => (
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
              onChange={(v) => setSortBy(v as SortOptionType)}
            />
          </div>
        </div>
        <button
          onClick={() => setShowInstallDialog(true)}
          className={cnButton({
            variant: "primary",
            className: "flex items-center space-x-2",
          })}
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
  );

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your mods and statistics"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsError ? (
          <div className="sm:col-span-2 lg:col-span-4">
            <ErrorState error={statsError} onRetry={fetchStats} />
          </div>
        ) : (
          statsData.map((stat, index) => <StatsCard key={index} {...stat} />)
        )}
      </div>

      {renderHeaderControls()}

      {/* Mods Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--moon-text)]">
            Your Mods
          </h2>
          <div className="text-sm text-[var(--moon-muted)]">
            {mods.length} {mods.length === 1 ? "mod" : "mods"} total
          </div>
        </div>

        {modsError ? (
          <ErrorState error={modsError} onRetry={fetchMods} />
        ) : modsLoading ? (
          <div className="py-16">
            <LoadingSpinner message="Loading your mods..." />
          </div>
        ) : filteredAndSortedMods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
            {filteredAndSortedMods.map((mod) => (
              <div key={mod.id} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--moon-accent)] to-[var(--moon-glow-violet)] rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative bg-[var(--moon-surface)] rounded-lg border border-[var(--moon-border)] overflow-hidden h-full group-hover:border-[var(--moon-accent)]/30 transition-colors duration-300">
                  <ModCard
                    mod={mod}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDeleteMod}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📦"
            title={
              searchQuery || sortBy !== "name-asc"
                ? "No matching mods found"
                : "No mods found"
            }
            description={
              searchQuery || sortBy !== "name-asc"
                ? "Try adjusting your search or filter criteria"
                : "Upload your first mod to get started."
            }
            action={
              <button
                onClick={() => setShowInstallDialog(true)}
                className={cnButton({ variant: "primary", size: "md" })}
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Upload Mod
              </button>
            }
          />
        )}
      </div>

      {/* Install Dialog */}
      <ModInstallDialog
        isOpen={showInstallDialog}
        onClose={() => setShowInstallDialog(false)}
        onSuccess={handleInstallSuccess}
      />
    </PageContainer>
  );
};

export default DashboardPage;
