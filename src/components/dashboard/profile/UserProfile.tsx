"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface UserStats {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    level: number;
    xp: number;
    xpProgress: number;
    xpNeeded: number;
    xpForNextLevel: number;
    streak: number;
    lastActive: string;
    createdAt: string;
  };
  quiz: {
    totalAttempts: number;
    averageScore: number;
    averageAccuracy: number;
    totalTimeSpent: number;
    averageTimePerQuiz: number;
  };
  achievements: {
    total: number;
  };
  categories: Array<{
    name: string;
    icon?: string | null;
    color?: string | null;
    totalAttempts: number;
    totalScore: number;
    totalMaxScore: number;
    averageAccuracy: number;
  }>;
  recentActivity: Array<{
    id: string;
    quiz: {
      title: string;
      category: {
        name: string;
        icon?: string | null;
      };
    };
    score: number;
    maxScore: number;
    accuracy: number;
    completedAt: string;
    timeSpent: number;
  }>;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  unlockedAt: string | null;
  isUnlocked: boolean;
}

export default function UserProfile() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "achievements" | "skills" | "settings"
  >("overview");

  // Form state for settings
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    dailyReminders: true,
    publicProfile: true,
    emailNotifications: false,
  });

  // Use ref to track if data has been fetched to prevent unnecessary re-fetches
  const hasFetchedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, achievementsResponse] = await Promise.all([
        fetch("/api/users/stats"),
        fetch("/api/users/achievements"),
      ]);

      if (!statsResponse.ok) {
        throw new Error("Failed to fetch user statistics");
      }
      if (!achievementsResponse.ok) {
        throw new Error("Failed to fetch achievements");
      }

      const [statsData, achievementsData] = await Promise.all([
        statsResponse.json(),
        achievementsResponse.json(),
      ]);

      setStats(statsData);
      setAchievements(achievementsData.achievements || []);

      // Initialize form data with user stats
      setFormData({
        name: statsData.user.name || "",
        bio: "",
        dailyReminders: true,
        publicProfile: true,
        emailNotifications: false,
      });

      hasFetchedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if user is authenticated and we haven't fetched yet, or if user changed
    if (
      session?.user?.email &&
      (!hasFetchedRef.current || userIdRef.current !== session.user.email)
    ) {
      userIdRef.current = session.user.email;
      fetchUserData();
    }
  }, [session?.user?.email]); // Only depend on user email, not the entire session object

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "COMMON":
        return "from-gray-400 to-gray-600";
      case "RARE":
        return "from-blue-400 to-blue-600";
      case "EPIC":
        return "from-purple-400 to-purple-600";
      case "LEGENDARY":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getXPProgress = () => {
    if (!stats) return 0;
    return (stats.user.xpProgress / 1000) * 100;
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return "🔥";
    if (streak >= 14) return "⚡";
    if (streak >= 7) return "💪";
    if (streak >= 3) return "🌟";
    return "📈";
  };

  const getCalendarDays = () => {
    const today = new Date();
    const days = [];

    // Get last 35 days
    for (let i = 34; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push({
        date,
        dayNumber: date.getDate(),
        isActive: i < (stats?.user.streak || 0),
        isToday: i === 0,
        monthShort: date.toLocaleDateString("en", { month: "short" }),
      });
    }

    return days;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    // Here you would typically save to your backend
    console.log("Saving changes:", formData);
    // You can add API call here to update user profile
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8e5ff5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchUserData}
            className="px-6 py-2 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-lg text-white font-bold hover:scale-105 transition-transform"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Cover Background with Enhanced Design */}
          <div className="h-80 bg-gradient-to-r from-[#28c7f9] via-[#8e5ff5] to-[#ff6b9d] rounded-3xl relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-32 right-16 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-700"></div>
              <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-white/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>

            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* Profile Content - Redesigned Layout */}
          <div className="relative -mt-32 px-8">
            <div className="bg-dark-200/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Avatar Section */}
                <div className="relative flex-shrink-0">
                  <div className="w-44 h-44 bg-gradient-to-br from-[#28c7f9] to-[#8e5ff5] rounded-3xl flex items-center justify-center text-6xl border-4 border-white/20 shadow-2xl relative overflow-hidden">
                    {/* Avatar Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    {stats.user.avatar ? (
                      <Image
                        src={stats.user.avatar}
                        alt={stats.user.name || "User"}
                        width={176}
                        height={176}
                        className="w-full h-full rounded-3xl object-cover relative z-10"
                      />
                    ) : (
                      <span className="text-white text-6xl font-bold relative z-10">
                        {stats.user.name?.charAt(0)?.toUpperCase() ||
                          stats.user.email?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </span>
                    )}
                  </div>

                  {/* Level Badge - Redesigned */}
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-dark-100 font-bold text-2xl border-4 border-dark-200 shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
                    <div className="text-center">
                      <div className="text-xs font-medium opacity-80">LVL</div>
                      <div className="text-lg font-bold">
                        {stats.user.level}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Info Section - Redesigned */}
                <div className="flex-1 text-center lg:text-left space-y-6">
                  {/* Name and Title */}
                  <div>
                    <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      {stats.user.name || "Anonymous User"}
                    </h1>
                    <p className="text-[#28c7f9] text-xl font-medium mb-3">
                      {stats.user.email}
                    </p>
                    <div className="flex items-center justify-center lg:justify-start gap-4 text-lg">
                      <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-semibold">
                        🎯 Level {stats.user.level} Learning Champion
                      </span>
                      <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-semibold">
                        🏆 {stats.achievements.total} Achievements
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats Grid - Glassmorphism Style */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 hover:scale-105 transition-all duration-300">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                        🎯
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {stats.quiz.totalAttempts}
                      </div>
                      <div className="text-gray-300 text-sm font-medium">
                        Quizzes Completed
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 hover:scale-105 transition-all duration-300">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                        📅
                      </div>
                      <div className="text-xl font-bold text-white mb-1">
                        {new Date(stats.user.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-gray-300 text-sm font-medium">
                        Member Since
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 hover:scale-105 transition-all duration-300">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                        ⚡
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {Math.round(stats.quiz.averageAccuracy)}%
                      </div>
                      <div className="text-gray-300 text-sm font-medium">
                        Avg Accuracy
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview - Glassmorphism Theme */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
              💎
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {stats.user.xp.toLocaleString()}
            </div>
            <div className="text-xs text-gray-300 font-medium uppercase tracking-wider">
              Total XP
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
              🏆
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              #{Math.max(1, 2847 - Math.floor(stats.user.xp / 50))}
            </div>
            <div className="text-xs text-gray-300 font-medium uppercase tracking-wider">
              Global Rank
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
              📚
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {stats.quiz.totalAttempts}
            </div>
            <div className="text-xs text-gray-300 font-medium uppercase tracking-wider">
              Quizzes
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
              🎖️
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {stats.achievements.total}
            </div>
            <div className="text-xs text-gray-300 font-medium uppercase tracking-wider">
              Achievements
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
              🔥
            </div>
            <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <span>{getStreakIcon(stats.user.streak)}</span>
              <span>{stats.user.streak}</span>
            </div>
            <div className="text-xs text-gray-300 font-medium uppercase tracking-wider">
              Day Streak
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
              ⏱️
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {Math.round(stats.quiz.totalTimeSpent / 60)}h
            </div>
            <div className="text-xs text-gray-300 font-medium uppercase tracking-wider">
              Learning Time
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Level Progress</h3>
            <div className="text-sm text-gray-400">
              {stats.user.xpProgress}/1000 XP to level {stats.user.level + 1}
            </div>
          </div>
          <div className="w-full bg-dark-300 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-full transition-all duration-1000 relative"
              style={{ width: `${getXPProgress()}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-2">
            <div className="flex space-x-2">
              {[
                {
                  id: "overview",
                  name: "📊 Overview",
                  desc: "Stats & Activity",
                },
                {
                  id: "achievements",
                  name: "🏆 Achievements",
                  desc: "Unlocked Rewards",
                },
                { id: "skills", name: "🎯 Skills", desc: "Progress & Levels" },
                {
                  id: "settings",
                  name: "⚙️ Settings",
                  desc: "Account & Privacy",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-6 py-3 rounded-lg text-center transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="font-bold">{tab.name}</div>
                  <div className="text-xs opacity-80">{tab.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-2">📈</span>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {stats.recentActivity.slice(0, 4).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-dark-300/40 rounded-xl hover:bg-dark-300/60 transition-colors duration-200"
                    >
                      <div className="text-3xl">
                        {activity.quiz.category.icon || "📝"}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          Completed{" "}
                          <span className="text-[#28c7f9] font-semibold">
                            {activity.quiz.title}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {new Date(activity.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold text-lg">
                          {activity.accuracy}%
                        </div>
                        <div className="text-xs text-gray-400">
                          {activity.timeSpent}m
                        </div>
                      </div>
                    </div>
                  ))}

                  {stats.recentActivity.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">📚</div>
                      <p className="text-gray-400">No recent activity yet</p>
                      <p className="text-gray-500 text-sm">
                        Start taking quizzes to see your progress here!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Streak */}
              <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-2">🔥</span>
                  Learning Streak
                </h3>

                <div className="text-center mb-8">
                  <div className="text-7xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text mb-3">
                    {stats.user.streak}
                  </div>
                  <div className="text-gray-400 text-lg">Days in a row</div>
                  <div className="text-sm text-gray-500 mt-2">
                    {stats.user.streak > 0
                      ? "Keep it up! 🚀"
                      : "Start your journey today! ✨"}
                  </div>
                </div>

                {/* Real Calendar */}
                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-3 text-center">
                    Last 5 weeks
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {/* Day headers */}
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                      <div
                        key={i}
                        className="text-xs text-gray-500 text-center font-medium p-1"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Calendar days */}
                    {getCalendarDays().map((day, i) => (
                      <div
                        key={i}
                        className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                          day.isActive
                            ? day.isToday
                              ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg transform scale-110"
                              : "bg-gradient-to-br from-orange-400/80 to-red-500/80 text-white"
                            : "bg-dark-300/40 text-gray-500 hover:bg-dark-300/60"
                        }`}
                        title={day.date.toDateString()}
                      >
                        {day.dayNumber}
                        {day.isToday && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <button className="px-8 py-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl text-white font-bold hover:scale-105 transition-all duration-300 shadow-lg">
                    Keep Streak Alive! 🔥
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  🏆 Achievement Gallery
                </h2>
                <p className="text-gray-400">Your coding journey milestones</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="group relative transform hover:scale-105 transition-all duration-500"
                  >
                    {/* Glow effect for unlocked achievements */}
                    {achievement.isUnlocked && (
                      <div
                        className={`absolute -inset-2 bg-gradient-to-r ${getRarityColor(
                          achievement.rarity
                        )} rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 animate-pulse`}
                      ></div>
                    )}

                    <div
                      className={`relative ${
                        !achievement.isUnlocked
                          ? "bg-gradient-to-br from-dark-300/70 to-dark-400/90 border border-gray-600/40"
                          : `bg-gradient-to-br ${getRarityColor(
                              achievement.rarity
                            )} p-[2px]`
                      } rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
                    >
                      <div
                        className={`${
                          !achievement.isUnlocked
                            ? "bg-gradient-to-br from-dark-300/90 to-dark-400/95"
                            : "bg-gradient-to-br from-dark-200/95 to-dark-300/90"
                        } backdrop-blur-lg rounded-3xl p-8 h-full relative overflow-hidden`}
                      >
                        {/* Floating particles for legendary achievements */}
                        {achievement.isUnlocked &&
                          achievement.rarity === "LEGENDARY" && (
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                              <div
                                className="absolute top-4 left-6 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-0"
                                style={{ animationDuration: "3s" }}
                              ></div>
                              <div
                                className="absolute top-8 right-8 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-1000"
                                style={{ animationDuration: "2.5s" }}
                              ></div>
                              <div
                                className="absolute bottom-6 left-4 w-1 h-1 bg-yellow-300 rounded-full animate-bounce delay-2000"
                                style={{ animationDuration: "2s" }}
                              ></div>
                              <div
                                className="absolute bottom-12 right-6 w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-500"
                                style={{ animationDuration: "3.5s" }}
                              ></div>
                            </div>
                          )}

                        {/* Epic achievement background shimmer */}
                        {achievement.isUnlocked &&
                          achievement.rarity === "EPIC" && (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/15 to-purple-500/10 animate-pulse"></div>
                          )}

                        {/* Achievement content */}
                        <div className="text-center relative z-10 space-y-6">
                          {/* Icon section with enhanced animations */}
                          <div className="relative">
                            <div
                              className={`text-7xl mb-2 transition-all duration-500 ${
                                !achievement.isUnlocked
                                  ? "grayscale opacity-40 scale-90"
                                  : "group-hover:scale-125 group-hover:rotate-12 drop-shadow-2xl"
                              }`}
                            >
                              {!achievement.isUnlocked ? "�" : achievement.icon}
                            </div>

                            {/* Rarity indicator ring */}
                            {achievement.isUnlocked && (
                              <div
                                className={`absolute -inset-4 rounded-full border-2 ${
                                  achievement.rarity === "LEGENDARY"
                                    ? "border-yellow-400/60 animate-spin"
                                    : achievement.rarity === "EPIC"
                                    ? "border-purple-400/60 animate-pulse"
                                    : achievement.rarity === "RARE"
                                    ? "border-blue-400/60"
                                    : "border-green-400/60"
                                } transition-all duration-500`}
                                style={{
                                  animationDuration:
                                    achievement.rarity === "LEGENDARY"
                                      ? "8s"
                                      : "2s",
                                }}
                              ></div>
                            )}
                          </div>

                          {/* Title and description */}
                          <div className="space-y-3">
                            <h3
                              className={`font-bold text-xl transition-colors duration-300 ${
                                !achievement.isUnlocked
                                  ? "text-gray-500"
                                  : "text-white group-hover:text-yellow-100"
                              }`}
                            >
                              {achievement.title}
                            </h3>

                            <p
                              className={`text-sm leading-relaxed transition-colors duration-300 ${
                                !achievement.isUnlocked
                                  ? "text-gray-600"
                                  : "text-gray-300 group-hover:text-gray-200"
                              }`}
                            >
                              {achievement.description}
                            </p>
                          </div>

                          {/* Rarity badge */}
                          <div className="flex justify-center">
                            <div
                              className={`inline-flex px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                !achievement.isUnlocked
                                  ? "bg-gray-700/60 text-gray-500 border border-gray-600/40"
                                  : `bg-gradient-to-r ${getRarityColor(
                                      achievement.rarity
                                    )} text-dark-100 shadow-lg transform group-hover:scale-110`
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {achievement.rarity === "LEGENDARY" && "👑"}
                                {achievement.rarity === "EPIC" && "💎"}
                                {achievement.rarity === "RARE" && "⭐"}
                                {achievement.rarity === "COMMON" && "🏆"}
                                {achievement.rarity}
                              </span>
                            </div>
                          </div>

                          {/* Status badge */}
                          <div className="pt-2">
                            {!achievement.isUnlocked ? (
                              <div className="text-xs text-gray-600 bg-gray-700/40 rounded-xl px-4 py-2 inline-flex items-center gap-2 border border-gray-600/30">
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                                Keep learning to unlock!
                              </div>
                            ) : (
                              achievement.unlockedAt && (
                                <div className="text-xs text-emerald-400 bg-emerald-400/20 rounded-xl px-4 py-2 inline-flex items-center gap-2 border border-emerald-400/30">
                                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                                  Unlocked{" "}
                                  {new Date(
                                    achievement.unlockedAt
                                  ).toLocaleDateString()}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  🎯 Category Performance
                </h2>
                <p className="text-gray-400">
                  Track your expertise across different topics
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {stats.categories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{category.icon || "📖"}</div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {category.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {category.totalAttempts} attempts
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">
                          {category.averageAccuracy}%
                        </div>
                        <div className="text-xs text-gray-400">Accuracy</div>
                      </div>
                    </div>

                    <div className="w-full bg-dark-300 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${category.averageAccuracy}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  ⚙️ Account Settings
                </h2>
                <p className="text-gray-400">
                  Manage your profile and preferences
                </p>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      Personal Information
                    </h3>
                    <button className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 font-medium flex items-center gap-2">
                      <span className="text-sm">✏️</span>
                      Edit Profile
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28c7f9]/50 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={stats.user.email}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-400 focus:outline-none cursor-not-allowed"
                        disabled
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#28c7f9]/50 focus:border-transparent transition-all resize-none"
                        rows={3}
                        placeholder="Tell us about yourself..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Learning Preferences */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Learning Preferences
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">
                          Daily Reminders
                        </div>
                        <div className="text-gray-400 text-sm">
                          Get notified to maintain your streak
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleInputChange(
                            "dailyReminders",
                            !formData.dailyReminders
                          )
                        }
                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                          formData.dailyReminders
                            ? "bg-[#28c7f9] hover:bg-[#28c7f9]/80"
                            : "bg-gray-600 hover:bg-gray-500"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-lg transition-transform duration-300 ${
                            formData.dailyReminders ? "right-0.5" : "left-0.5"
                          }`}
                        ></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">
                          Public Profile
                        </div>
                        <div className="text-gray-400 text-sm">
                          Show your profile in leaderboards
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleInputChange(
                            "publicProfile",
                            !formData.publicProfile
                          )
                        }
                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                          formData.publicProfile
                            ? "bg-[#28c7f9] hover:bg-[#28c7f9]/80"
                            : "bg-gray-600 hover:bg-gray-500"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-lg transition-transform duration-300 ${
                            formData.publicProfile ? "right-0.5" : "left-0.5"
                          }`}
                        ></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">
                          Email Notifications
                        </div>
                        <div className="text-gray-400 text-sm">
                          Receive weekly progress reports
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleInputChange(
                            "emailNotifications",
                            !formData.emailNotifications
                          )
                        }
                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                          formData.emailNotifications
                            ? "bg-[#28c7f9] hover:bg-[#28c7f9]/80"
                            : "bg-gray-600 hover:bg-gray-500"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-lg transition-transform duration-300 ${
                            formData.emailNotifications
                              ? "right-0.5"
                              : "left-0.5"
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Changes Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSaveChanges}
                    className="px-8 py-3 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-xl text-white font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    💾 Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
