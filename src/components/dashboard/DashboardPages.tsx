"use client";

import React from "react";
import CourseProgress from "./CourseProgress";
import CourseSelector from "./CourseSelector";
import ProgrammingQuiz from "./ProgrammingQuiz";
import Streaks from "./Streaks";
import RecentActivities from "./RecentActivities";
import NeuralEnhancer from "./NeuralEnhancer";
import DailyQuests from "./DailyQuests";
import Leaderboard from "./Leaderboard";

interface DashboardPagesProps {
  activePage: string;
  currentCourse: string;
  onCourseChange: (courseId: string) => void;
}

export default function DashboardPages({
  activePage,
  currentCourse,
  onCourseChange,
}: DashboardPagesProps) {
  // Main Learning Page
  const renderLearnPage = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content - 2/3 width */}
      <div className="lg:col-span-2 space-y-6">
        {/* Course selector */}
        <CourseSelector
          currentCourseId={currentCourse}
          onCourseChange={onCourseChange}
        />

        {/* Current course progress */}
        <CourseProgress />

        {/* Programming Quiz */}
        <div>
          <h2 className="text-xl font-bold mb-4">Daily Programming Quiz</h2>
          <ProgrammingQuiz />
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Recent Activity</h2>
          <RecentActivities />
        </div>
      </div>

      {/* Sidebar - 1/3 width */}
      <div className="space-y-6">
        {/* Streak tracker */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Progress Streak</h2>
          <Streaks />
        </div>

        {/* Daily challenges */}
        <div>
          <h2 className="text-xl font-bold mb-4">Today&apos;s Challenges</h2>
          <DailyQuests />
        </div>

        {/* Code Accelerator (formerly Neural Enhancer) */}
        <div>
          <h2 className="text-xl font-bold mb-4">Premium Features</h2>
          <NeuralEnhancer />
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="text-xl font-bold mb-4">Top Learners</h2>
          <Leaderboard />
        </div>
      </div>
    </div>
  );

  // Practice Page
  const renderPracticePage = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Practice Zone</h2>
        <p className="text-gray-400">
          Sharpen your skills with coding challenges
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-dark-300/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Coding Challenges</h3>
          <ProgrammingQuiz />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-dark-300/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Streaks</h3>
            <Streaks />
          </div>

          <div className="bg-dark-300/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Progress</h3>
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  );

  // Leaderboards Page
  const renderLeaderboardsPage = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Leaderboards</h2>
        <p className="text-gray-400">See how you rank against other learners</p>
      </div>

      <div className="grid gap-6">
        <Leaderboard />
      </div>
    </div>
  );

  // Quests Page
  const renderQuestsPage = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Daily Quests</h2>
        <p className="text-gray-400">
          Complete challenges to earn XP and badges
        </p>
      </div>

      <div className="grid gap-6">
        <DailyQuests />
      </div>
    </div>
  );

  // Shop Page (placeholder)
  const renderShopPage = () => (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-dark-300/50 backdrop-blur-sm border border-white/5 rounded-xl p-12">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-3xl font-bold mb-4">Shop Coming Soon</h2>
          <p className="text-gray-400 mb-6">
            Purchase premium features, themes, and power-ups to enhance your
            learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-200/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Premium Themes</h3>
            <p className="text-sm text-gray-400">Customize your dashboard</p>
          </div>
          <div className="bg-dark-200/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Power-ups</h3>
            <p className="text-sm text-gray-400">Boost your XP and streaks</p>
          </div>
          <div className="bg-dark-200/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Certificates</h3>
            <p className="text-sm text-gray-400">Showcase your achievements</p>
          </div>
        </div>

        <button
          className="px-6 py-3 bg-[#28c7f9] rounded-lg font-semibold disabled:opacity-50"
          disabled
        >
          Coming Soon
        </button>
      </div>
    </div>
  );

  // Profile Page (placeholder)
  const renderProfilePage = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Profile</h2>
        <p className="text-gray-400">
          Manage your account and view your progress
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-dark-300/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Statistics Overview</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Streaks />
            <RecentActivities />
          </div>
        </div>

        <div className="bg-dark-300/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Course Progress</h3>
          <CourseProgress />
        </div>
      </div>
    </div>
  );

  // Page router
  switch (activePage) {
    case "learn":
      return renderLearnPage();
    case "practice":
      return renderPracticePage();
    case "leaderboards":
      return renderLeaderboardsPage();
    case "quests":
      return renderQuestsPage();
    case "shop":
      return renderShopPage();
    case "profile":
      return renderProfilePage();
    default:
      return renderLearnPage();
  }
}
