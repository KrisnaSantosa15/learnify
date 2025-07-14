"use client";

import React, { useState } from "react";
import CodeChallenges from "@/components/dashboard/practice/CodeChallenges";
import KnowledgeQuiz from "@/components/dashboard/practice/KnowledgeQuiz";
import SpeedCoding from "@/components/dashboard/practice/SpeedCoding";
import MiniProjects from "@/components/dashboard/practice/MiniProjects";

export default function PracticePage() {
  const [activeMode, setActiveMode] = useState("challenges");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const modes = [
    {
      id: "challenges",
      name: "Code Challenges",
      icon: "💻",
      description: "Solve coding problems step by step",
      color: "from-[#28c7f9] to-[#8e5ff5]",
    },
    {
      id: "quiz",
      name: "Knowledge Quiz",
      icon: "🧠",
      description: "Test your theoretical understanding",
      color: "from-[#8e5ff5] to-[#ff6b9d]",
    },
    {
      id: "speedrun",
      name: "Speed Coding",
      icon: "⚡",
      description: "Race against time for bonus XP",
      color: "from-[#ff6b9d] to-[#feca57]",
    },
    {
      id: "projects",
      name: "Mini Projects",
      icon: "🚀",
      description: "Build real applications",
      color: "from-[#feca57] to-[#48dbfb]",
    },
  ];

  const categories = [
    "All",
    "JavaScript",
    "React",
    "Python",
    "Data Structures",
    "Algorithms",
  ];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#28c7f9] via-[#8e5ff5] to-[#ff6b9d] bg-clip-text text-transparent mb-4">
            Practice Arena
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Sharpen your coding skills with interactive challenges and projects
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                activeMode === mode.id
                  ? "border-white/30 bg-gradient-to-br " +
                    mode.color +
                    " shadow-2xl"
                  : "border-white/10 bg-dark-200/60 backdrop-blur-sm hover:border-white/20"
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{mode.icon}</div>
                <h3
                  className={`text-lg font-bold mb-2 ${
                    activeMode === mode.id ? "text-white" : "text-gray-200"
                  }`}
                >
                  {mode.name}
                </h3>
                <p
                  className={`text-sm ${
                    activeMode === mode.id ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  {mode.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Filters (only show for challenges and quiz modes) */}
        {(activeMode === "challenges" || activeMode === "quiz") && (
          <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-dark-300/60 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c7f9]/50"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-dark-300/60 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c7f9]/50"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="mb-8">
          {/* Coding Challenges Mode */}
          {activeMode === "challenges" && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 flex items-center">
                      <span className="mr-3">💻</span>
                      Code Challenge Arena
                    </h3>
                    <p className="text-gray-400">
                      Solve coding problems and master algorithms
                    </p>
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
                <CodeChallenges
                  selectedCategory={selectedCategory}
                  selectedDifficulty={selectedDifficulty}
                />
              </div>
            </div>
          )}

          {/* Knowledge Quiz Mode */}
          {activeMode === "quiz" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">
                    Knowledge Quiz Mode
                  </h3>
                  <p className="text-gray-400">
                    Test your theoretical understanding
                  </p>
                </div>
                <KnowledgeQuiz />
              </div>
            </div>
          )}

          {/* Speed Coding Mode */}
          {activeMode === "speedrun" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 flex items-center justify-center">
                    <span className="mr-2">⚡</span>
                    Speed Coding Challenge
                  </h3>
                  <p className="text-gray-400">
                    Race against time to solve problems quickly
                  </p>
                  <div className="mt-4 flex items-center justify-center space-x-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#28c7f9]">
                        05:30
                      </div>
                      <div className="text-xs text-gray-400">
                        Time Remaining
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#8e5ff5]">
                        x2.5
                      </div>
                      <div className="text-xs text-gray-400">XP Multiplier</div>
                    </div>
                  </div>
                </div>
                <SpeedCoding />
              </div>
            </div>
          )}

          {/* Mini Projects Mode */}
          {activeMode === "projects" && <MiniProjects />}
        </div>
      </div>
    </div>
  );
}
