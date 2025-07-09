"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function DashboardSidebar({ activePage, setActivePage }: DashboardSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simplified menu items - Duolingo style
  const menuItems = [
    { id: 'learn', label: 'LEARN', icon: 'home', primary: true },
    { id: 'practice', label: 'PRACTICE', icon: 'zap' },
    { id: 'leaderboards', label: 'LEADERBOARDS', icon: 'trophy' },
    { id: 'quests', label: 'QUESTS', icon: 'star' },
    { id: 'shop', label: 'SHOP', icon: 'shopping-bag' },
    { id: 'profile', label: 'PROFILE', icon: 'user' },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'home':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        );
      case 'zap':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9z" />
          </svg>
        );
      case 'trophy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M5 5V16H19V5H5ZM20 5V16H21V19H3V16H4V5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5ZM8 10C8 9.44772 8.44772 9 9 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H9C8.44772 11 8 10.5523 8 10ZM8 14C8 13.4477 8.44772 13 9 13H15C15.5523 13 16 13.4477 16 14C16 14.5523 15.5523 15 15 15H9C8.44772 15 8 14.5523 8 14ZM9 5C8.44772 5 8 5.44772 8 6C8 6.55228 8.44772 7 9 7H15C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5H9Z" />
          </svg>
        );
      case 'star':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'shopping-bag':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'user':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" stroke="none">
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
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-dark-200"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Sidebar - Duolingo style */}
      <aside 
        className={`
          fixed top-0 left-0 z-40 w-24 h-screen 
          bg-dark-300 border-r border-white/10 transition-transform 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-24">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#28c7f9] to-[#58c896] flex items-center justify-center shadow-lg shadow-[#58c896]/20">
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </div>
        
        {/* Menu items - styled like Duolingo */}
        <nav className="flex flex-col items-center space-y-4 mt-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`
                w-16 h-16 flex flex-col items-center justify-center rounded-xl transition-colors
                ${activePage === item.id 
                  ? item.primary 
                    ? 'bg-[#28c7f9] text-white' 
                    : 'bg-[#8e5ff5]/20 text-[#8e5ff5]' 
                  : 'text-gray-400 hover:text-white hover:bg-dark-200'}
              `}
            >
              <span className="mb-1">
                {renderIcon(item.icon)}
              </span>
              <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}