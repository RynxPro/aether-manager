import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";

// Import the PageType from App.tsx to ensure consistency
type PageType = 'dashboard' | 'mods' | 'characters' | 'character-mod' | 'settings';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const navigationItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: <HomeIcon className="w-5 h-5" />,
      path: "/",
    },
    {
      id: "characters" as const,
      label: "Characters",
      icon: <UsersIcon className="w-5 h-5" />,
      path: "/characters",
    },
    {
      id: "mods" as const,
      label: "Other Mods",
      icon: <Square3Stack3DIcon className="w-5 h-5" />,
      path: "/mods",
    },
    {
      id: "settings" as const,
      label: "Settings",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      path: "/settings",
    },
  ];

  const handleNavigation = (item: (typeof navigationItems)[number]) => {
    try {
      // Only change page if it's different from current
      if (item.id !== currentPage) {
        console.log(`Navigating to: ${item.id}`);
        onPageChange(item.id);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <>
      <div
        className={`fixed md:relative h-screen bg-[var(--moon-surface)] backdrop-blur-sm border-r border-[var(--moon-border)] flex flex-col transition-all duration-300 ease-in-out z-50 w-64 shadow-lg left-0`}
      >
        {/* Header */}
        <div
          className={`border-b border-[var(--moon-border)] p-4 transition-all duration-300`}
        >
          <div className={`flex items-center justify-between`}>
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--moon-accent)] to-[var(--moon-glow-violet)] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div className="overflow-hidden">
                <h1 className="text-[var(--moon-text)] font-bold text-base whitespace-nowrap">
                  Aether Manager
                </h1>
                <p className="text-[var(--moon-muted)]/80 text-xs whitespace-nowrap">
                  v1.0.0
                </p>
              </div>
            </div>

            {/* Close Button (Mobile) */}
            {isMobile && (
              <button
                className="md:hidden p-1.5 rounded-full text-[var(--moon-muted)] hover:text-[var(--moon-text)] hover:bg-[var(--moon-surface-hover)] transition-colors duration-200"
                aria-label="Close sidebar"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id} className="relative">
                <button
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center px-4 py-3 gap-3 rounded-xl text-sm font-medium transition-all duration-200 group/nav-item ${
                    currentPage === item.id
                      ? "bg-[var(--moon-accent)]/10 text-[var(--moon-accent)] font-semibold border border-[var(--moon-glow-violet)]/30"
                      : "text-[var(--moon-muted)] hover:bg-[var(--moon-surface-hover)] hover:text-[var(--moon-text)] border border-transparent"
                  } hover:border-[var(--moon-glow-violet)]/50 hover:shadow-[0_0_8px_var(--moon-glow-violet)/20]`}
                  title={item.label}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      currentPage === item.id
                        ? "bg-[var(--moon-accent)]/20"
                        : "bg-[var(--moon-bg)]"
                    } group-hover/nav-item:bg-[var(--moon-accent)]/20 transition-all duration-200`}
                  >
                    {React.cloneElement(item.icon, {
                      className: `w-4 h-4 ${
                        currentPage === item.id
                          ? "text-[var(--moon-accent)]"
                          : "text-[var(--moon-muted)]"
                      } group-hover/nav-item:text-[var(--moon-accent)]`,
                    })}
                  </div>
                  <span className="transition-opacity duration-200">
                    {item.label}
                  </span>
                  {currentPage === item.id && (
                    <div className="absolute right-4 h-3 w-1.5 rounded-md bg-[var(--moon-accent)]"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Removed account section */}
      </div>
    </>
  );
};

export default Sidebar;
