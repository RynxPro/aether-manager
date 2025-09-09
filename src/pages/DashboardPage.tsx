import React, { useState } from "react";
import ModCard from "../components/ModCard";
import ModInstallDialog from "../components/ModInstallDialog";
import { useMods } from "../hooks/useMods";
import { useStats } from "../hooks/useStats";

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50 hover:border-gray-700/50 hover:bg-gray-900/50 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wide">{title}</h3>
          <p className="text-xl font-semibold text-white mt-1">{value}</p>
        </div>
        <div className={`w-8 h-8 rounded-lg ${color}/20 flex items-center justify-center`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { mods, loading: modsLoading, toggleModActive, fetchMods } = useMods();
  const { stats, loading: statsLoading, fetchStats } = useStats();
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  const handleToggleActive = async (modId: string) => {
    await toggleModActive(modId);
    fetchStats(); // Refresh stats after toggling mod active state
  };

  const handleInstallSuccess = () => {
    fetchMods();
    fetchStats();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Mods</h1>
            <p className="text-gray-400 text-sm">
              Manage your mod collection
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>📁 Drag & drop mods anywhere to import</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total"
          value={statsLoading ? 0 : stats.installedMods}
          icon="📦"
          color="bg-blue-500"
        />
        <StatsCard
          title="Active"
          value={statsLoading ? 0 : stats.activeMods}
          icon="✅"
          color="bg-green-500"
        />
        <StatsCard
          title="Inactive"
          value={statsLoading ? 0 : stats.inactiveMods}
          icon="⏸️"
          color="bg-yellow-500"
        />
        <StatsCard
          title="Presets"
          value={statsLoading ? 0 : stats.presets}
          icon="🎛️"
          color="bg-purple-500"
        />
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search mods..."
              className="w-full px-4 py-2 pl-10 bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
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
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium text-sm transition-all duration-200 border border-blue-500/30"
          >
            + Add Mod
          </button>
        </div>
      </div>

      {/* Mods Grid */}
      {modsLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading mods...</p>
        </div>
      ) : mods.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {mods.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎮</span>
          </div>
          <p className="text-gray-400 mb-2">No mods installed yet</p>
          <p className="text-gray-500 text-sm">
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
