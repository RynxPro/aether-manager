import React from "react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      description: "Overview and stats",
    },
    {
      id: "mods",
      label: "All Mods",
      icon: "🎮",
      description: "Manage all mods",
    },
    {
      id: "characters",
      label: "Characters",
      icon: "👥",
      description: "Browse by character",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      description: "App configuration",
    },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ZZZ</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Aether Manager</h1>
            <p className="text-gray-400 text-xs">Mod Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              currentPage === item.id
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1 text-left">
              <div className="font-medium">{item.label}</div>
              <div className="text-xs opacity-75">{item.description}</div>
            </div>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-gray-400 text-xs">Zenless Zone Zero</p>
          <p className="text-gray-500 text-xs">Mod Manager v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
