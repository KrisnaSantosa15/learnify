"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface DashboardSidebarProps {
  activePage?: string;
  setActivePage?: (page: string) => void;
}

export default function DashboardSidebar({
  activePage,
  setActivePage,
}: DashboardSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (pageId: string) => {
    // For backward compatibility with parent components
    if (setActivePage) {
      setActivePage(pageId);
    }

    // Navigate to the appropriate route
    const routes: Record<string, string> = {
      learn: "/dashboard",
      practice: "/dashboard/practice",
      leaderboards: "/dashboard/leaderboards",
      shop: "/dashboard/shop",
      profile: "/dashboard/profile",
    };

    router.push(routes[pageId] || "/dashboard");
  };

  // Determine active page from pathname
  const getActivePageFromPath = () => {
    if (pathname === "/dashboard") return "learn";
    const pathSegments = pathname.split("/");
    return pathSegments[pathSegments.length - 1] || "learn";
  };

  const currentActivePage = activePage || getActivePageFromPath();

  // Simplified menu items with unified design
  const menuItems = [
    { id: "learn", label: "LEARN", icon: "home" },
    { id: "practice", label: "PRACTICE", icon: "zap" },
    { id: "leaderboards", label: "LEADERBOARDS", icon: "trophy" },
    { id: "shop", label: "SHOP", icon: "shopping-bag" },
    { id: "profile", label: "PROFILE", icon: "user" },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "home":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        );
      case "zap":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9z" />
          </svg>
        );
      case "trophy":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M5 5V16H19V5H5ZM20 5V16H21V19H3V16H4V5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5ZM8 10C8 9.44772 8.44772 9 9 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H9C8.44772 11 8 10.5523 8 10ZM8 14C8 13.4477 8.44772 13 9 13H15C15.5523 13 16 13.4477 16 14C16 14.5523 15.5523 15 15 15H9C8.44772 15 8 14.5523 8 14ZM9 5C8.44772 5 8 5.44772 8 6C8 6.55228 8.44772 7 9 7H15C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5H9Z" />
          </svg>
        );
      case "star":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case "shopping-bag":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v12z" />
          </svg>
        );
      case "user":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      {/* Mobile toggle with enhanced design */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 rounded-xl bg-gradient-to-br from-dark-300/90 to-dark-200/90 backdrop-blur-sm border border-white/10 text-white hover:scale-105 transition-all duration-200 shadow-lg sidebar-glow"
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="gradient-text"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="gradient-text"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Duolingo style */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-24 h-screen 
          bg-dark-300 border-r border-white/10 transition-transform 
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16">
          <Link
            href="/"
            className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#28c7f9] to-[#58c896] flex items-center justify-center shadow-lg shadow-[#58c896]/20 hover:scale-105 transition-transform"
          >
            <svg
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </Link>
        </div>

        {/* Menu items - unified creative design with gradient active states */}
        <nav className="flex flex-col items-center space-y-3 mt-4 px-2">
          {menuItems.map((item) => {
            const isActive = currentActivePage === item.id;

            return (
              <div key={item.id} className="relative group">
                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#28c7f9] to-[#8e5ff5] rounded-full shadow-lg shadow-[#28c7f9]/50 animate-pulse" />
                )}

                <button
                  onClick={() => handlePageChange(item.id)}
                  className={`
                    relative w-16 h-16 flex flex-col items-center justify-center rounded-2xl 
                    transition-all duration-300 group-hover:scale-105 border-2
                    ${
                      isActive
                        ? "bg-gradient-to-br from-[#28c7f9]/15 to-[#8e5ff5]/15 border-[#28c7f9]/40 sidebar-glow"
                        : "text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-gray-700/30 hover:to-gray-600/30 border-transparent hover:border-gray-600/30"
                    }
                  `}
                >
                  {/* Icon with gradient overlay for active state */}
                  <div
                    className={`
                    relative mb-1 transition-all duration-300
                    ${isActive ? "gradient-text" : ""}
                  `}
                  >
                    {/* Background glow for active icons */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#28c7f9]/30 to-[#8e5ff5]/30 blur-sm rounded-full scale-150" />
                    )}
                    <span className="relative z-10">
                      {renderIcon(item.icon)}
                    </span>
                  </div>

                  <span
                    className={`
                    text-[9px] font-bold tracking-wider transition-all duration-300
                    ${isActive ? "gradient-text" : ""}
                  `}
                  >
                    {item.label}
                  </span>

                  {/* Animated background particles for active state */}
                  {isActive && (
                    <>
                      <div className="absolute top-2 right-2 w-1 h-1 bg-[#28c7f9] rounded-full animate-ping opacity-75" />
                      <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#8e5ff5] rounded-full animate-ping-delayed opacity-75" />
                    </>
                  )}
                </button>

                {/* Tooltip for better UX */}
                <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-dark-100 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl border border-white/10 z-50">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-dark-100 rotate-45 border-l border-b border-white/10" />
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
