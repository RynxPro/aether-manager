import { useState, useCallback, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import OtherModsPage from "./pages/OtherModsPage";
import CharactersPage from "./pages/CharactersPage";
import CharacterModPage from "./pages/CharacterModPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";

// Define valid page types for type safety
type PageType = 'dashboard' | 'mods' | 'characters' | 'character-mod' | 'settings';

type NavigationState = {
  currentPage: PageType;
  selectedCharacter: string | null;
};

function App() {
  // Use a single state object to prevent race conditions
  const [navigation, setNavigation] = useState<NavigationState>({
    currentPage: 'dashboard',
    selectedCharacter: null,
  });

  // Handle page changes with validation
  const handlePageChange = useCallback((page: PageType) => {
    setNavigation(prev => {
      // If we're already on this page, do nothing
      if (page === prev.currentPage) return prev;
      
      // If navigating to character-mod without a character, redirect to characters
      if (page === 'character-mod' && !prev.selectedCharacter) {
        console.warn('Cannot navigate to character-mod without a selected character');
        return { ...prev, currentPage: 'characters' };
      }
      
      // Otherwise, update the page and clear selected character if needed
      return {
        currentPage: page,
        selectedCharacter: page === 'character-mod' ? prev.selectedCharacter : null,
      };
    });
  }, []);

  // Handle character selection
  const handleCharacterClick = useCallback((characterId: string) => {
    setNavigation({
      currentPage: 'character-mod',
      selectedCharacter: characterId,
    });
  }, []);

  // Navigate back to characters list
  const handleBackToCharacters = useCallback(() => {
    console.log('Navigating back to characters list');
    try {
      setNavigation({
        currentPage: 'characters',
        selectedCharacter: null,
      });
    } catch (error) {
      console.error('Error in handleBackToCharacters:', error);
    }
  }, []);

  // Debug effect to log navigation changes
  useEffect(() => {
    console.log('Navigation state changed:', navigation);
  }, [navigation]);

  // Render the current page with proper error boundaries
  const renderPage = () => {
    try {
      switch (navigation.currentPage) {
        case 'dashboard':
          return <DashboardPage />;
        case 'mods':
          return <OtherModsPage />;
        case 'characters':
          return <CharactersPage onCharacterClick={handleCharacterClick} />;
        case 'character-mod':
          if (navigation.selectedCharacter) {
            return (
              <CharacterModPage
                characterId={navigation.selectedCharacter}
                onBack={handleBackToCharacters}
              />
            );
          }
          // Fallback to characters page if no character is selected
          return <CharactersPage onCharacterClick={handleCharacterClick} />;
        case 'settings':
          return <SettingsPage />;
        default:
          console.warn('Unknown page, redirecting to dashboard');
          return <DashboardPage />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return (
        <div className="p-4 text-red-500">
          An error occurred while loading the page. Please try again.
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-[var(--moon-bg)]">
      <Sidebar currentPage={navigation.currentPage} onPageChange={handlePageChange} />
      <main className="flex-1 overflow-y-auto backdrop-blur-sm px-6">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
