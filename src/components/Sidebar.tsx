import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
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
      id: "dashboard",
      label: "Mods",
      icon: <HomeIcon className="w-5 h-5" />,
      path: "/",
    },
    {
      id: "characters",
      label: "Characters",
      icon: <UsersIcon className="w-5 h-5" />,
      path: "/characters",
    },
    {
      id: "presets",
      label: "Presets",
      icon: <DocumentTextIcon className="w-5 h-5" />,
      path: "/presets",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      path: "/settings",
    },
  ];

  const handleNavigation = (item: (typeof navigationItems)[0]) => {
    onPageChange(item.id);
  };

  return (
    <>
      <div
        className={`fixed md:relative h-screen bg-[var(--moon-surface-elevated)] border-r border-[var(--moon-border)] flex flex-col transition-all duration-300 ease-in-out z-50 w-64 shadow-lg left-0`}
      >
        {/* Header */}
        <div
          className={`border-b border-[var(--moon-border)] p-4 transition-all duration-300`}
        >
          <div className={`flex items-center justify-between`}>
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 bg-[var(--moon-accent)] rounded-full flex items-center justify-center flex-shrink-0">
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
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.id} className="relative">
                <button
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center px-4 py-3 gap-3 rounded-md text-sm font-medium transition-all duration-200 group/nav-item ${
                    currentPage === item.id
                      ? "bg-[var(--moon-accent)]/10 text-[var(--moon-accent)] font-semibold"
                      : "text-[var(--moon-muted)] hover:bg-[var(--moon-surface)]/60 hover:text-[var(--moon-text)]"
                  }`}
                  title={item.label}
                >
                  <div
                    className={`p-1.5 rounded-md ${
                      currentPage === item.id
                        ? "bg-[var(--moon-accent)]/20"
                        : "bg-[var(--moon-surface-elevated)]"
                    } group-hover/nav-item:bg-[var(--moon-accent)]/20 transition-colors`}
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

        {/* Footer */}
        <div className={`border-t border-[var(--moon-border)] p-4 mt-auto`}>
          <div className={`flex items-center justify-between`}>
            <div className="flex items-center overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[var(--moon-accent)]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--moon-accent)] text-sm font-medium">
                  U
                </span>
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold text-[var(--moon-text)] whitespace-nowrap">
                  User
                </p>
                <p className="text-xs italic text-[var(--moon-muted)] whitespace-nowrap">
                  Free Plan
                </p>
              </div>
            </div>
            <button className="text-[var(--moon-muted)] hover:text-[var(--moon-text)] transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
