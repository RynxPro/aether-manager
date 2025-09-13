import React, { useState } from "react";
import ModCard from "../components/ModCard";
import ModInstallDialog from "../components/ModInstallDialog";
import { useMods } from "../hooks/useMods";
import { useStats } from "../hooks/useStats";
import { cnButton } from "../styles/buttons";

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[var(--muted)] text-xs font-medium uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-xl font-semibold text-[var(--text)] mt-1">
            {value}
          </p>
        </div>
        <div
          className={`w-8 h-8 rounded-lg bg-[var(--accent-weak)] flex items-center justify-center`}
        >
          <span className="text-lg text-[var(--accent)]">{icon}</span>
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const {
    mods,
    loading: modsLoading,
    toggleModActive,
    deleteMod,
    fetchMods,
  } = useMods();
  const { stats, loading: statsLoading, fetchStats } = useStats();
  const [showInstallDialog, setShowInstallDialog] = useState(false);

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
    <div className="p-6 bg-[var(--bg)] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-[var(--muted)] text-sm">
              Manage your mod collection
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-[var(--muted)]">
            <span className="bg-[var(--surface)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
              📁 Drag & drop mods anywhere to import
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total"
          value={statsLoading ? 0 : stats.installedMods}
          icon="📦"
        />
        <StatsCard
          title="Active"
          value={statsLoading ? 0 : stats.activeMods}
          icon="✅"
        />
        <StatsCard
          title="Inactive"
          value={statsLoading ? 0 : stats.inactiveMods}
          icon="⏸️"
        />
        <StatsCard
          title="Presets"
          value={statsLoading ? 0 : stats.presets}
          icon="🎛️"
        />
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search mods..."
              className="w-full px-4 py-2.5 pl-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-weak)] transition-colors"
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
          <button
            onClick={() => setShowInstallDialog(true)}
            className={cnButton({ variant: 'primary', size: 'md', className: 'text-sm' })}
          >
            + Add Mod
          </button>
        </div>
      </div>

      {/* Mods Grid */}
      {modsLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Loading mods...</p>
        </div>
      ) : mods.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {mods.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteMod}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
            <span className="text-2xl">🎮</span>
          </div>
          <p className="text-[var(--muted)] mb-2">No mods installed yet</p>
          <p className="text-[var(--muted)] text-sm">
            Start by adding some mods to see them here
          </p>
        </div>
      )}

      {/* Install Dialog */}
      <ModInstallDialog
        isOpen={showInstallDialog}
        onClose={() => setShowInstallDialog(false)}
        onSuccess={handleInstallSuccess}
      />
    </div>
  );
};

export default DashboardPage;
