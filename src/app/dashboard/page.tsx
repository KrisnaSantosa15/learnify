"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CourseProgress from "@/components/dashboard/CourseProgress";
import CourseSelector from "@/components/dashboard/CourseSelector";
import ProgrammingQuiz from "@/components/dashboard/ProgrammingQuiz";
import Streaks from "@/components/dashboard/Streaks";
import RecentActivities from "@/components/dashboard/RecentActivities";
import NeuralEnhancer from "@/components/dashboard/NeuralEnhancer";
import DailyQuests from "@/components/dashboard/DailyQuests";
import Leaderboard from "@/components/dashboard/Leaderboard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0a111f] text-white">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Your Learning Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course selector */}
                <CourseSelector />

                {/* Current course progress */}
                <CourseProgress />

                {/* Programming Quiz */}
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Daily Programming Quiz
                  </h2>
                  <ProgrammingQuiz />
                </div>

                {/* Recent activity */}
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Your Recent Activity
                  </h2>
                  <RecentActivities />
                </div>
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="space-y-6">
                {/* Streak tracker */}
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Your Progress Streak
                  </h2>
                  <Streaks />
                </div>

                {/* Daily challenges */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Today's Challenges</h2>
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
          </div>
        </main>
      </div>
    </div>
  );
}
