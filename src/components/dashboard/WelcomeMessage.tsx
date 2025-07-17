"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// Motivational quotes for developers
const quotes = [
  "Code is poetry written in logic! 🎨",
  "Every expert was once a beginner! 🌱",
  "Debug your way to greatness! 🐛→✨",
  "Functions today, features tomorrow! ⚡",
  "Syntax errors are just learning opportunities! 💡",
  "Your next breakthrough is one commit away! 🚀",
  "Algorithms are the recipes for digital magic! 🔮",
  "Code with passion, debug with patience! ❤️",
];

export default function WelcomeMessage() {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [motivationalQuote, setMotivationalQuote] = useState("");

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get random motivational quote
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMotivationalQuote(randomQuote);
  }, []);

  // Get current streak (mock data - you can connect to real user data)
  const currentStreak = 7;
  const todayProgress = 3; // completed challenges today

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-dark-300/40 via-dark-200/60 to-dark-300/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#28c7f9]/20 to-[#8e5ff5]/20 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute top-1/2 -left-6 w-16 h-16 bg-gradient-to-br from-[#8e5ff5]/20 to-[#28c7f9]/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Welcome section */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {session?.user?.name?.charAt(0) || "C"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {getGreeting()},{" "}
                  {session?.user?.name?.split(" ")[0] || "Coder"}! 👋
                </h1>
                <p className="text-gray-400 text-sm">
                  Ready to level up your coding skills?
                </p>
              </div>
            </div>

            {/* Motivational quote */}
            <div className="bg-gradient-to-r from-[#28c7f9]/10 to-[#8e5ff5]/10 rounded-lg p-3 border border-[#28c7f9]/20 mt-4">
              <p className="text-[#28c7f9] font-medium text-sm flex items-center gap-2">
                <span className="text-lg">💪</span>
                {motivationalQuote}
              </p>
            </div>
          </div>

          {/* Stats section */}
          <div className="flex items-center gap-6">
            {/* Streak counter */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-white">
                  {currentStreak}
                </span>
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-xs text-gray-400">Day Streak</p>
            </div>

            {/* Today's progress */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-white">
                  {todayProgress}
                </span>
                <span className="text-[#28c7f9] font-semibold">/5</span>
              </div>
              <p className="text-xs text-gray-400">Daily Goals</p>
            </div>

            {/* Current language badge */}
            <div className="bg-gradient-to-r from-[#f7df1e]/20 to-[#f7df1e]/10 border border-[#f7df1e]/30 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#f7df1e] flex items-center justify-center text-black font-bold text-sm">
                  JS
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">JavaScript</p>
                  <p className="text-[#f7df1e] text-xs">67% complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] hover:from-[#28c7f9]/90 hover:to-[#8e5ff5]/90 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
            <span>🎯</span>
            Continue Learning
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200">
            <span>📊</span>
            View Progress
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200">
            <span>🏆</span>
            Achievements
          </button>
        </div>
      </div>
    </div>
  );
}
