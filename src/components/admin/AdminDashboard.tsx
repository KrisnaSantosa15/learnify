"use client";

import React, { useState } from "react";
import {
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiZap,
  FiEdit3,
  FiUserCheck,
  FiTrendingUp,
} from "react-icons/fi";

interface DashboardStats {
  totalUsers: number;
  activeQuizzes: number;
  completions: number;
  challenges: number;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  time: string;
  avatar: string;
}

export function AdminDashboard() {
  const [stats] = useState<DashboardStats>({
    totalUsers: 2847,
    activeQuizzes: 24,
    completions: 1923,
    challenges: 156,
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      user: "John Smith",
      action: "completed JavaScript Basics Quiz",
      time: "2 minutes ago",
      avatar: "JS",
    },
    {
      id: "2",
      user: "Sarah Johnson",
      action: "submitted FizzBuzz Challenge",
      time: "5 minutes ago",
      avatar: "SJ",
    },
    {
      id: "3",
      user: "Mike Chen",
      action: "achieved Code Warrior badge",
      time: "12 minutes ago",
      avatar: "MC",
    },
    {
      id: "4",
      user: "Emma Davis",
      action: "started React Development course",
      time: "18 minutes ago",
      avatar: "ED",
    },
  ]);

  const quickActions = [
    {
      title: "Create Quiz",
      description: "Add new quiz content",
      icon: FiEdit3,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Manage Users",
      description: "View user profiles",
      icon: FiUserCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "View Analytics",
      description: "Performance insights",
      icon: FiTrendingUp,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalUsers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <span className="text-green-500">+12.5%</span> from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Active Quizzes */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Quizzes
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.activeQuizzes}
              </p>
              <p className="text-sm text-blue-600 mt-1">Ready to engage</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiFileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Completions */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completions</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.completions.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                87.3% completion rate
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Challenges</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.challenges}
              </p>
              <p className="text-sm text-orange-600 mt-1">Algorithm focused</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiZap className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-medium text-sm">
                      {activity.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}
                  >
                    <action.icon className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
