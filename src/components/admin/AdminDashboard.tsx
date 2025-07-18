"use client";

import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiAward,
  FiEdit3,
  FiUserCheck,
  FiTrendingUp,
  FiBarChart,
  FiStar,
  FiTarget,
  FiZap,
  FiClock,
  FiActivity,
  FiGrid,
  FiRefreshCw,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";
import Link from "next/link";

interface AnalyticsData {
  stats: {
    totalUsers: number;
    totalQuizzes: number;
    totalQuizAttempts: number;
    totalAchievements: number;
    totalCategories: number;
    recentUsers: number;
    recentAttempts: number;
    completionRate: number;
    userGrowthRate: number;
  };
  topPerformers: Array<{
    id: string;
    name: string | null;
    email: string;
    xp: number;
  }>;
  popularQuizzes: Array<{
    id: string;
    title: string;
    category: {
      name: string;
      color: string;
    } | null;
    _count: {
      attempts: number;
    };
  }>;
  recentActivity: Array<{
    id: string;
    score: number | null;
    isCompleted: boolean;
    createdAt: string;
    user: {
      name: string | null;
      email: string;
    };
    quiz: {
      title: string;
    };
  }>;
  categoryStats: Array<{
    id: string;
    name: string;
    color: string;
    _count: {
      quizzes: number;
    };
  }>;
  achievementStats: Array<{
    rarity: string;
    _count: {
      rarity: number;
    };
  }>;
}

export function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 0,
    totalQuizzes: 0,
    totalQuizAttempts: 0,
    totalAchievements: 0,
    totalCategories: 0,
    recentUsers: 0,
    recentAttempts: 0,
    completionRate: 0,
    userGrowthRate: 0,
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toUpperCase()) {
      case "COMMON":
        return "bg-gray-100 text-gray-700";
      case "UNCOMMON":
        return "bg-green-100 text-green-700";
      case "RARE":
        return "bg-blue-100 text-blue-700";
      case "EPIC":
        return "bg-purple-100 text-purple-700";
      case "LEGENDARY":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const quickActions = [
    {
      title: "Create Quiz",
      description: "Add new quiz content",
      icon: FiEdit3,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      link: "/admin/quizzes",
    },
    {
      title: "Manage Users",
      description: "View user profiles",
      icon: FiUserCheck,
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      link: "/admin/users",
    },
    {
      title: "View Analytics",
      description: "Performance insights",
      icon: FiBarChart,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      link: "/admin/analytics",
    },
    {
      title: "Achievements",
      description: "Manage rewards",
      icon: FiAward,
      color: "bg-gradient-to-r from-yellow-500 to-orange-500",
      link: "/admin/achievements",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your learning platform with real-time insights
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiUsers className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Total Users
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1">
                    {stats.userGrowthRate >= 0 ? (
                      <FiArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <FiArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm ${
                        stats.userGrowthRate >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stats.userGrowthRate >= 0 ? "+" : ""}
                      {stats.userGrowthRate}%
                    </span>
                    <span className="text-sm text-gray-500">this month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Quizzes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiFileText className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Total Quizzes
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalQuizzes.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stats.totalCategories} categories
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Attempts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Quiz Attempts
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalQuizAttempts.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">
                    {stats.completionRate}% completion rate
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <FiAward className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Achievements
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalAchievements.toLocaleString()}
                  </p>
                  <p className="text-sm text-orange-600">
                    Reward system active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiActivity className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Activity
                  </h3>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data?.recentActivity && data.recentActivity.length > 0 ? (
                  data.recentActivity.slice(0, 6).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {activity.user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") ||
                            activity.user.email.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">
                            {activity.user.name || activity.user.email}
                          </span>{" "}
                          {activity.isCompleted ? "completed" : "attempted"}{" "}
                          &ldquo;{activity.quiz.title}&rdquo;
                          {activity.score !== null && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {activity.score}%
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="mb-4">
                      <FiClock className="w-12 h-12 mx-auto text-gray-300" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">
                      No Recent Activity
                    </h4>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      There haven&apos;t been any quiz attempts yet. Activity
                      will appear here once users start taking quizzes.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/admin/quizzes"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiEdit3 className="w-4 h-4" />
                        Create Your First Quiz
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Performers & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FiZap className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Quick Actions
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      href={action.link}
                      className="group block"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all group-hover:shadow-md">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${action.color}`}
                        >
                          <action.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {action.description}
                          </p>
                        </div>
                        <FiArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FiStar className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Top Performers
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {data?.topPerformers && data.topPerformers.length > 0 ? (
                    data.topPerformers.slice(0, 5).map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                              : index === 1
                              ? "bg-gradient-to-r from-gray-400 to-gray-500"
                              : index === 2
                              ? "bg-gradient-to-r from-orange-400 to-red-500"
                              : "bg-gradient-to-r from-blue-400 to-purple-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {user.name || user.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user.xp.toLocaleString()} XP
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiTarget className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                      <h4 className="font-medium text-gray-600 mb-1">
                        No User Data Yet
                      </h4>
                      <p className="text-sm text-gray-500">
                        Top performers will appear here once users start earning
                        XP from quizzes.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiGrid className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Categories</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {data?.categoryStats.slice(0, 5).map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {category._count.quizzes} quizzes
                    </span>
                  </div>
                )) || (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No categories found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Achievement Rarity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiAward className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Achievement Rarity
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {data?.achievementStats.map((stat) => (
                  <div
                    key={stat.rarity}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getRarityColor(
                        stat.rarity
                      )}`}
                    >
                      {stat.rarity}
                    </span>
                    <span className="text-sm text-gray-500">
                      {stat._count.rarity}
                    </span>
                  </div>
                )) || (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No achievements found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Popular Quizzes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Popular Quizzes
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {data?.popularQuizzes.slice(0, 5).map((quiz, index) => (
                  <div key={quiz.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {quiz.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {quiz._count.attempts} attempts
                      </p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No quiz data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
