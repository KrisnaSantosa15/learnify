"use client";

import React, { useState } from "react";

interface Quest {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  xpReward: number;
  coinReward: number;
  requirements: string[];
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  timeLimit?: string;
}

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<
    "daily" | "weekly" | "achievements"
  >("daily");

  const dailyQuests: Quest[] = [
    {
      id: 1,
      title: "Complete 3 Coding Challenges",
      description: "Solve 3 programming challenges to sharpen your skills",
      difficulty: "Easy",
      category: "Practice",
      xpReward: 100,
      coinReward: 50,
      requirements: ["Complete any coding challenge"],
      progress: 1,
      maxProgress: 3,
      isCompleted: false,
    },
    {
      id: 2,
      title: "Spend 30 Minutes Learning",
      description: "Dedicate 30 minutes to learning new concepts",
      difficulty: "Easy",
      category: "Study",
      xpReward: 75,
      coinReward: 25,
      requirements: ["Study for 30 minutes"],
      progress: 15,
      maxProgress: 30,
      isCompleted: false,
      timeLimit: "24 hours",
    },
    {
      id: 3,
      title: "Use a Hint Wisely",
      description: "Complete a challenge while using only 1 hint",
      difficulty: "Medium",
      category: "Strategy",
      xpReward: 150,
      coinReward: 75,
      requirements: ["Complete challenge with 1 hint or less"],
      progress: 0,
      maxProgress: 1,
      isCompleted: false,
    },
  ];

  const weeklyQuests: Quest[] = [
    {
      id: 4,
      title: "Master a New Language",
      description:
        "Complete 5 projects in a programming language you haven't used",
      difficulty: "Hard",
      category: "Learning",
      xpReward: 500,
      coinReward: 250,
      requirements: ["Complete 5 projects in new language"],
      progress: 2,
      maxProgress: 5,
      isCompleted: false,
      timeLimit: "7 days",
    },
    {
      id: 5,
      title: "Speed Demon",
      description: "Complete 10 speed coding challenges with perfect scores",
      difficulty: "Hard",
      category: "Speed",
      xpReward: 750,
      coinReward: 400,
      requirements: ["Perfect score on speed challenges"],
      progress: 3,
      maxProgress: 10,
      isCompleted: false,
      timeLimit: "7 days",
    },
  ];

  const achievements: Quest[] = [
    {
      id: 6,
      title: "First Steps",
      description: "Complete your first coding challenge",
      difficulty: "Easy",
      category: "Milestone",
      xpReward: 200,
      coinReward: 100,
      requirements: ["Complete 1 challenge"],
      progress: 1,
      maxProgress: 1,
      isCompleted: true,
    },
    {
      id: 7,
      title: "Code Master",
      description: "Complete 100 coding challenges",
      difficulty: "Hard",
      category: "Milestone",
      xpReward: 2000,
      coinReward: 1000,
      requirements: ["Complete 100 challenges"],
      progress: 23,
      maxProgress: 100,
      isCompleted: false,
    },
  ];

  const getCurrentQuests = () => {
    switch (activeTab) {
      case "daily":
        return dailyQuests;
      case "weekly":
        return weeklyQuests;
      case "achievements":
        return achievements;
      default:
        return dailyQuests;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-400/10";
      case "Medium":
        return "text-yellow-400 bg-yellow-400/10";
      case "Hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getProgressPercentage = (progress: number, maxProgress: number) => {
    return Math.min((progress / maxProgress) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Quests & Achievements
        </h1>
        <p className="text-gray-400">
          Complete quests to earn XP, coins, and unlock new features!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚡</div>
            <div>
              <div className="text-2xl font-bold text-[#28c7f9]">2,450</div>
              <div className="text-sm text-gray-400">Total XP</div>
            </div>
          </div>
        </div>

        <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🪙</div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">1,250</div>
              <div className="text-sm text-gray-400">Coins</div>
            </div>
          </div>
        </div>

        <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🏆</div>
            <div>
              <div className="text-2xl font-bold text-[#8e5ff5]">12</div>
              <div className="text-sm text-gray-400">Achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="flex border-b border-white/10">
          {[
            { key: "daily" as const, label: "Daily Quests", icon: "📅" },
            { key: "weekly" as const, label: "Weekly Challenges", icon: "📊" },
            { key: "achievements" as const, label: "Achievements", icon: "🏆" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[#28c7f9]/20 text-[#28c7f9] border-b-2 border-[#28c7f9]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quest Content */}
        <div className="p-6">
          <div className="grid gap-4">
            {getCurrentQuests().map((quest) => (
              <div
                key={quest.id}
                className={`bg-dark-300/40 border rounded-xl p-6 transition-colors ${
                  quest.isCompleted
                    ? "border-green-400/30 bg-green-400/5"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {quest.title}
                      </h3>
                      {quest.isCompleted && (
                        <span className="text-green-400 text-xl">✅</span>
                      )}
                    </div>
                    <p className="text-gray-400 mb-3">{quest.description}</p>

                    <div className="flex items-center space-x-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${getDifficultyColor(
                          quest.difficulty
                        )}`}
                      >
                        {quest.difficulty}
                      </span>
                      <span className="text-gray-400">{quest.category}</span>
                      {quest.timeLimit && (
                        <span className="text-orange-400">
                          ⏰ {quest.timeLimit}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#28c7f9]">
                          +{quest.xpReward}
                        </div>
                        <div className="text-xs text-gray-400">XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">
                          +{quest.coinReward}
                        </div>
                        <div className="text-xs text-gray-400">Coins</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-white">
                      {quest.progress}/{quest.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-dark-400 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${getProgressPercentage(
                          quest.progress,
                          quest.maxProgress
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <div className="text-sm text-gray-400 mb-2">
                    Requirements:
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {quest.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-300">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
