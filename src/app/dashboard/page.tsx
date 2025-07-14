"use client";

import React from "react";
import ProgrammingQuiz from "@/components/dashboard/ProgrammingQuiz";
import WelcomeMessage from "@/components/dashboard/WelcomeMessage";
import Streaks from "@/components/dashboard/Streaks";
import DailyQuests from "@/components/dashboard/DailyQuests";

export default function DashboardPage() {
  return (
    <div className="mx-auto">
      {/* Welcome Message - personalized greeting */}
      <div className="mb-8">
        <WelcomeMessage />
      </div>

      {/* Main content - 2 column on desktop, 1 column on mobile/tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quiz Column - 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <ProgrammingQuiz />
        </div>

        {/* Sidebar Column - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Streak - compact for sidebar */}
          <div>
            <Streaks />
          </div>

          {/* Daily goals - compact for sidebar */}
          <div>
            <DailyQuests />
          </div>
        </div>
      </div>
    </div>
  );
}
