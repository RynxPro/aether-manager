import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import OtherModsPage from "./pages/OtherModsPage";
import CharactersPage from "./pages/CharactersPage";
import CharacterModPage from "./pages/CharacterModPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedCharacter(null);
  };

  const handleCharacterClick = (characterId: string) => {
    setSelectedCharacter(characterId);
    setCurrentPage("character-mod");
  };

  const handleBackToCharacters = () => {
    setSelectedCharacter(null);
    setCurrentPage("characters");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "mods":
        return <OtherModsPage />;
      case "characters":
        return <CharactersPage onCharacterClick={handleCharacterClick} />;
      case "character-mod":
        return selectedCharacter ? (
          <CharacterModPage
            characterId={selectedCharacter}
            onBack={handleBackToCharacters}
          />
        ) : (
          <CharactersPage onCharacterClick={handleCharacterClick} />
        );
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
      <main className="flex-1 overflow-y-auto backdrop-blur-sm">{renderPage()}</main>
    </div>
  );
}

export default App;
