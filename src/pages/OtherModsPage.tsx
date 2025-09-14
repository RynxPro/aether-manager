import React, { useState, useMemo, useCallback } from "react";
import ModCard from "../components/ModCard";
import ModInstallDialog from "../components/ModInstallDialog";
import { useMods } from "../hooks/useMods";
// Import UI components from their respective files
import LoadingSpinner from "../components/characters/LoadingSpinner";
import ErrorState from "../components/characters/ErrorState";
import EmptyState from "../components/characters/EmptyState";
import SearchBar from "../components/characters/SearchBar";
import SortDropdown from "../components/characters/SortDropdown";
import PageContainer, { PageHeader } from "../components/characters/PageContainer";

type SortOption = {
  value: string;
  label: string;
};

// Sort option labels
const SORT_OPTIONS: SortOption[] = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "active", label: "Active First" },
  { value: "inactive", label: "Inactive First" },
];

type SortOptionType = (typeof SORT_OPTIONS)[number]["value"];

const OtherModsPage: React.FC = () => {
  const { mods, loading, error, toggleModActive, fetchMods, deleteMod } = useMods();
  
  // Filter mods that don't have a character assigned
  const otherMods = useMemo(() => {
    return mods.filter(mod => !mod.character);
  }, [mods]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOptionType>("name-asc");
  const [showInstallDialog, setShowInstallDialog] = useState(false);


  const filteredAndSortedMods = useMemo(() => {
    if (!otherMods) return [];

    // Filter mods based on search query
    let result = [...otherMods];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((mod) => {
        return (
          mod.title.toLowerCase().includes(query) ||
          (mod.description && mod.description.toLowerCase().includes(query))
        );
      });
    }

    // Sort mods based on selected sort option
    return result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "active":
          return (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1;
        case "inactive":
          return (a.isActive === b.isActive) ? 0 : a.isActive ? 1 : -1;
        default:
          return 0;
      }
    });
  }, [otherMods, searchQuery, sortBy]);

  const handleToggleActive = useCallback(async (id: string) => {
    try {
      await toggleModActive(id);
    } catch (err) {
      console.error("Failed to toggle mod active state:", err);
    }
  }, [toggleModActive]);

  const handleDeleteMod = useCallback(async (id: string) => {
    try {
      const success = await deleteMod(id);
      if (success) {
        // Refresh the mods list after successful deletion
        await fetchMods();
      } else {
        console.error("Failed to delete mod");
      }
    } catch (err) {
      console.error("Failed to delete mod:", err);
    }
  }, [deleteMod, fetchMods]);


  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as SortOptionType);
  }, []);

  // Loading state
  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Other Mods"
          description="Manage mods not assigned to specific characters"
        />
        <div className="py-16">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Other Mods"
          description="Manage mods not assigned to specific characters"
        />
        <ErrorState 
          error={error} 
          onRetry={fetchMods} 
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Other Mods"
        description="Manage mods not assigned to specific characters"
      >
        <button
          onClick={() => setShowInstallDialog(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Install Mod
        </button>
      </PageHeader>

      {/* Search and Sort Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search mods..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full sm:w-64">
          <SortDropdown
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={handleSortChange}
          />
        </div>
      </div>

      {/* Mods Grid */}
      {filteredAndSortedMods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedMods.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteMod}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🎮"
          title={
            searchQuery || sortBy !== "name-asc"
              ? "No matching mods found"
              : "No mods found"
          }
          description={
            searchQuery || sortBy !== "name-asc"
              ? "Try adjusting your search or filter criteria"
              : "Mods not assigned to characters will appear here"
          }
        />
      )}
      {/* Install Dialog */}
      <ModInstallDialog
        isOpen={showInstallDialog}
        onClose={() => setShowInstallDialog(false)}
        onSuccess={() => {
          fetchMods();
          setShowInstallDialog(false);
        }}
      />
    </PageContainer>
  );
};

export default OtherModsPage;
