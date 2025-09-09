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
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}
        >
          <span className="text-2xl">{icon}</span>
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Overview of your mod collection and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Installed Mods"
          value={statsLoading ? 0 : stats.installedMods}
          icon="📦"
          color="bg-blue-600"
        />
        <StatsCard
          title="Active Mods"
          value={statsLoading ? 0 : stats.activeMods}
          icon="✅"
          color="bg-green-600"
        />
        <StatsCard
          title="Inactive Mods"
          value={statsLoading ? 0 : stats.inactiveMods}
          icon="⏸️"
          color="bg-yellow-600"
        />
        <StatsCard
          title="Presets"
          value={statsLoading ? 0 : stats.presets}
          icon="🎛️"
          color="bg-purple-600"
        />
      </div>

      {/* All Mods Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">All Mods</h2>
          <button
            onClick={() => setShowInstallDialog(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Add New Mod
          </button>
        </div>

        {modsLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading mods...</p>
          </div>
        ) : mods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mods.map((mod) => (
              <ModCard
                key={mod.id}
                mod={mod}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎮</span>
            </div>
            <p className="text-gray-400 mb-2">No mods installed yet</p>
            <p className="text-gray-500 text-sm">
              Start by adding some mods to see them here
            </p>
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
