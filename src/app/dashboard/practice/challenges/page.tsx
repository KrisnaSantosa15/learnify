"use client";

import React from "react";
import { useRouter } from "next/navigation";
import CodeChallenges from "@/components/dashboard/practice/CodeChallenges";

export default function ChallengePage() {
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] bg-clip-text text-transparent">
                  💻 Code Challenge Arena
                </h1>
                <p className="text-gray-400 text-sm">
                  Solve coding problems and master algorithms
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Live Session</span>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-lg text-white font-medium hover:scale-105 transition-transform">
                New Challenge
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <CodeChallenges selectedCategory="All" selectedDifficulty="All" />
        </div>
      </div>
    </div>
  );
}
