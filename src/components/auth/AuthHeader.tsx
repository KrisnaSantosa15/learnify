"use client";

import Link from "next/link";

export default function AuthHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a111f]/80 backdrop-blur-sm border-b border-white/5">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#28c7f9] to-[#58c896] flex items-center justify-center shadow-lg shadow-[#58c896]/20 group-hover:scale-105 transition-transform">
            <svg
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <span className="text-xl font-bold text-white">Lernify</span>
        </Link>

        {/* Back to Home Link */}
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-[#28c7f9] transition-colors flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>
    </header>
  );
}
