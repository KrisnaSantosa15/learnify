"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MiniProjects from "@/components/dashboard/practice/MiniProjects";

export default function ProjectsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200">
      {/* Header */}
      <div className="bg-dark-200/60 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
              >
                <span>←</span>
                <span>Back to Practice</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#feca57] to-[#48dbfb] bg-clip-text text-transparent">
                  🚀 Mini Projects
                </h1>
                <p className="text-gray-400 text-sm">
                  Build real applications step by step
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold text-[#feca57]">3</div>
                <div className="text-xs text-gray-400">Available</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#48dbfb]">
                  Portfolio
                </div>
                <div className="text-xs text-gray-400">Building</div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span>Project Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <MiniProjects />
      </div>
    </div>
  );
}
