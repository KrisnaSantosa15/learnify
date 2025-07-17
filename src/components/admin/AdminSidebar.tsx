"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdQuiz,
  MdPeople,
  MdAnalytics,
  MdEmojiEvents,
  MdSettings,
  MdLogout,
  MdSchool,
  MdCategory,
} from "react-icons/md";

const sidebarItems = [
  {
    icon: MdDashboard,
    label: "Overview",
    href: "/admin",
  },
  {
    icon: MdQuiz,
    label: "Quiz Management",
    href: "/admin/quizzes",
  },
  {
    icon: MdCategory,
    label: "Category Management",
    href: "/admin/categories",
  },
  {
    icon: MdPeople,
    label: "User Management",
    href: "/admin/users",
  },
  {
    icon: MdAnalytics,
    label: "Analytics",
    href: "/admin/analytics",
  },
  {
    icon: MdEmojiEvents,
    label: "Achievements",
    href: "/admin/achievements",
  },
  {
    icon: MdSettings,
    label: "Settings",
    href: "/admin/settings",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo/Brand */}
      <div className="flex items-center px-6 py-4 border-b border-gray-700">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
          <MdSchool className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Learnify</h1>
          <p className="text-xs text-gray-400">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname === "/admin" && item.label === "Overview");

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="mr-3 text-lg" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-medium">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <button className="text-gray-400 hover:text-white">
            <MdLogout className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
