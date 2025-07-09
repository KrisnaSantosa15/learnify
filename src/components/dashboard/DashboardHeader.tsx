"use client";

import React, { useState } from "react";
import CourseSelector from "./CourseSelector";

export default function DashboardHeader() {
  // Demo data - in a real application, this would come from a database/API
  const currentStreak = 7;
  const totalHearts = 5;
  const currentHearts = 3;
  const userXP = 505;
  const level = 1;
  const [currentCourseId, setCurrentCourseId] = useState("js");

  const handleCourseChange = (courseId: string) => {
    setCurrentCourseId(courseId);
    // In a real app, you would fetch course data, update UI, etc.
    console.log(`Switched to course: ${courseId}`);
  };

  return (
    <header className="bg-dark-300 h-16 flex items-center fixed top-0 left-0 right-0 z-30 px-4 sm:px-6 border-b border-white/10 shadow-sm">
      {/* Left edge spacer to account for sidebar */}
      <div className="w-24 flex-shrink-0"></div>

      {/* Course selector - similar to Duolingo's language selector */}
      <div className="flex-1">
        <CourseSelector
          currentCourseId={currentCourseId}
          onCourseChange={handleCourseChange}
        />
      </div>

      {/* Stats and user menu */}
      <div className="flex items-center space-x-3">
        {/* XP Counter */}
        <div className="flex items-center px-2.5 py-1.5 bg-dark-200 rounded-full">
          <div className="w-6 h-6 rounded-full bg-[#8e5ff5] flex items-center justify-center text-white font-bold text-xs mr-1.5">
            {level}
          </div>
          <span className="text-[#8e5ff5] font-bold text-sm">{userXP}</span>
        </div>

        {/* Hearts */}
        <div className="flex items-center px-2.5 py-1.5 bg-dark-200 rounded-full">
          <svg
            className="w-4 h-4 text-[#ff5e7d]"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
          <span className="text-[#ff5e7d] font-bold text-sm ml-1.5">
            {currentHearts}/{totalHearts}
          </span>
        </div>

        {/* Streak */}
        <div className="flex items-center px-2.5 py-1.5 bg-dark-200 rounded-full">
          <svg
            className="w-4 h-4 text-[#fab72b]"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
          </svg>
          <span className="text-[#fab72b] font-bold text-sm ml-1.5">
            {currentStreak}
          </span>
        </div>

        {/* User Menu */}
        <div className="ml-2">
          <button className="h-8 w-8 rounded-full bg-[#28c7f9] flex items-center justify-center text-white font-bold text-sm ring-2 ring-[#28c7f9]/30">
            J
          </button>
        </div>
      </div>
    </header>
  );
}
