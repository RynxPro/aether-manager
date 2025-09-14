import { useState, useCallback, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import OtherModsPage from "./pages/OtherModsPage";
import CharactersPage from "./pages/CharactersPage";
import CharacterModPage from "./pages/CharacterModPage";
import ModDetailsPage from "./pages/ModDetailsPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";

// Define valid page types for type safety
type PageType =
  | "dashboard"
  | "mods"
  | "characters"
  | "character-mod"
  | "mod-details"
  | "settings";

type NavigationState = {
  currentPage: PageType;
  selectedCharacter: string | null;
  selectedMod: string | null;
};

function App() {
  // Use a single state object to prevent race conditions
  const [navigation, setNavigation] = useState<NavigationState>({
    currentPage: "dashboard",
    selectedCharacter: null,
    selectedMod: null,
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
        return { ...prev, currentPage: "characters" };
      }

      // If navigating to mod-details without a mod, redirect to mods
      if (page === "mod-details" && !prev.selectedMod) {
        console.warn("Cannot navigate to mod-details without a selected mod");
        return { ...prev, currentPage: "mods" };
      }

      // Otherwise, update the page and clear selections if needed
      return {
        currentPage: page,
        selectedCharacter:
          page === "character-mod" ? prev.selectedCharacter : null,
        selectedMod: page === "mod-details" ? prev.selectedMod : null,
      };
    });
  }, []);

  // Handle character selection
  const handleCharacterClick = useCallback((characterId: string) => {
    setNavigation({
      currentPage: "character-mod",
      selectedCharacter: characterId,
      selectedMod: null,
    });
  }, []);

  // Handle mod selection
  const handleModClick = useCallback((modId: string) => {
    setNavigation({
      currentPage: "mod-details",
      selectedCharacter: null,
      selectedMod: modId,
    });
  }, []);

  // Navigate back to characters list
  const handleBackToCharacters = useCallback(() => {
    console.log("Navigating back to characters list");
    try {
      setNavigation({
        currentPage: "characters",
        selectedCharacter: null,
        selectedMod: null,
      });
    } catch (error) {
      console.error("Error in handleBackToCharacters:", error);
    }
  }, []);

  // Navigate back to mods list
  const handleBackToMods = useCallback(() => {
    console.log("Navigating back to mods list");
    try {
      setNavigation({
        currentPage: "mods",
        selectedCharacter: null,
        selectedMod: null,
      });
    } catch (error) {
      console.error("Error in handleBackToMods:", error);
    }
  }, []);

  // Debug effect to log navigation changes
  useEffect(() => {
    console.log("Navigation state changed:", navigation);
  }, [navigation]);

  // Render the current page with proper error boundaries
  const renderPage = () => {
    try {
      switch (navigation.currentPage) {
        case "dashboard":
          return <DashboardPage />;
        case "mods":
          return <OtherModsPage onModClick={handleModClick} />;
        case "characters":
          return <CharactersPage onCharacterClick={handleCharacterClick} />;
        case "character-mod":
          if (navigation.selectedCharacter) {
            return (
              <CharacterModPage
                characterId={navigation.selectedCharacter}
                onBack={handleBackToCharacters}
                onModClick={handleModClick}
              />
            );
          }
          // Fallback to characters page if no character is selected
          return <CharactersPage onCharacterClick={handleCharacterClick} />;
        case "mod-details":
          if (navigation.selectedMod) {
            return (
              <ModDetailsPage
                modId={navigation.selectedMod}
                onBack={handleBackToMods}
              />
            );
          }
          // Fallback to mods page if no mod is selected
          return <OtherModsPage onModClick={handleModClick} />;
        case "settings":
          return <SettingsPage />;
        default:
          console.warn("Unknown page, redirecting to dashboard");
          return <DashboardPage />;
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
