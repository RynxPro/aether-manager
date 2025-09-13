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
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend = 'neutral',
  trendValue,
  loading = false 
}) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-[var(--moon-muted)]'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--moon-accent)] to-[var(--moon-glow-violet)] rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
      <div className="relative bg-[var(--moon-surface)] rounded-xl p-6 border border-[var(--moon-border)] transition-all duration-300 group-hover:border-[var(--moon-accent)]/30 h-full">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--moon-muted)] uppercase tracking-wider mb-1">
                {title}
              </p>
              {loading ? (
                <div className="h-8 w-20 bg-[var(--moon-bg)] rounded-md animate-pulse mt-2"></div>
              ) : (
                <p className="text-3xl font-bold text-[var(--moon-text)]">
                  {value.toLocaleString()}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br from-[var(--moon-accent)]/10 to-[var(--moon-glow-violet)]/10`}>
              <span className="text-2xl">{icon}</span>
            </div>
          </div>
          
          {trendValue && !loading && (
            <div className="mt-4 pt-4 border-t border-[var(--moon-border)]">
              <div className="flex items-center">
                <span className={`text-sm font-medium ${trendColors[trend]}`}>
                  {trendIcons[trend]} {trendValue}
                </span>
                <span className="text-xs text-[var(--moon-muted)] ml-2">vs last week</span>
              </div>
            </div>
          )}
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

  // Mock data for trends - replace with actual data when available
  const statsData = [
    {
      title: 'Total Mods',
      value: stats?.installedMods || 0,
      icon: '📦',
      trend: 'up' as const,
      trendValue: '12%',
      loading: statsLoading
    },
    {
      title: 'Active Mods',
      value: stats?.activeMods || 0,
      icon: '✅',
      trend: 'up' as const,
      trendValue: '5%',
      loading: statsLoading
    },
    {
      title: 'Inactive Mods',
      value: stats?.inactiveMods || 0,
      icon: '⏸️',
      trend: 'down' as const,
      trendValue: '3%',
      loading: statsLoading
    },
    {
      title: 'Presets',
      value: stats?.presets || 0,
      icon: '🎛️',
      trend: 'up' as const,
      trendValue: '8%',
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
    <div className="p-6 bg-[var(--moon-bg)] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--moon-text)] mb-2">Dashboard</h1>
        <p className="text-[var(--moon-muted)]">Overview of your mods and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Search and Actions */}
      <div className="bg-[var(--moon-surface)] rounded-xl p-6 mb-8 border border-[var(--moon-border)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-2xl w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-[var(--moon-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search mods by name or description..."
              className="block w-full pl-10 pr-3 py-2.5 bg-[var(--moon-bg)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] placeholder-[var(--moon-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--moon-accent)] focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            onClick={() => setShowInstallDialog(true)}
            className={cnButton({ variant: 'primary', className: 'w-full sm:w-auto' })}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Mod
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
    </div>
  );
};

export default DashboardPage;
