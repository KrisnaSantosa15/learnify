"use client";

import React, { useState } from "react";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isCurrentUser: boolean;
  trend: "up" | "down" | "same";
  completedChallenges?: number;
}

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("week");

  // Mock leaderboard data
  const leaderboardData: Record<string, LeaderboardEntry[]> = {
    week: [
      {
        id: "1",
        name: "Alex Chen",
        avatar: "👨🏻‍💻",
        score: 5840,
        isCurrentUser: false,
        trend: "up",
        completedChallenges: 58,
      },
      {
        id: "2",
        name: "Sarah Johnson",
        avatar: "👩🏽‍💻",
        score: 5430,
        isCurrentUser: false,
        trend: "same",
        completedChallenges: 54,
      },
      {
        id: "3",
        name: "Jane Smith",
        avatar: "JS",
        score: 5128,
        isCurrentUser: true,
        trend: "up",
        completedChallenges: 51,
      },
    ],
    month: [
      {
        id: "1",
        name: "Sarah Johnson",
        avatar: "👩🏽‍💻",
        score: 18430,
        isCurrentUser: false,
        trend: "up",
        completedChallenges: 184,
      },
      {
        id: "2",
        name: "Alex Chen",
        avatar: "👨🏻‍💻",
        score: 16750,
        isCurrentUser: false,
        trend: "down",
        completedChallenges: 167,
      },
      {
        id: "3",
        name: "Jane Smith",
        avatar: "JS",
        score: 14320,
        isCurrentUser: true,
        trend: "same",
        completedChallenges: 143,
      },
    ],
    all: [
      {
        id: "1",
        name: "Alex Chen",
        avatar: "👨🏻‍💻",
        score: 42150,
        isCurrentUser: false,
        trend: "same",
        completedChallenges: 421,
      },
      {
        id: "2",
        name: "Sarah Johnson",
        avatar: "👩🏽‍💻",
        score: 36780,
        isCurrentUser: false,
        trend: "up",
        completedChallenges: 367,
      },
      {
        id: "3",
        name: "Jane Smith",
        avatar: "JS",
        score: 27450,
        isCurrentUser: true,
        trend: "up",
        completedChallenges: 274,
      },
    ],
  };

  const currentLeaderboard = leaderboardData[timeframe];

  const getTrendIcon = (trend: "up" | "down" | "same") => {
    switch (trend) {
      case "up":
        return (
          <div className="rounded-full bg-[#58c896]/20 p-0.5">
            <svg
              className="w-2.5 h-2.5 text-[#58c896]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </div>
        );
      case "down":
        return (
          <div className="rounded-full bg-[#ff5e7d]/20 p-0.5">
            <svg
              className="w-2.5 h-2.5 text-[#ff5e7d]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        );
      case "same":
        return (
          <div className="rounded-full bg-gray-500/20 p-0.5">
            <svg
              className="w-2.5 h-2.5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-dark-300/30 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-white flex items-center">
            <svg
              className="w-4 h-4 mr-1.5 text-[#ff5e7d]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="18" y="3" width="4" height="18" />
              <rect x="10" y="8" width="4" height="13" />
              <rect x="2" y="13" width="4" height="8" />
            </svg>
            Leaderboard
          </h2>
          <button
            className="text-xs text-[#ff5e7d] hover:text-white transition-colors"
            onClick={() => {}}
          >
            View Full
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex rounded-lg overflow-hidden border border-white/10 mb-3">
          <button
            className={`py-1.5 text-xs flex-1 ${
              timeframe === "week"
                ? "bg-[#ff5e7d] text-dark-300 font-medium"
                : "bg-dark-200 text-gray-400 hover:text-white"
            }`}
            onClick={() => setTimeframe("week")}
          >
            Weekly
          </button>
          <button
            className={`py-1.5 text-xs flex-1 ${
              timeframe === "month"
                ? "bg-[#ff5e7d] text-dark-300 font-medium"
                : "bg-dark-200 text-gray-400 hover:text-white"
            }`}
            onClick={() => setTimeframe("month")}
          >
            Monthly
          </button>
          <button
            className={`py-1.5 text-xs flex-1 ${
              timeframe === "all"
                ? "bg-[#ff5e7d] text-dark-300 font-medium"
                : "bg-dark-200 text-gray-400 hover:text-white"
            }`}
            onClick={() => setTimeframe("all")}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {currentLeaderboard.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center p-3 gap-2 ${
              index !== currentLeaderboard.length - 1
                ? "border-b border-white/5"
                : ""
            } ${
              entry.isCurrentUser ? "bg-[#ff5e7d]/10" : "hover:bg-dark-200/50"
            } transition-colors`}
          >
            <div className="font-medium w-5 text-center text-gray-400">
              {index + 1}
            </div>

            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-center ${
                entry.isCurrentUser
                  ? "bg-[#ff5e7d]/20 text-[#ff5e7d]"
                  : "bg-dark-200 text-white"
              }`}
            >
              {typeof entry.avatar === "string" && entry.avatar.length <= 2 ? (
                entry.avatar
              ) : (
                <span>{entry.avatar}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div
                className={`font-medium text-sm truncate ${
                  entry.isCurrentUser ? "text-[#ff5e7d]" : "text-white"
                }`}
              >
                {entry.name}
                {entry.isCurrentUser && (
                  <span className="text-xs ml-1">(you)</span>
                )}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {entry.completedChallenges} challenges
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <div className={`font-bold text-xs text-[#ff5e7d]`}>
                {entry.score.toLocaleString()}
              </div>
              {getTrendIcon(entry.trend)}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-dark-300/50 mt-auto">
        <div className="flex items-center justify-between">
          <div className="text-white text-xs">Your Rank:</div>
          <div className="text-[#ff5e7d] font-bold text-sm">
            {currentLeaderboard.findIndex((entry) => entry.isCurrentUser) + 1} /
            125
          </div>
        </div>
      </div>
    </div>
  );
}
