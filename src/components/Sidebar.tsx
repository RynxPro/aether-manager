import React, { useState } from "react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const [expanded, setExpanded] = useState(false);

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
      id: "presets",
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
    <div
      className={`${expanded ? "w-64" : "w-16"} h-screen bg-gray-900/50 backdrop-blur-sm border-r border-gray-800/50 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className={`border-b border-gray-800/50 ${expanded ? "p-4" : "p-4"}`}>
        <div className={`flex items-center ${expanded ? "justify-between" : "justify-center"}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            {expanded && (
              <div>
                <h1 className="text-white font-semibold text-sm">MoonLight</h1>
                <p className="text-gray-400 text-xs">Manager</p>
              </div>
            )}
          </div>

          {/* Toggle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className={`text-gray-400 hover:text-white transition-colors ${expanded ? "" : "absolute left-4"}`}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`${expanded ? "p-4" : "p-2"} flex-1 space-y-1`}>
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full rounded-lg transition-all duration-200 group flex ${
              expanded ? "items-center px-3 py-2" : "flex-col items-center justify-center p-3"
            } ${
              currentPage === item.id
                ? "bg-blue-500/20 text-blue-400"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
            }`}
            title={item.label}
          >
            <span className={`${expanded ? "text-lg mr-3" : "text-lg mb-1"}`}>{item.icon}</span>
            <span className={`${expanded ? "text-sm font-medium" : "text-xs font-medium"}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className={`${expanded ? "p-4" : "p-2"} border-t border-gray-800/50`}>
        <div className={`flex ${expanded ? "items-center justify-between" : "flex-col items-center space-y-2"}`}>
          <button className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <span className="text-sm">🔄</span>
          </button>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {expanded && <span>Connected</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
