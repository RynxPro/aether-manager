import React, { useState } from "react";
import ModCard from "../components/ModCard";
import ModInstallDialog from "../components/ModInstallDialog";
import { useModsContext } from "../context/ModsContext";
import { useStats } from "../hooks/useStats";
import { cnButton } from "../styles/buttons";
import SearchBar from "../components/characters/SearchBar";
import SortDropdown from "../components/characters/SortDropdown";
import PageContainer, { PageHeader } from "../components/characters/PageContainer";

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
        <div className="p-2 rounded-lg bg-[var(--moon-bg)]">
          {icon}
        </div>
      </div>
    </div>
  );
};

const BoxIcon = () => (
  <svg className="w-5 h-5 text-[var(--moon-glow-violet)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PresetIcon = () => (
  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DashboardPage: React.FC = () => {
  const {
    mods,
    loading: modsLoading,
    toggleModActive,
    deleteMod,
    fetchMods,
  } = useModsContext();
  const { stats, loading: statsLoading, fetchStats } = useStats();
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  const statsData = [
    {
      title: 'Total Mods',
      value: stats?.installedMods || 0,
      icon: <BoxIcon />,
      loading: statsLoading
    },
    {
      title: 'Active Mods',
      value: stats?.activeMods || 0,
      icon: <CheckIcon />,
      loading: statsLoading
    },
    {
      title: 'Inactive Mods',
      value: stats?.inactiveMods || 0,
      icon: <PauseIcon />,
      loading: statsLoading
    },
    {
      title: 'Presets',
      value: stats?.presets || 0,
      icon: <PresetIcon />,
      loading: statsLoading
    }
  ];

  const handleToggleActive = async (modId: string) => {
    await toggleModActive(modId);
    fetchStats(); // Refresh stats after toggling mod active state
  };

  const handleDeleteMod = async (modId: string) => {
    try {
      await deleteMod(modId);
      await fetchMods(); // Refresh the mods list
      await fetchStats(); // Refresh stats after deleting mod
    } catch (error) {
      console.error("Failed to delete mod:", error);
    }
  };

  const handleInstallSuccess = () => {
    fetchMods();
    fetchStats();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your mods and statistics"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Search and Actions */}
      <div className="sticky top-0 z-10 bg-[var(--moon-bg)]/90 backdrop-blur-sm border-b border-[var(--moon-border)] -mx-6 px-6 pt-2 pb-4 mb-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search mods..."
              value=""
              onChange={() => {}}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-full sm:w-48">
              <SortDropdown
                options={[]}
                value=""
                onChange={() => {}}
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

      {/* Mods Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--moon-text)]">Your Mods</h2>
          <div className="text-sm text-[var(--moon-muted)]">
            {mods.length} {mods.length === 1 ? 'mod' : 'mods'} total
          </div>
        </div>

        {modsLoading ? (
          <div className="text-center py-16 bg-[var(--moon-surface)] rounded-xl border border-[var(--moon-border)]">
            <div className="w-12 h-12 border-4 border-[var(--moon-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--moon-muted)]">Loading your mods...</p>
          </div>
        ) : mods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
            {mods.map((mod) => (
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
          <div className="text-center py-16 bg-[var(--moon-surface)] rounded-xl border-2 border-dashed border-[var(--moon-border)]">
            <div className="w-20 h-20 bg-[var(--moon-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--moon-text)] mb-2">
              No mods found
            </h3>
            <p className="text-[var(--moon-muted)] max-w-md mx-auto mb-6">
              You haven't added any mods yet. Upload your first mod to get started.
            </p>
            <button
              onClick={() => setShowInstallDialog(true)}
              className={cnButton({ variant: 'primary', size: 'md' })}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Your First Mod
            </button>
          </div>
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
