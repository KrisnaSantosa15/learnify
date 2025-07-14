"use client";

import React, { useState } from "react";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
  level: number;
  title: string;
  streak: number;
  achievements: string[];
  isCurrentUser: boolean;
  trend: "up" | "down" | "same";
  weeklyGain: number;
  country: string;
  specialBadge?: string;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedBy: number; // percentage of users who have it
}

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState<
    "global" | "friends" | "achievements"
  >("global");
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "alltime">(
    "weekly"
  );
  const [viewMode, setViewMode] = useState<"arena" | "classic">("arena");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(
    null
  );

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "Code Warrior",
      icon: "⚔️",
      description: "Completed 100 coding challenges",
      rarity: "rare",
      unlockedBy: 15,
    },
    {
      id: "2",
      name: "Speed Demon",
      icon: "🏃‍♂️",
      description: "Solved 10 challenges in under 5 minutes",
      rarity: "epic",
      unlockedBy: 5,
    },
    {
      id: "3",
      name: "Knowledge Master",
      icon: "🧠",
      description: "Perfect score on 25 quizzes",
      rarity: "legendary",
      unlockedBy: 2,
    },
    {
      id: "4",
      name: "Project Builder",
      icon: "🏗️",
      description: "Completed 15 mini projects",
      rarity: "rare",
      unlockedBy: 8,
    },
  ];

  const globalLeaderboard: LeaderboardUser[] = [
    {
      id: "1",
      name: "Alex Chen",
      avatar: "👨🏻‍💻",
      score: 15420,
      level: 42,
      title: "Code Architect",
      streak: 28,
      achievements: ["⚔️", "🏃‍♂️", "🧠"],
      isCurrentUser: false,
      trend: "up",
      weeklyGain: 450,
      country: "🇺🇸",
      specialBadge: "🏆",
    },
    {
      id: "2",
      name: "Sophia Rodriguez",
      avatar: "👩🏽‍💻",
      score: 14850,
      level: 39,
      title: "Algorithm Queen",
      streak: 35,
      achievements: ["⚔️", "🧠", "🏗️"],
      isCurrentUser: false,
      trend: "up",
      weeklyGain: 380,
      country: "🇪🇸",
    },
    {
      id: "3",
      name: "You",
      avatar: "🚀",
      score: 13920,
      level: 36,
      title: "Rising Developer",
      streak: 15,
      achievements: ["⚔️", "🏗️"],
      isCurrentUser: true,
      trend: "up",
      weeklyGain: 520,
      country: "🇮🇩",
    },
    {
      id: "4",
      name: "Marcus Johnson",
      avatar: "👨🏿‍💻",
      score: 13450,
      level: 35,
      title: "Bug Hunter",
      streak: 22,
      achievements: ["⚔️", "🏃‍♂️"],
      isCurrentUser: false,
      trend: "same",
      weeklyGain: 290,
      country: "🇬🇧",
    },
    {
      id: "5",
      name: "Yuki Tanaka",
      avatar: "👩🏻‍💻",
      score: 12980,
      level: 34,
      title: "Frontend Ninja",
      streak: 18,
      achievements: ["⚔️"],
      isCurrentUser: false,
      trend: "down",
      weeklyGain: -120,
      country: "🇯🇵",
    },
  ];

  const filteredLeaderboard = globalLeaderboard.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600";
      case "rare":
        return "from-blue-400 to-blue-600";
      case "epic":
        return "from-purple-400 to-purple-600";
      case "legendary":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-orange-500";
      case 2:
        return "from-gray-300 to-gray-500";
      case 3:
        return "from-orange-600 to-yellow-700";
      default:
        return "from-[#28c7f9] to-[#8e5ff5]";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Epic Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 animate-pulse">
            <span className="text-3xl">🏆</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            Hall of Fame
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Where legends are born and coding warriors rise to glory
          </p>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-[#28c7f9]/20 to-[#8e5ff5]/20 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#28c7f9]">2,847</div>
              <div className="text-sm text-gray-400">Active Warriors</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">156K</div>
              <div className="text-sm text-gray-400">Challenges Solved</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400">42</div>
              <div className="text-sm text-gray-400">Countries</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-400">94</div>
              <div className="text-sm text-gray-400">Achievements</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-2">
            <div className="flex space-x-2">
              {[
                {
                  id: "global",
                  name: "🌍 Global Arena",
                  desc: "World Rankings",
                },
                {
                  id: "friends",
                  name: "👥 Squad Battle",
                  desc: "Friends Only",
                },
                {
                  id: "achievements",
                  name: "🏅 Trophy Room",
                  desc: "Achievements",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as "global" | "friends" | "achievements"
                    )
                  }
                  className={`px-6 py-3 rounded-lg text-center transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="font-bold">{tab.name}</div>
                  <div className="text-xs opacity-80">{tab.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Arena Tab */}
        {activeTab === "global" && (
          <div>
            {/* Time Controls & View Mode */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-2">
                  <div className="flex space-x-1">
                    {[
                      {
                        id: "weekly",
                        name: "⚡ Weekly",
                        color: "from-green-400 to-emerald-500",
                      },
                      {
                        id: "monthly",
                        name: "🔥 Monthly",
                        color: "from-orange-400 to-red-500",
                      },
                      {
                        id: "alltime",
                        name: "👑 All Time",
                        color: "from-yellow-400 to-orange-500",
                      },
                    ].map((period) => (
                      <button
                        key={period.id}
                        onClick={() =>
                          setTimeframe(
                            period.id as "weekly" | "monthly" | "alltime"
                          )
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          timeframe === period.id
                            ? `bg-gradient-to-r ${period.color} text-dark-100 shadow-lg`
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {period.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search warriors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm w-40"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setViewMode("arena")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewMode === "arena"
                        ? "bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    🏟️ Arena View
                  </button>
                  <button
                    onClick={() => setViewMode("classic")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewMode === "classic"
                        ? "bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    📊 Classic
                  </button>
                </div>
              </div>
            </div>

            {/* Arena View */}
            {viewMode === "arena" && (
              <div className="space-y-6">
                {/* Podium for Top 3 */}
                <div className="relative">
                  <div className="flex items-end justify-center space-x-8 mb-8">
                    {/* 2nd Place */}
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-2xl mb-4 mx-auto animate-bounce">
                          {globalLeaderboard[1].avatar}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-sm font-bold text-dark-100">
                          2
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-300/20 to-gray-500/20 border border-gray-400/30 rounded-xl p-4 w-40">
                        <div className="font-bold text-white text-sm">
                          {globalLeaderboard[1].name}
                        </div>
                        <div className="text-gray-300 text-xs">
                          {globalLeaderboard[1].title}
                        </div>
                        <div className="text-gray-300 font-bold mt-2">
                          {globalLeaderboard[1].score.toLocaleString()}
                        </div>
                      </div>
                      <div className="w-32 h-20 bg-gradient-to-t from-gray-400/30 to-gray-400/10 mt-4 mx-auto rounded-t-lg"></div>
                    </div>

                    {/* 1st Place */}
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl mb-4 mx-auto animate-pulse">
                          {globalLeaderboard[0].avatar}
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-lg font-bold text-dark-100">
                          👑
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/50 rounded-xl p-6 w-44">
                        <div className="font-bold text-white">
                          {globalLeaderboard[0].name}
                        </div>
                        <div className="text-yellow-300 text-sm">
                          {globalLeaderboard[0].title}
                        </div>
                        <div className="text-yellow-300 font-bold text-lg mt-2">
                          {globalLeaderboard[0].score.toLocaleString()}
                        </div>
                        <div className="flex justify-center space-x-1 mt-2">
                          {globalLeaderboard[0].achievements.map((ach, i) => (
                            <span key={i} className="text-sm">
                              {ach}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="w-36 h-24 bg-gradient-to-t from-yellow-400/30 to-yellow-400/10 mt-4 mx-auto rounded-t-lg"></div>
                    </div>

                    {/* 3rd Place */}
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-600 to-yellow-700 flex items-center justify-center text-2xl mb-4 mx-auto animate-bounce">
                          {globalLeaderboard[2].avatar}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-600 to-yellow-700 rounded-full flex items-center justify-center text-sm font-bold text-dark-100">
                          3
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-600/20 to-yellow-700/20 border border-orange-500/30 rounded-xl p-4 w-40">
                        <div className="font-bold text-white text-sm">
                          {globalLeaderboard[2].name}
                        </div>
                        <div className="text-orange-300 text-xs">
                          {globalLeaderboard[2].title}
                        </div>
                        <div className="text-orange-300 font-bold mt-2">
                          {globalLeaderboard[2].score.toLocaleString()}
                        </div>
                      </div>
                      <div className="w-32 h-16 bg-gradient-to-t from-orange-400/30 to-orange-400/10 mt-4 mx-auto rounded-t-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Rest of leaderboard */}
                <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">
                      Rising Champions
                    </h3>
                    <p className="text-gray-400">Climbing the ranks</p>
                  </div>
                  <div className="divide-y divide-white/5">
                    {filteredLeaderboard.slice(3).map((user, index) => (
                      <div
                        key={user.id}
                        className={`p-6 hover:bg-white/5 transition-colors cursor-pointer ${
                          user.isCurrentUser
                            ? "bg-gradient-to-r from-[#28c7f9]/10 to-[#8e5ff5]/10"
                            : ""
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(
                              index + 4
                            )} flex items-center justify-center text-sm font-bold text-dark-100`}
                          >
                            {index + 4}
                          </div>

                          <div className="w-12 h-12 rounded-full bg-dark-300 flex items-center justify-center text-lg hover:scale-110 transition-transform">
                            {user.avatar}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white">
                                {user.name}
                              </span>
                              {user.isCurrentUser && (
                                <span className="px-2 py-1 bg-[#28c7f9] text-dark-100 text-xs rounded-full font-bold">
                                  YOU
                                </span>
                              )}
                              <span className="text-sm">{user.country}</span>
                              {user.specialBadge && (
                                <span className="text-lg">
                                  {user.specialBadge}
                                </span>
                              )}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {user.title} • Level {user.level} • 🔥{" "}
                              {user.streak} day streak
                            </div>
                            <div className="flex space-x-1 mt-1">
                              {user.achievements.map((ach, i) => (
                                <span key={i} className="text-sm">
                                  {ach}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-[#28c7f9] text-lg">
                              {user.score.toLocaleString()}
                            </div>
                            <div
                              className={`text-sm flex items-center justify-end ${
                                user.trend === "up"
                                  ? "text-green-400"
                                  : user.trend === "down"
                                  ? "text-red-400"
                                  : "text-gray-400"
                              }`}
                            >
                              {user.trend === "up"
                                ? "↗️"
                                : user.trend === "down"
                                ? "↘️"
                                : "➡️"}
                              {user.weeklyGain > 0 ? "+" : ""}
                              {user.weeklyGain}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Classic View */}
            {viewMode === "classic" && (
              <div className="space-y-6">
                <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">
                      🏆 Global Rankings
                    </h3>
                    <p className="text-gray-400">Traditional leaderboard view</p>
                  </div>
                  
                  <div className="divide-y divide-white/5">
                    {filteredLeaderboard.map((user, index) => (
                      <div
                        key={user.id}
                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                          user.isCurrentUser
                            ? "bg-gradient-to-r from-[#28c7f9]/10 to-[#8e5ff5]/10 border-l-4 border-[#28c7f9]"
                            : ""
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-center space-x-4">
                          {/* Rank */}
                          <div className={`min-w-[60px] text-center`}>
                            {index < 3 ? (
                              <div className={`text-2xl ${
                                index === 0 ? "text-yellow-400" : 
                                index === 1 ? "text-gray-300" : 
                                "text-orange-400"
                              }`}>
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold text-white mx-auto">
                                {index + 1}
                              </div>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-dark-300 flex items-center justify-center text-lg hover:scale-110 transition-transform">
                            {user.avatar}
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-bold text-white truncate">
                                {user.name}
                              </span>
                              {user.isCurrentUser && (
                                <span className="px-2 py-1 bg-[#28c7f9] text-dark-100 text-xs rounded-full font-bold">
                                  YOU
                                </span>
                              )}
                              <span className="text-sm">{user.country}</span>
                              {user.specialBadge && (
                                <span className="text-lg">{user.specialBadge}</span>
                              )}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {user.title} • Level {user.level}
                            </div>
                          </div>

                          {/* Score */}
                          <div className="text-right min-w-[100px]">
                            <div className="font-bold text-white text-lg">
                              {user.score.toLocaleString()}
                            </div>
                            <div className="text-gray-400 text-sm">points</div>
                          </div>

                          {/* Trend */}
                          <div className="text-right min-w-[80px]">
                            <div className={`text-sm font-medium ${
                              user.trend === "up"
                                ? "text-green-400"
                                : user.trend === "down"
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}>
                              {user.trend === "up"
                                ? "↗️"
                                : user.trend === "down"
                                ? "↘️"
                                : "➡️"}
                              {user.weeklyGain > 0 ? "+" : ""}
                              {user.weeklyGain}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {timeframe}
                            </div>
                          </div>

                          {/* Streak */}
                          <div className="text-right min-w-[60px]">
                            <div className="text-orange-400 font-bold">
                              🔥 {user.streak}
                            </div>
                            <div className="text-gray-500 text-xs">streak</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Classic View Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {filteredLeaderboard.length.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Total Competitors</div>
                  </div>
                  
                  <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {Math.max(...filteredLeaderboard.map(u => u.score)).toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Highest Score</div>
                  </div>
                  
                  <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-2">🔥</div>
                    <div className="text-2xl font-bold text-orange-400 mb-1">
                      {Math.max(...filteredLeaderboard.map(u => u.streak))}
                    </div>
                    <div className="text-gray-400 text-sm">Longest Streak</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Friends Squad Battle Tab */}
        {activeTab === "friends" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Squad Battle Arena
              </h2>
              <p className="text-gray-400 mb-8">
                Compete with your coding buddies
              </p>
            </div>

            {/* Add Friends Section */}
            <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                Build Your Squad
              </h3>
              <p className="text-gray-400 mb-6">
                Connect with fellow developers and compete in friendly coding
                battles
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white font-bold hover:scale-105 transition-transform">
                  🔗 Connect GitHub
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white font-bold hover:scale-105 transition-transform">
                  📧 Invite by Email
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white font-bold hover:scale-105 transition-transform">
                  🎯 Find Teammates
                </button>
              </div>

              <div className="text-sm text-gray-500">
                💡 Tip: Friends who code together, grow together!
              </div>
            </div>

            {/* Sample Friend List (empty state) */}
            <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏜️</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No Squad Members Yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Your friend list is looking pretty lonely. Time to recruit
                  some coding warriors!
                </p>
                <button className="px-8 py-4 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-xl text-white font-bold hover:scale-105 transition-transform">
                  Invite Your First Friend
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                🏅 Trophy Collection
              </h2>
              <p className="text-gray-400">
                Showcase your coding accomplishments
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`bg-gradient-to-br ${getRarityColor(
                    achievement.rarity
                  )} p-0.5 rounded-xl`}
                >
                  <div className="bg-dark-200/90 backdrop-blur-sm rounded-xl p-6 h-full">
                    <div className="text-center">
                      <div className="text-4xl mb-4">{achievement.icon}</div>
                      <h3 className="font-bold text-white mb-2">
                        {achievement.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {achievement.description}
                      </p>

                      <div
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${getRarityColor(
                          achievement.rarity
                        )} text-dark-100`}
                      >
                        {achievement.rarity.toUpperCase()}
                      </div>

                      <div className="text-xs text-gray-500">
                        Unlocked by {achievement.unlockedBy}% of users
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-200/90 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-dark-300 flex items-center justify-center text-3xl mx-auto mb-4">
                {selectedUser.avatar}
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedUser.name}
              </h3>
              <p className="text-gray-400 mb-4">{selectedUser.title}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-dark-300/40 rounded-lg p-3">
                  <div className="text-lg font-bold text-[#28c7f9]">
                    {selectedUser.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Total Score</div>
                </div>
                <div className="bg-dark-300/40 rounded-lg p-3">
                  <div className="text-lg font-bold text-[#8e5ff5]">
                    Level {selectedUser.level}
                  </div>
                  <div className="text-xs text-gray-400">Experience</div>
                </div>
                <div className="bg-dark-300/40 rounded-lg p-3">
                  <div className="text-lg font-bold text-yellow-400">
                    {selectedUser.streak}
                  </div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
                <div className="bg-dark-300/40 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-400">
                    {selectedUser.achievements.length}
                  </div>
                  <div className="text-xs text-gray-400">Achievements</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-white mb-2">
                  Achievements
                </h4>
                <div className="flex justify-center space-x-2">
                  {selectedUser.achievements.map((ach, i) => (
                    <span key={i} className="text-2xl">
                      {ach}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-lg text-white font-bold hover:scale-105 transition-transform">
                  Challenge
                </button>
                <button className="flex-1 px-4 py-2 bg-dark-300 hover:bg-dark-200 rounded-lg text-white font-bold transition-colors">
                  Add Friend
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-dark-300 hover:bg-dark-200 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
