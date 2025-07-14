"use client";

import React from "react";

export default function Streaks() {
  // Sample data for a user's learning streak
  const currentStreak = 7;
  const longestStreak = 14;
  const streakDays = [
    { day: "Mon", completed: true },
    { day: "Tue", completed: true },
    { day: "Wed", completed: true },
    { day: "Thu", completed: true },
    { day: "Fri", completed: true },
    { day: "Sat", completed: true },
    { day: "Sun", completed: true },
  ];

  // Programming languages being learned
  const languages = [
    { name: "HTML", progress: 68, color: "bg-orange-500" },
    { name: "CSS", progress: 45, color: "bg-blue-500" },
    { name: "JavaScript", progress: 32, color: "bg-yellow-500" },
    { name: "Python", progress: 15, color: "bg-green-500" },
  ];

  return (
    <div className="bg-dark-300/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4">
        {/* Streak header - more compact */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">
                {currentStreak}
              </span>
              <svg
                className="w-5 h-5 text-amber-400 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p className="text-gray-400 text-xs">Current streak</p>
          </div>

          <div className="text-right">
            <div className="text-white font-bold">{longestStreak} days</div>
            <p className="text-gray-400 text-xs">Longest streak</p>
          </div>
        </div>

        {/* Streak calendar - more compact */}
        <div className="mb-4">
          <div className="grid grid-cols-7 gap-1.5">
            {streakDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-xs text-gray-400 mb-1">{day.day}</div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    day.completed
                      ? "bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] text-white"
                      : "bg-dark-200 text-gray-500"
                  }`}
                >
                  <svg
                    className={`w-3 h-3 ${
                      day.completed ? "opacity-100" : "opacity-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language progress - simplified */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white">Learning Progress</h3>
          {languages.slice(0, 3).map((lang, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white">{lang.name}</span>
                <span className="text-gray-400">{lang.progress}%</span>
              </div>
              <div className="w-full h-1 bg-dark-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${lang.color}`}
                  style={{ width: `${lang.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
