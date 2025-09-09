import React from "react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const navigationItems = [
    {
      id: "dashboard",
      label: "Mods",
      icon: "🎮",
    },
    {
      id: "characters",
      label: "Characters",
      icon: "👥",
    },
    {
      id: "settings",
      label: "Presets",
      icon: "📋",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
    },
  ];

  return (
    <div className="w-16 h-screen bg-gray-900/50 backdrop-blur-sm border-r border-gray-800/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800/50">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">M</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 group ${
              currentPage === item.id
                ? "bg-blue-500/20 text-blue-400"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
            }`}
            title={item.label}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-800/50">
        <div className="flex flex-col items-center space-y-2">
          <button className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <span className="text-sm">🔄</span>
          </button>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
