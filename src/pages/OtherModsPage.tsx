import React, { useState } from "react";
import ModCard from "../components/ModCard";
import ModInstallDialog from "../components/ModInstallDialog";
import { useCharacters } from "../hooks/useCharacters";
import { useMods } from "../hooks/useMods";

const OtherModsPage: React.FC = () => {
  const { getOtherMods, loading } = useCharacters();
  const { toggleModActive, fetchMods } = useMods();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  const otherMods = getOtherMods();

  // Filter mods based on search and status
  const filteredMods = otherMods.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mod.description &&
        mod.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && mod.isActive) ||
      (statusFilter === "inactive" && !mod.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleToggleActive = async (id: string) => {
    await toggleModActive(id);
  };

  const handleInstallSuccess = () => {
    fetchMods();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Other Mods</h1>
        <p className="text-gray-400">
          Manage mods not assigned to specific characters
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search mods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Mods Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading mods...</p>
        </div>
      ) : filteredMods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMods.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎮</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm || statusFilter !== "all"
              ? "No matching mods found"
              : "No other mods found"}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Mods not assigned to characters will appear here"}
          </p>
          <button
            onClick={() => setShowInstallDialog(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Add New Mod
          </button>
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

export default OtherModsPage;
