"use client";

import React, { useState } from "react";

interface UserStats {
  totalXP: number;
  level: number;
  streak: number;
  challengesSolved: number;
  projectsCompleted: number;
  rank: number;
  joinedDate: string;
  hoursLearned: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt: string;
  isLocked: boolean;
}

interface Skill {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  icon: string;
  color: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "achievements" | "skills" | "settings"
  >("overview");
  const [isEditing, setIsEditing] = useState(false);

  const userStats: UserStats = {
    totalXP: 15420,
    level: 42,
    streak: 28,
    challengesSolved: 156,
    projectsCompleted: 8,
    rank: 3,
    joinedDate: "2024-01-15",
    hoursLearned: 248,
  };

  const userInfo = {
    name: "Alex Chen",
    username: "codeMaster42",
    email: "alex.chen@example.com",
    bio: "Full-stack developer passionate about clean code and innovative solutions. Always learning, always coding! 🚀",
    avatar: "👨🏻‍💻",
    location: "San Francisco, CA",
    github: "alexchen",
    linkedin: "alexchen-dev",
  };

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "First Steps",
      description: "Completed your first coding challenge",
      icon: "🎯",
      rarity: "common",
      unlockedAt: "2024-01-16",
      isLocked: false,
    },
    {
      id: "2",
      name: "Speed Demon",
      description: "Solved 10 challenges in under 5 minutes each",
      icon: "⚡",
      rarity: "rare",
      unlockedAt: "2024-02-28",
      isLocked: false,
    },
    {
      id: "3",
      name: "Code Architect",
      description: "Built 5 complete projects",
      icon: "🏗️",
      rarity: "epic",
      unlockedAt: "2024-05-15",
      isLocked: false,
    },
    {
      id: "4",
      name: "Perfect Streak",
      description: "Maintain a 30-day learning streak",
      icon: "🔥",
      rarity: "legendary",
      unlockedAt: "",
      isLocked: true,
    },
  ];

  const skills: Skill[] = [
    {
      name: "JavaScript",
      level: 8,
      xp: 2340,
      maxXp: 3000,
      icon: "⚡",
      color: "from-yellow-400 to-orange-500",
    },
    {
      name: "React",
      level: 6,
      xp: 1850,
      maxXp: 2500,
      icon: "⚛️",
      color: "from-blue-400 to-cyan-500",
    },
    {
      name: "Python",
      level: 5,
      xp: 1200,
      maxXp: 2000,
      icon: "🐍",
      color: "from-green-400 to-emerald-500",
    },
    {
      name: "Data Structures",
      level: 7,
      xp: 2100,
      maxXp: 2800,
      icon: "🗂️",
      color: "from-purple-400 to-pink-500",
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600";
      case "rare":
        return "from-blue-400 to-blue-600";
      case "epic":
        return "from-purple-400 to-purple-600";
      case "legendary":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getXPProgress = () => {
    const currentLevelXP = userStats.totalXP % 1000;
    const nextLevelXP = 1000;
    return (currentLevelXP / nextLevelXP) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Cover Background */}
          <div className="h-48 bg-gradient-to-r from-[#28c7f9] via-[#8e5ff5] to-[#ff6b9d] rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
              >
                {isEditing ? "💾 Save" : "✏️ Edit"}
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="relative -mt-20 ml-8">
            <div className="flex items-end space-x-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-[#28c7f9] to-[#8e5ff5] rounded-full flex items-center justify-center text-6xl border-4 border-dark-100">
                  {userInfo.avatar}
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-dark-100 font-bold text-lg border-4 border-dark-100">
                  {userStats.level}
                </div>
              </div>

              <div className="pb-4">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userInfo.name}
                </h1>
                <p className="text-[#28c7f9] text-lg mb-2">
                  @{userInfo.username}
                </p>
                <p className="text-gray-400 max-w-md">{userInfo.bio}</p>

                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">📍</span>
                    <span className="text-gray-300">{userInfo.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">📅</span>
                    <span className="text-gray-300">
                      Joined{" "}
                      {new Date(userStats.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#28c7f9]/20 to-[#8e5ff5]/20 border border-[#28c7f9]/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#28c7f9]">
              {userStats.totalXP.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Total XP</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              #{userStats.rank}
            </div>
            <div className="text-xs text-gray-400">Global Rank</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {userStats.challengesSolved}
            </div>
            <div className="text-xs text-gray-400">Challenges</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {userStats.projectsCompleted}
            </div>
            <div className="text-xs text-gray-400">Projects</div>
          </div>
          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {userStats.streak}
            </div>
            <div className="text-xs text-gray-400">Day Streak</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {userStats.hoursLearned}
            </div>
            <div className="text-xs text-gray-400">Hours</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Level Progress</h3>
            <div className="text-sm text-gray-400">
              {userStats.totalXP % 1000}/1000 XP to level {userStats.level + 1}
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
                  onClick={() =>
                    setActiveTab(
                      tab.id as
                        | "overview"
                        | "achievements"
                        | "skills"
                        | "settings"
                    )
                  }
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
                  {[
                    {
                      action: "Completed",
                      item: "Array Rotation Challenge",
                      time: "2 hours ago",
                      xp: 150,
                      icon: "💻",
                    },
                    {
                      action: "Unlocked",
                      item: "Speed Demon Achievement",
                      time: "1 day ago",
                      xp: 500,
                      icon: "🏆",
                    },
                    {
                      action: "Finished",
                      item: "React Todo App Project",
                      time: "3 days ago",
                      xp: 800,
                      icon: "🚀",
                    },
                    {
                      action: "Solved",
                      item: "Binary Search Quiz",
                      time: "1 week ago",
                      xp: 200,
                      icon: "🧠",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 bg-dark-300/40 rounded-lg"
                    >
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {activity.action}{" "}
                          <span className="text-[#28c7f9]">
                            {activity.item}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {activity.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">
                          +{activity.xp} XP
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Streak */}
              <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-2">🔥</span>
                  Learning Streak
                </h3>

                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text mb-2">
                    {userStats.streak}
                  </div>
                  <div className="text-gray-400">Days in a row</div>
                </div>

                {/* Streak Calendar */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {Array.from({ length: 35 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs ${
                        i < userStats.streak
                          ? "bg-gradient-to-br from-orange-400 to-red-500 text-white"
                          : "bg-dark-300/40 text-gray-500"
                      }`}
                    >
                      {35 - i}
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button className="px-6 py-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg text-white font-bold hover:scale-105 transition-transform">
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

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative ${
                      achievement.isLocked ? "opacity-50" : ""
                    }`}
                  >
                    <div
                      className={`bg-gradient-to-br ${getRarityColor(
                        achievement.rarity
                      )} p-0.5 rounded-xl`}
                    >
                      <div className="bg-dark-200/90 backdrop-blur-sm rounded-xl p-6 h-full">
                        <div className="text-center">
                          <div className="text-4xl mb-4">
                            {achievement.isLocked ? "🔒" : achievement.icon}
                          </div>
                          <h3 className="font-bold text-white mb-2">
                            {achievement.name}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4">
                            {achievement.description}
                          </p>

                          <div
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${getRarityColor(
                              achievement.rarity
                            )} text-dark-100`}
                          >
                            {achievement.rarity.toUpperCase()}
                          </div>

                          {!achievement.isLocked && (
                            <div className="text-xs text-gray-500">
                              Unlocked{" "}
                              {new Date(
                                achievement.unlockedAt
                              ).toLocaleDateString()}
                            </div>
                          )}
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
                  🎯 Skill Mastery
                </h2>
                <p className="text-gray-400">
                  Track your expertise across different technologies
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{skill.icon}</div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {skill.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Level {skill.level}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">
                          {skill.xp}/{skill.maxXp}
                        </div>
                        <div className="text-xs text-gray-400">XP</div>
                      </div>
                    </div>

                    <div className="w-full bg-dark-300 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${(skill.xp / skill.maxXp) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Level {skill.level}</span>
                      <span>Level {skill.level + 1}</span>
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
                <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userInfo.name}
                        className="w-full bg-dark-300/60 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c7f9]/50"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={userInfo.bio}
                        rows={3}
                        className="w-full bg-dark-300/60 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c7f9]/50"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={userInfo.location}
                        className="w-full bg-dark-300/60 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c7f9]/50"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Social Links
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        GitHub Username
                      </label>
                      <input
                        type="text"
                        value={userInfo.github}
                        className="w-full bg-dark-300/60 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c7f9]/50"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        LinkedIn Username
                      </label>
                      <input
                        type="text"
                        value={userInfo.linkedin}
                        className="w-full bg-dark-300/60 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#28c7f9]/50"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">
                          Email Notifications
                        </div>
                        <div className="text-gray-400 text-sm">
                          Receive updates about your progress
                        </div>
                      </div>
                      <button className="w-12 h-6 bg-[#28c7f9] rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
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
                      <button className="w-12 h-6 bg-[#28c7f9] rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
