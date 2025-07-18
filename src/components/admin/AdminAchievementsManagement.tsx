"use client";

import React, { useState, useEffect } from "react";
import {
  FiAward,
  FiTarget,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiUsers,
  FiZap,
  FiDownload,
  FiX,
  FiSave,
  FiCheck,
  FiHelpCircle,
  FiBookOpen,
  FiTrendingUp,
  FiClock,
  FiStar,
} from "react-icons/fi";

// Achievement Types and Interfaces
type AchievementRarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
type AchievementCategory =
  | "XP"
  | "QUIZ"
  | "STREAK"
  | "COURSE"
  | "SOCIAL"
  | "SPECIAL";
type CriteriaType =
  | "XP_EARNED"
  | "QUIZ_COMPLETED"
  | "DAILY_STREAK"
  | "COURSE_COMPLETED"
  | "PERFECT_SCORE"
  | "LOGIN_STREAK";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  category: string;
  criteria: Record<string, unknown>;
  xpReward: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userCount?: number;
  completionRate?: number;
  users?: Array<Record<string, unknown>>;
}

interface CreateAchievementData {
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  criteriaType: CriteriaType;
  criteriaValue: number;
  criteriaCondition?: string;
  xpReward: number;
  isActive: boolean;
}

interface AchievementTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  criteriaType: CriteriaType;
  criteriaValue: number;
  xpReward: number;
  tags: string[];
}

// Predefined templates for common achievements
const achievementTemplates: AchievementTemplate[] = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first quiz",
    icon: "🎯",
    rarity: "COMMON",
    category: "QUIZ",
    criteriaType: "QUIZ_COMPLETED",
    criteriaValue: 1,
    xpReward: 25,
    tags: ["beginner", "quiz", "milestone"],
  },
  {
    id: "knowledge-seeker",
    title: "Knowledge Seeker",
    description: "Earn 1000 XP points",
    icon: "⭐",
    rarity: "RARE",
    category: "XP",
    criteriaType: "XP_EARNED",
    criteriaValue: 1000,
    xpReward: 100,
    tags: ["xp", "milestone", "progress"],
  },
  {
    id: "quiz-master",
    title: "Quiz Master",
    description: "Complete 50 quizzes successfully",
    icon: "🏆",
    rarity: "EPIC",
    category: "QUIZ",
    criteriaType: "QUIZ_COMPLETED",
    criteriaValue: 50,
    xpReward: 500,
    tags: ["quiz", "master", "dedication"],
  },
  {
    id: "streak-warrior",
    title: "Streak Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    rarity: "RARE",
    category: "STREAK",
    criteriaType: "DAILY_STREAK",
    criteriaValue: 7,
    xpReward: 200,
    tags: ["streak", "consistency", "habit"],
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Score 100% on 5 different quizzes",
    icon: "💎",
    rarity: "LEGENDARY",
    category: "QUIZ",
    criteriaType: "PERFECT_SCORE",
    criteriaValue: 5,
    xpReward: 1000,
    tags: ["perfect", "elite", "mastery"],
  },
  {
    id: "course-champion",
    title: "Course Champion",
    description: "Complete 10 full courses",
    icon: "📚",
    rarity: "EPIC",
    category: "COURSE",
    criteriaType: "COURSE_COMPLETED",
    criteriaValue: 10,
    xpReward: 750,
    tags: ["course", "completion", "dedication"],
  },
];

// Common emoji icons for achievements
const iconSuggestions = [
  "🏆",
  "⭐",
  "🎯",
  "🔥",
  "💎",
  "📚",
  "🎖️",
  "🥇",
  "🥈",
  "🥉",
  "🎓",
  "💪",
  "🚀",
  "⚡",
  "🌟",
  "🎊",
  "🎉",
  "🔑",
  "👑",
  "🏅",
  "🎪",
  "🎨",
  "🎵",
  "🎬",
  "🎮",
  "🧠",
  "💡",
  "🔮",
  "🎲",
  "🎯",
];

export default function AdminAchievementsManagement() {
  // State management
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRarity, setFilterRarity] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);
  const [formData, setFormData] = useState<CreateAchievementData>({
    title: "",
    description: "",
    icon: "🏆",
    rarity: "COMMON",
    category: "XP",
    criteriaType: "XP_EARNED",
    criteriaValue: 100,
    xpReward: 100,
    isActive: true,
  });

  // Helper functions
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "🏆",
      rarity: "COMMON",
      category: "XP",
      criteriaType: "XP_EARNED",
      criteriaValue: 100,
      xpReward: 100,
      isActive: true,
    });
  };

  const applyTemplate = (template: AchievementTemplate) => {
    setFormData({
      title: template.title,
      description: template.description,
      icon: template.icon,
      category: template.category,
      rarity: template.rarity,
      xpReward: template.xpReward,
      criteriaType: template.criteriaType,
      criteriaValue: template.criteriaValue,
      criteriaCondition: "",
      isActive: true,
    });
    setShowTemplateModal(false);
    setShowCreateModal(true);
  };

  // Fetch achievements from API
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/achievements");
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements);
      } else {
        console.error("Failed to fetch achievements");
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new achievement
  const createAchievement = async () => {
    try {
      const achievementData = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        rarity: formData.rarity,
        category: formData.category,
        criteria: {
          type: formData.criteriaType,
          value: formData.criteriaValue,
          condition: formData.criteriaCondition || undefined,
        },
        xpReward: formData.xpReward,
        isActive: formData.isActive,
      };

      const response = await fetch("/api/admin/achievements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(achievementData),
      });

      if (response.ok) {
        const data = await response.json();
        setAchievements((prev) => [data.achievement, ...prev]);
        setShowCreateModal(false);
        resetForm();
      } else {
        console.error("Failed to create achievement");
      }
    } catch (error) {
      console.error("Error creating achievement:", error);
    }
  };

  // Update achievement
  const updateAchievement = async () => {
    if (!editingAchievement) return;

    try {
      const achievementData = {
        id: editingAchievement.id,
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        rarity: formData.rarity,
        category: formData.category,
        criteria: {
          type: formData.criteriaType,
          value: formData.criteriaValue,
          condition: formData.criteriaCondition || undefined,
        },
        xpReward: formData.xpReward,
        isActive: formData.isActive,
      };

      const response = await fetch("/api/admin/achievements", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(achievementData),
      });

      if (response.ok) {
        const data = await response.json();
        setAchievements((prev) =>
          prev.map((a) =>
            a.id === editingAchievement.id ? data.achievement : a
          )
        );
        setEditingAchievement(null);
        resetForm();
        setShowCreateModal(false);
      } else {
        console.error("Failed to update achievement");
      }
    } catch (error) {
      console.error("Error updating achievement:", error);
    }
  };

  // Delete achievement
  const deleteAchievement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    try {
      const response = await fetch(`/api/admin/achievements?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAchievements((prev) => prev.filter((a) => a.id !== id));
      } else {
        console.error("Failed to delete achievement");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  // Handle edit
  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    const criteria = achievement.criteria as {
      type?: string;
      value?: number;
      condition?: string;
    };
    setFormData({
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      rarity: achievement.rarity,
      category: achievement.category as AchievementCategory,
      criteriaType: (criteria.type as CriteriaType) || "XP_EARNED",
      criteriaValue: criteria.value || 100,
      criteriaCondition: criteria.condition || "",
      xpReward: achievement.xpReward,
      isActive: achievement.isActive,
    });
    setShowCreateModal(true);
  };

  // Handle form submit
  const handleSubmit = () => {
    if (editingAchievement) {
      updateAchievement();
    } else {
      createAchievement();
    }
  };

  // Load achievements on component mount
  useEffect(() => {
    fetchAchievements();
  }, []);

  // Filter achievements
  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch =
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity =
      filterRarity === "all" || achievement.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  // Get rarity color
  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case "COMMON":
        return "text-gray-600 bg-gray-100";
      case "UNCOMMON":
        return "text-green-600 bg-green-100";
      case "RARE":
        return "text-blue-600 bg-blue-100";
      case "EPIC":
        return "text-purple-600 bg-purple-100";
      case "LEGENDARY":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Export achievements
  const exportAchievements = () => {
    const dataStr = JSON.stringify(achievements, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `achievements-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalUsers = achievements.reduce(
    (sum, a) => sum + (a.userCount || 0),
    0
  );
  const totalXPRewards = achievements.reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-xl border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-3 rounded-xl shadow-lg">
                <FiAward className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Achievement Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Create and manage user achievements and rewards
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={exportAchievements}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FiDownload className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setEditingAchievement(null);
                  setShowTemplateModal(true);
                }}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Create Achievement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Achievements
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {achievements.length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <FiTarget className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Achievements
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {achievements.filter((a) => a.isActive).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <FiCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Unlocks
                </p>
                <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total XP Rewards
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalXPRewards.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <FiZap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm text-gray-900 placeholder-gray-500"
              />
            </div>
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="px-6 py-4 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm text-gray-900"
            >
              <option value="all">All Rarities</option>
              <option value="COMMON">Common</option>
              <option value="UNCOMMON">Uncommon</option>
              <option value="RARE">Rare</option>
              <option value="EPIC">Epic</option>
              <option value="LEGENDARY">Legendary</option>
            </select>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{filteredAchievements.length} achievements</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {achievement.title}
                        </h3>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(
                            achievement.rarity
                          )}`}
                        >
                          {achievement.rarity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(achievement)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAchievement(achievement.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {achievement.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiZap className="w-4 h-4" />
                        <span>{achievement.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUsers className="w-4 h-4" />
                        <span>{achievement.userCount || 0}</span>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        achievement.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {achievement.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Choose Achievement Template
                </h2>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Start with a pre-designed template or create from scratch
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {achievementTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{template.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-yellow-700">
                          {template.title}
                        </h3>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(
                            template.rarity
                          )}`}
                        >
                          {template.rarity}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{template.category}</span>
                      <span>{template.xpReward} XP</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setShowCreateModal(true);
                  }}
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-yellow-400 hover:text-yellow-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FiPlus className="w-5 h-5" />
                  Create from Scratch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingAchievement
                      ? "Edit Achievement"
                      : "Create New Achievement"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Design meaningful achievements to motivate and reward your
                    users
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingAchievement(null);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiEdit2 className="w-5 h-5 text-blue-600" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Achievement Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Quiz Master, Learning Streak"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Icon *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({ ...formData, icon: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900 placeholder-gray-500 pr-12"
                        placeholder="🏆"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl">
                        {formData.icon}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {iconSuggestions.slice(0, 10).map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon })}
                          className="p-2 text-lg hover:bg-yellow-100 rounded-lg transition-colors"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Describe what users need to do to earn this achievement..."
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Achievement Properties */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiAward className="w-5 h-5 text-purple-600" />
                  Achievement Properties
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as AchievementCategory,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                    >
                      <option value="XP">XP & Progress</option>
                      <option value="QUIZ">Quiz Completion</option>
                      <option value="STREAK">Learning Streaks</option>
                      <option value="COURSE">Course Completion</option>
                      <option value="SOCIAL">Social Engagement</option>
                      <option value="SPECIAL">Special Events</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Rarity *
                    </label>
                    <select
                      value={formData.rarity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rarity: e.target.value as AchievementRarity,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                    >
                      <option value="COMMON">Common (Easy to earn)</option>
                      <option value="UNCOMMON">
                        Uncommon (Moderate effort)
                      </option>
                      <option value="RARE">Rare (Significant effort)</option>
                      <option value="EPIC">Epic (Major milestone)</option>
                      <option value="LEGENDARY">Legendary (Exceptional)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      XP Reward *
                    </label>
                    <input
                      type="number"
                      value={formData.xpReward}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          xpReward: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="100"
                      min="1"
                      max="10000"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Suggested: Common (25-100), Rare (200-500), Epic
                      (500-1000), Legendary (1000+)
                    </p>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiTarget className="w-5 h-5 text-green-600" />
                  Requirements
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Requirement Type *
                    </label>
                    <select
                      value={formData.criteriaType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          criteriaType: e.target.value as CriteriaType,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900"
                    >
                      <option value="XP_EARNED">Total XP Earned</option>
                      <option value="QUIZ_COMPLETED">Quizzes Completed</option>
                      <option value="DAILY_STREAK">
                        Daily Learning Streak
                      </option>
                      <option value="COURSE_COMPLETED">
                        Courses Completed
                      </option>
                      <option value="PERFECT_SCORE">Perfect Quiz Scores</option>
                      <option value="LOGIN_STREAK">Login Streak</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Target Value *
                    </label>
                    <input
                      type="number"
                      value={formData.criteriaValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          criteriaValue: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="e.g., 1000, 5, 7"
                      min="1"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.criteriaType === "XP_EARNED" &&
                        "Amount of XP points to earn"}
                      {formData.criteriaType === "QUIZ_COMPLETED" &&
                        "Number of quizzes to complete"}
                      {formData.criteriaType === "DAILY_STREAK" &&
                        "Consecutive days of activity"}
                      {formData.criteriaType === "COURSE_COMPLETED" &&
                        "Number of courses to complete"}
                      {formData.criteriaType === "PERFECT_SCORE" &&
                        "Number of 100% quiz scores"}
                      {formData.criteriaType === "LOGIN_STREAK" &&
                        "Consecutive days of login"}
                    </p>
                  </div>
                </div>

                {formData.criteriaCondition && (
                  <div className="mt-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Additional Condition
                    </label>
                    <input
                      type="text"
                      value={formData.criteriaCondition}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          criteriaCondition: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Optional additional requirements"
                    />
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiZap className="w-5 h-5 text-orange-600" />
                  Settings
                </h3>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Active Achievement
                    </h4>
                    <p className="text-sm text-gray-600">
                      Users can earn this achievement when active
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, isActive: !formData.isActive })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingAchievement(null);
                  resetForm();
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                {editingAchievement ? "Update" : "Create"} Achievement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
