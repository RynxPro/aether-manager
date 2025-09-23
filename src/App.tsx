import { useState, useCallback, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import OtherModsPage from "./pages/OtherModsPage";
import CharactersPage from "./pages/CharactersPage";
import CharacterModPage from "./pages/CharacterModPage";
import ModDetailsPage from "./pages/ModDetailsPage";
import SettingsPage from "./pages/SettingsPage";
import PresetsPage from "./pages/PresetsPage";
import "./App.css";
import { PageType } from "./types/navigation";

import AboutPage from "./pages/AboutPage";

type NavigationState = {
  currentPage: PageType;
  selectedCharacter: string | null;
  selectedMod: string | null;
  modCharacterContext: string | null; // Track which character's mod we're viewing (or null for other mods)
  lastPage: PageType | null; // Track where we came from when opening mod details
};

function App() {
  // Use a single state object to prevent race conditions
  const [navigation, setNavigation] = useState<NavigationState>({
    currentPage: "dashboard",
    selectedCharacter: null,
    selectedMod: null,
    modCharacterContext: null, // Track which character's mod we're viewing (or null for other mods)
    lastPage: null,
  });

  // Handle page changes with validation
  const handlePageChange = useCallback((page: PageType) => {
    setNavigation((prev) => {
      // If we're already on this page, do nothing
      if (page === prev.currentPage) return prev;

      // If navigating to character-mod without a character, redirect to characters
      if (page === "character-mod" && !prev.selectedCharacter) {
        console.warn(
          "Cannot navigate to character-mod without a selected character"
        );
        return {
          ...prev,
          currentPage: "characters",
          modCharacterContext: null,
          lastPage: null,
        };
      }

      // If navigating to mod-details without a mod, redirect to mods
      if (page === "mod-details" && !prev.selectedMod) {
        console.warn("Cannot navigate to mod-details without a selected mod");
        return {
          ...prev,
          currentPage: "mods",
          modCharacterContext: null,
        };
      }

      // Otherwise, update the page and clear selections if needed
      return {
        currentPage: page,
        selectedCharacter:
          page === "character-mod" ? prev.selectedCharacter : null,
        selectedMod: page === "mod-details" ? prev.selectedMod : null,
        modCharacterContext: prev.modCharacterContext, // Preserve the context
        lastPage: null,
      };
    });
  }, []);

  // Handle character selection
  const handleCharacterClick = useCallback((characterId: string) => {
    setNavigation({
      currentPage: "character-mod",
      selectedCharacter: characterId,
      selectedMod: null,
      modCharacterContext: null, // Clear context when navigating to character mods
      lastPage: null,
    });
  }, []);

  // Handle mod selection
  const handleModClick = useCallback((modId: string, characterId?: string) => {
    setNavigation((prev) => ({
      currentPage: "mod-details",
      selectedCharacter: characterId || null,
      selectedMod: modId,
      // Only keep character context if we navigated from the character-mod page
      modCharacterContext: prev.currentPage === "character-mod" && characterId ? characterId : null,
      // Remember where we came from so Back returns there (e.g., dashboard or mods)
      lastPage: prev.currentPage,
    }));
  }, []);

  // Navigate back to characters list
  const handleBackToCharacters = useCallback(() => {
    console.log("Navigating back to characters list");
    try {
      setNavigation({
        currentPage: "characters",
        selectedCharacter: null,
        selectedMod: null,
        modCharacterContext: null, // Clear context when going back to characters list
        lastPage: null,
      });
    } catch (error) {
      console.error("Error navigating to characters list:", error);
    }
  }, []);

  // Navigate back to the appropriate page based on mod context
  const handleBackFromModDetails = useCallback(() => {
    setNavigation((prev) => {
      // If the mod was viewed from a character's page, go back to that character
      if (prev.modCharacterContext) {
        return {
          currentPage: "character-mod",
          selectedCharacter: prev.modCharacterContext,
          selectedMod: null,
          modCharacterContext: null,
          lastPage: null,
        } as NavigationState;
      }
      // Otherwise go back to where we came from (dashboard/mods/characters/settings...)
      if (prev.lastPage) {
        return {
          currentPage: prev.lastPage,
          selectedCharacter: null,
          selectedMod: null,
          modCharacterContext: null,
          lastPage: null,
        } as NavigationState;
      }
      // Fallback to mods page if no history
      return {
        currentPage: "mods",
        selectedCharacter: null,
        selectedMod: null,
        modCharacterContext: null,
        lastPage: null,
      } as NavigationState;
    });
  }, []);

  // Debug effect to log navigation changes
  useEffect(() => {
    console.log("Navigation state changed:", navigation);
  }, [navigation]);

  // Destructure navigation state for easier access
  const { currentPage, selectedCharacter } = navigation;

  // Render the current page with proper error boundaries
  const renderPage = () => {
    try {
      switch (currentPage) {
        case "dashboard":
          return <DashboardPage onModClick={handleModClick} />;
        case "mods":
          return <OtherModsPage onModClick={handleModClick} />;
        case "presets":
          return <PresetsPage />;
        case "characters":
          return <CharactersPage onCharacterClick={handleCharacterClick} />;
        case "character-mod":
          return selectedCharacter ? (
            <CharacterModPage
              characterId={selectedCharacter}
              onBack={handleBackToCharacters}
              onModClick={handleModClick}
            />
          ) : (
            <div>Error: No character selected</div>
          );
        case "mod-details":
          if (navigation.selectedMod) {
            return (
              <ModDetailsPage
                modId={navigation.selectedMod}
                onBack={handleBackFromModDetails}
              />
            );
          }
          // Fallback to mods page if no mod is selected
          return <OtherModsPage onModClick={handleModClick} />;
        case "settings":
          return <SettingsPage />;
        case "about":
          return <AboutPage />;
        default:
          return <div>Page not found</div>;
      }
    } catch (error) {
      console.error("Error rendering page:", error);
      return (
        <div className="p-4 text-red-500">
          An error occurred while loading the page. Please try again.
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-[var(--moon-bg)]">
      <Sidebar
        currentPage={navigation.currentPage}
        onPageChange={handlePageChange}
      />
      <main className="flex-1 overflow-y-auto backdrop-blur-sm px-6">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
