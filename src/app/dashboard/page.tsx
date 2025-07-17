"use client";

import React from "react";
import { RoleBasedDashboard } from "@/components/dashboard/RoleBasedDashboard";
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

      {/* Role-based Dashboard Content */}
      <div className="mb-8">
        <RoleBasedDashboard />
      </div>

      {/* Secondary Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Streaks />
        <DailyQuests />
      </div>
    </div>
  );
}
