"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SpeedCoding from "@/components/dashboard/practice/SpeedCoding";

export default function SpeedCodingPage() {
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff6b9d] to-[#feca57] bg-clip-text text-transparent">
                  ⚡ Speed Coding Challenge
                </h1>
                <p className="text-gray-400 text-sm">
                  Race against time for bonus XP
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#28c7f9]">05:30</div>
                <div className="text-xs text-gray-400">Time Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#8e5ff5]">x2.5</div>
                <div className="text-xs text-gray-400">XP Multiplier</div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span>Speed Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <SpeedCoding />
        </div>
      </div>
    </div>
  );
}
