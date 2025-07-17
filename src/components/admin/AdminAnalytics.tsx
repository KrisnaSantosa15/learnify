"use client";

import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiZap,
  FiTrendingUp,
  FiPlus,
  FiUserPlus,
  FiAward,
} from "react-icons/fi";

interface AnalyticsData {
  totalUsers: number;
  totalQuizzes: number;
  totalSubmissions: number;
  totalXP: number;
  userGrowth: { date: string; count: number }[];
  quizPerformance: {
    category: string;
    averageScore: number;
    totalAttempts: number;
  }[];
  popularQuizzes: { title: string; attempts: number; averageScore: number }[];
  recentActivity: {
    type: string;
    user: string;
    details: string;
    timestamp: string;
  }[];
}

export function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalQuizzes: 0,
    totalSubmissions: 0,
    totalXP: 0,
    userGrowth: [],
    quizPerformance: [],
    popularQuizzes: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      // Simulate API call for analytics data
      // In real implementation, this would fetch from your analytics API
      setData({
        totalUsers: 1247,
        totalQuizzes: 89,
        totalSubmissions: 3542,
        totalXP: 45890,
        userGrowth: [
          { date: "2024-01-01", count: 100 },
          { date: "2024-01-02", count: 150 },
          { date: "2024-01-03", count: 200 },
          { date: "2024-01-04", count: 280 },
          { date: "2024-01-05", count: 350 },
          { date: "2024-01-06", count: 420 },
          { date: "2024-01-07", count: 500 },
        ],
        quizPerformance: [
          { category: "JavaScript", averageScore: 85.2, totalAttempts: 1250 },
          { category: "React", averageScore: 78.9, totalAttempts: 890 },
          { category: "CSS", averageScore: 91.5, totalAttempts: 650 },
          { category: "Node.js", averageScore: 73.1, totalAttempts: 420 },
          { category: "TypeScript", averageScore: 82.7, totalAttempts: 332 },
        ],
        popularQuizzes: [
          {
            title: "JavaScript Fundamentals",
            attempts: 542,
            averageScore: 87.3,
          },
          { title: "React Hooks Deep Dive", attempts: 421, averageScore: 76.8 },
          { title: "CSS Grid Layout", attempts: 356, averageScore: 92.1 },
          { title: "Async/Await Mastery", attempts: 298, averageScore: 81.4 },
          { title: "TypeScript Basics", attempts: 234, averageScore: 84.6 },
        ],
        recentActivity: [
          {
            type: "quiz_completed",
            user: "John Doe",
            details: "Completed JavaScript Fundamentals",
            timestamp: "2024-01-07T10:30:00Z",
          },
          {
            type: "user_registered",
            user: "Jane Smith",
            details: "Joined the platform",
            timestamp: "2024-01-07T09:15:00Z",
          },
          {
            type: "quiz_created",
            user: "Admin",
            details: "Created new React quiz",
            timestamp: "2024-01-07T08:45:00Z",
          },
          {
            type: "achievement_earned",
            user: "Mike Johnson",
            details: "Earned JavaScript Master badge",
            timestamp: "2024-01-07T07:20:00Z",
          },
          {
            type: "quiz_completed",
            user: "Sarah Wilson",
            details: "Completed CSS Grid Layout",
            timestamp: "2024-01-07T06:30:00Z",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600 mt-1">
              Platform insights and performance metrics
            </p>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {data.totalUsers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <FiTrendingUp className="w-3 h-3" />
                +12.5% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-3xl font-bold text-gray-900">
                {data.totalQuizzes}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <FiTrendingUp className="w-3 h-3" />
                +8.3% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiFileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Quiz Submissions
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {data.totalSubmissions.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <FiTrendingUp className="w-3 h-3" />
                +24.1% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiCheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total XP Earned
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {data.totalXP.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <FiTrendingUp className="w-3 h-3" />
                +18.7% from last month
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiZap className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          User Growth Trend
        </h3>
        <div className="h-64 flex items-end space-x-2">
          {data.userGrowth.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{
                  height: `${
                    (item.count /
                      Math.max(...data.userGrowth.map((d) => d.count))) *
                    200
                  }px`,
                }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Performance by Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Quiz Performance by Category
          </h3>
          <div className="space-y-4">
            {data.quizPerformance.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {category.category}
                    </span>
                    <span className="text-sm text-gray-600">
                      {category.averageScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${category.averageScore}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {category.totalAttempts} attempts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Quizzes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Most Popular Quizzes
          </h3>
          <div className="space-y-4">
            {data.popularQuizzes.map((quiz, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {quiz.attempts} attempts
                    </span>
                    <span className="text-sm text-green-600">
                      {quiz.averageScore.toFixed(1)}% avg score
                    </span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-400">
                  #{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {data.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg"
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === "quiz_completed"
                    ? "bg-green-100"
                    : activity.type === "user_registered"
                    ? "bg-blue-100"
                    : activity.type === "quiz_created"
                    ? "bg-purple-100"
                    : "bg-orange-100"
                }`}
              >
                {activity.type === "quiz_completed" && (
                  <FiCheckCircle className="w-4 h-4 text-green-600" />
                )}
                {activity.type === "user_registered" && (
                  <FiUserPlus className="w-4 h-4 text-blue-600" />
                )}
                {activity.type === "quiz_created" && (
                  <FiPlus className="w-4 h-4 text-purple-600" />
                )}
                {activity.type === "achievement_earned" && (
                  <FiAward className="w-4 h-4 text-orange-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.user}
                </p>
                <p className="text-sm text-gray-600">{activity.details}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
