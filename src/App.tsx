import { useState } from "react";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">
                  Installed Mods
                </h3>
                <p className="text-2xl font-bold text-white mt-2">0</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">
                  Active Mods
                </h3>
                <p className="text-2xl font-bold text-white mt-2">0</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">
                  Inactive Mods
                </h3>
                <p className="text-2xl font-bold text-white mt-2">0</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">Presets</h3>
                <p className="text-2xl font-bold text-white mt-2">0</p>
              </div>
            </div>
          </div>
        );
      case "mods":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">All Mods</h1>
            <p className="text-gray-400">Mod management page coming soon...</p>
          </div>
        );
      case "characters":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Characters</h1>
            <p className="text-gray-400">
              Character management page coming soon...
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
            <p className="text-gray-400">Settings page coming soon...</p>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">{renderPage()}</main>
    </div>
  );
}

export default App;
