"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-dark-300 h-16 flex items-center relative top-0 left-0 right-0 z-30 px-4 sm:px-6 border-b border-white/10 shadow-sm">
      {/* Left edge spacer to account for sidebar */}
      <div className="w-24 flex-shrink-0"></div>

      {/* JavaScript Focus Title */}
      <div className="flex-1 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#f7df1e] flex items-center justify-center text-black font-bold text-lg shadow-lg">
          JS
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">JavaScript Mastery</h1>
          <p className="text-gray-400 text-xs">Interactive Learning Platform</p>
        </div>
      </div>

      {/* Stats and user menu */}
      <div className="flex items-center space-x-3">
        {/* XP Counter */}
        <div className="flex items-center px-2.5 py-1.5 bg-dark-200 rounded-full">
          <div className="w-6 h-6 rounded-full bg-[#8e5ff5] flex items-center justify-center text-white font-bold text-xs mr-1.5">
            1
          </div>
          <span className="text-[#8e5ff5] font-bold text-sm">0</span>
        </div>

        {/* Hearts */}
        <div className="flex items-center px-2.5 py-1.5 bg-dark-200 rounded-full">
          <svg
            className="w-4 h-4 text-[#ff5e7d]"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
          <span className="text-[#ff5e7d] font-bold text-sm ml-1.5">5/5</span>
        </div>

        {/* Streak */}
        <div className="flex items-center px-2.5 py-1.5 bg-dark-200 rounded-full">
          <svg
            className="w-4 h-4 text-[#fab72b]"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
          </svg>
          <span className="text-[#fab72b] font-bold text-sm ml-1.5">0</span>
        </div>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="h-8 w-8 rounded-full bg-[#28c7f9] flex items-center justify-center text-white font-bold text-sm ring-2 ring-[#28c7f9]/30 hover:ring-[#28c7f9]/50 transition-all"
          >
            {session?.user?.name?.charAt(0) ||
              session?.user?.email?.charAt(0) ||
              "U"}
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-300 border border-white/10 rounded-xl shadow-xl z-50">
              <div className="p-3 border-b border-white/10">
                <p className="text-sm font-medium text-white">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-400">{session?.user?.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-200 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
