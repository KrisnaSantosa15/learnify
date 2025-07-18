"use client";

import React, { useState } from "react";
import {
  FiSettings,
  FiSave,
  FiShield,
  FiMail,
  FiDatabase,
  FiGlobe,
  FiUsers,
  FiZap,
  FiAward,
  FiToggleLeft,
  FiToggleRight,
  FiCheck,
  FiX,
  FiDownload,
  FiCpu,
  FiHardDrive,
} from "react-icons/fi";

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    enableRegistration: boolean;
    requireEmailVerification: boolean;
    enableSocialLogin: boolean;
  };
  security: {
    passwordMinLength: number;
    requireSpecialCharacters: boolean;
    enableTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableCaptcha: boolean;
  };
  gamification: {
    enableAchievements: boolean;
    enableXP: boolean;
    enableStreaks: boolean;
    enableLeaderboards: boolean;
    defaultXPPerQuiz: number;
    streakBonusMultiplier: number;
  };
  notifications: {
    emailNotifications: boolean;
    achievementNotifications: boolean;
    weeklyDigest: boolean;
    marketingEmails: boolean;
    systemAlerts: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    compressionEnabled: boolean;
    analyticsEnabled: boolean;
    errorLogging: boolean;
    performanceMonitoring: boolean;
  };
}

type SettingsSection =
  | "general"
  | "security"
  | "gamification"
  | "notifications"
  | "performance"
  | "system";

export default function AdminSettingsManagement() {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: "Learnify",
      siteDescription: "Interactive Learning Platform",
      siteUrl: "https://learnify.com",
      adminEmail: "admin@learnify.com",
      timezone: "UTC",
      language: "en",
      enableRegistration: true,
      requireEmailVerification: true,
      enableSocialLogin: true,
    },
    security: {
      passwordMinLength: 8,
      requireSpecialCharacters: true,
      enableTwoFactor: false,
      sessionTimeout: 1440, // minutes
      maxLoginAttempts: 5,
      enableCaptcha: true,
    },
    gamification: {
      enableAchievements: true,
      enableXP: true,
      enableStreaks: true,
      enableLeaderboards: true,
      defaultXPPerQuiz: 25,
      streakBonusMultiplier: 1.5,
    },
    notifications: {
      emailNotifications: true,
      achievementNotifications: true,
      weeklyDigest: true,
      marketingEmails: false,
      systemAlerts: true,
    },
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      analyticsEnabled: true,
      errorLogging: true,
      performanceMonitoring: true,
    },
  });

  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // System status data
  const systemStatus = {
    uptime: "7 days, 14 hours",
    totalUsers: 1247,
    activeUsers: 89,
    totalQuizzes: 156,
    systemLoad: 23,
    memoryUsage: 67,
    diskUsage: 45,
    networkStatus: "online",
  };

  const updateSettings = (
    section: keyof SystemSettings,
    key: string,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSaveStatus("saved");
    setLoading(false);

    // Reset status after 3 seconds
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `learnify-settings-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-xl border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <FiSettings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  System Settings
                </h1>
                <p className="text-gray-600 mt-1">
                  Configure platform settings and preferences
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={exportSettings}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FiDownload className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-6 py-2 text-white font-medium rounded-lg transition-all flex items-center gap-2 ${
                  saveStatus === "saved"
                    ? "bg-green-600 hover:bg-green-700"
                    : saveStatus === "error"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : saveStatus === "saved" ? (
                  <FiCheck className="w-4 h-4" />
                ) : saveStatus === "error" ? (
                  <FiX className="w-4 h-4" />
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                {saveStatus === "saving"
                  ? "Saving..."
                  : saveStatus === "saved"
                  ? "Saved!"
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              {[
                { id: "general", label: "General Settings", icon: FiGlobe },
                { id: "security", label: "Security & Privacy", icon: FiShield },
                { id: "gamification", label: "Gamification", icon: FiAward },
                { id: "notifications", label: "Notifications", icon: FiMail },
                { id: "performance", label: "Performance", icon: FiZap },
                { id: "system", label: "System Status", icon: FiDatabase },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as SettingsSection)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* General Settings */}
          {activeSection === "general" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FiGlobe className="w-6 h-6 text-blue-600" />
                  General Settings
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) =>
                        updateSettings("general", "siteName", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={settings.general.siteUrl}
                      onChange={(e) =>
                        updateSettings("general", "siteUrl", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.general.siteDescription}
                      onChange={(e) =>
                        updateSettings(
                          "general",
                          "siteDescription",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={settings.general.adminEmail}
                      onChange={(e) =>
                        updateSettings("general", "adminEmail", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) =>
                        updateSettings("general", "timezone", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    User Registration
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Enable User Registration
                      </h4>
                      <p className="text-sm text-gray-600">
                        Allow new users to create accounts
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "general",
                          "enableRegistration",
                          !settings.general.enableRegistration
                        )
                      }
                      className="relative"
                    >
                      {settings.general.enableRegistration ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Require Email Verification
                      </h4>
                      <p className="text-sm text-gray-600">
                        Users must verify their email before accessing the
                        platform
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "general",
                          "requireEmailVerification",
                          !settings.general.requireEmailVerification
                        )
                      }
                      className="relative"
                    >
                      {settings.general.requireEmailVerification ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Enable Social Login
                      </h4>
                      <p className="text-sm text-gray-600">
                        Allow login with Google, GitHub, etc.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "general",
                          "enableSocialLogin",
                          !settings.general.enableSocialLogin
                        )
                      }
                      className="relative"
                    >
                      {settings.general.enableSocialLogin ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === "security" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FiShield className="w-6 h-6 text-red-600" />
                  Security & Privacy Settings
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="32"
                      value={settings.security.passwordMinLength}
                      onChange={(e) =>
                        updateSettings(
                          "security",
                          "passwordMinLength",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="10080"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        updateSettings(
                          "security",
                          "sessionTimeout",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        updateSettings(
                          "security",
                          "maxLoginAttempts",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Security Options
                  </h3>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Require Special Characters
                      </h4>
                      <p className="text-sm text-gray-600">
                        Passwords must contain special characters
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "security",
                          "requireSpecialCharacters",
                          !settings.security.requireSpecialCharacters
                        )
                      }
                      className="relative"
                    >
                      {settings.security.requireSpecialCharacters ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-gray-600">
                        Enable 2FA for enhanced security
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "security",
                          "enableTwoFactor",
                          !settings.security.enableTwoFactor
                        )
                      }
                      className="relative"
                    >
                      {settings.security.enableTwoFactor ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Enable CAPTCHA
                      </h4>
                      <p className="text-sm text-gray-600">
                        Add CAPTCHA to login and registration forms
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "security",
                          "enableCaptcha",
                          !settings.security.enableCaptcha
                        )
                      }
                      className="relative"
                    >
                      {settings.security.enableCaptcha ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gamification Settings */}
          {activeSection === "gamification" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FiAward className="w-6 h-6 text-yellow-600" />
                  Gamification Settings
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Default XP per Quiz
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={settings.gamification.defaultXPPerQuiz}
                      onChange={(e) =>
                        updateSettings(
                          "gamification",
                          "defaultXPPerQuiz",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Streak Bonus Multiplier
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={settings.gamification.streakBonusMultiplier}
                      onChange={(e) =>
                        updateSettings(
                          "gamification",
                          "streakBonusMultiplier",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Gamification Features
                  </h3>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Enable Achievements
                      </h4>
                      <p className="text-sm text-gray-600">
                        Allow users to earn achievements and badges
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "gamification",
                          "enableAchievements",
                          !settings.gamification.enableAchievements
                        )
                      }
                      className="relative"
                    >
                      {settings.gamification.enableAchievements ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Enable XP System
                      </h4>
                      <p className="text-sm text-gray-600">
                        Users earn experience points for activities
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "gamification",
                          "enableXP",
                          !settings.gamification.enableXP
                        )
                      }
                      className="relative"
                    >
                      {settings.gamification.enableXP ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Enable Learning Streaks
                      </h4>
                      <p className="text-sm text-gray-600">
                        Track consecutive days of learning activity
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "gamification",
                          "enableStreaks",
                          !settings.gamification.enableStreaks
                        )
                      }
                      className="relative"
                    >
                      {settings.gamification.enableStreaks ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Enable Leaderboards
                      </h4>
                      <p className="text-sm text-gray-600">
                        Show user rankings and competitive elements
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "gamification",
                          "enableLeaderboards",
                          !settings.gamification.enableLeaderboards
                        )
                      }
                      className="relative"
                    >
                      {settings.gamification.enableLeaderboards ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === "notifications" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FiMail className="w-6 h-6 text-green-600" />
                  Notification Settings
                </h2>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Email Notifications
                  </h3>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Email Notifications
                      </h4>
                      <p className="text-sm text-gray-600">
                        Send system notifications via email
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "notifications",
                          "emailNotifications",
                          !settings.notifications.emailNotifications
                        )
                      }
                      className="relative"
                    >
                      {settings.notifications.emailNotifications ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Achievement Notifications
                      </h4>
                      <p className="text-sm text-gray-600">
                        Notify users when they earn achievements
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "notifications",
                          "achievementNotifications",
                          !settings.notifications.achievementNotifications
                        )
                      }
                      className="relative"
                    >
                      {settings.notifications.achievementNotifications ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Weekly Digest
                      </h4>
                      <p className="text-sm text-gray-600">
                        Send weekly progress summary emails
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "notifications",
                          "weeklyDigest",
                          !settings.notifications.weeklyDigest
                        )
                      }
                      className="relative"
                    >
                      {settings.notifications.weeklyDigest ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Marketing Emails
                      </h4>
                      <p className="text-sm text-gray-600">
                        Send promotional and marketing content
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "notifications",
                          "marketingEmails",
                          !settings.notifications.marketingEmails
                        )
                      }
                      className="relative"
                    >
                      {settings.notifications.marketingEmails ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        System Alerts
                      </h4>
                      <p className="text-sm text-gray-600">
                        Critical system notifications and alerts
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "notifications",
                          "systemAlerts",
                          !settings.notifications.systemAlerts
                        )
                      }
                      className="relative"
                    >
                      {settings.notifications.systemAlerts ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Settings */}
          {activeSection === "performance" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FiZap className="w-6 h-6 text-purple-600" />
                  Performance Settings
                </h2>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Optimization Features
                  </h3>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Enable Caching
                      </h4>
                      <p className="text-sm text-gray-600">
                        Cache frequently accessed data for better performance
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "performance",
                          "cacheEnabled",
                          !settings.performance.cacheEnabled
                        )
                      }
                      className="relative"
                    >
                      {settings.performance.cacheEnabled ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Enable Compression
                      </h4>
                      <p className="text-sm text-gray-600">
                        Compress responses to reduce bandwidth usage
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "performance",
                          "compressionEnabled",
                          !settings.performance.compressionEnabled
                        )
                      }
                      className="relative"
                    >
                      {settings.performance.compressionEnabled ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Analytics Tracking
                      </h4>
                      <p className="text-sm text-gray-600">
                        Track user behavior and platform usage
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "performance",
                          "analyticsEnabled",
                          !settings.performance.analyticsEnabled
                        )
                      }
                      className="relative"
                    >
                      {settings.performance.analyticsEnabled ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Error Logging
                      </h4>
                      <p className="text-sm text-gray-600">
                        Log application errors for debugging
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "performance",
                          "errorLogging",
                          !settings.performance.errorLogging
                        )
                      }
                      className="relative"
                    >
                      {settings.performance.errorLogging ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Performance Monitoring
                      </h4>
                      <p className="text-sm text-gray-600">
                        Monitor system performance metrics
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings(
                          "performance",
                          "performanceMonitoring",
                          !settings.performance.performanceMonitoring
                        )
                      }
                      className="relative"
                    >
                      {settings.performance.performanceMonitoring ? (
                        <FiToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <FiToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Status */}
          {activeSection === "system" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FiDatabase className="w-6 h-6 text-indigo-600" />
                  System Status & Information
                </h2>

                {/* System Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          System Status
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          Online
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Uptime
                        </p>
                        <p className="text-lg font-bold text-blue-900">
                          {systemStatus.uptime}
                        </p>
                      </div>
                      <FiCpu className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800">
                          Total Users
                        </p>
                        <p className="text-2xl font-bold text-purple-900">
                          {systemStatus.totalUsers.toLocaleString()}
                        </p>
                      </div>
                      <FiUsers className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-800">
                          Active Users
                        </p>
                        <p className="text-2xl font-bold text-orange-900">
                          {systemStatus.activeUsers}
                        </p>
                      </div>
                      <FiZap className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* System Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiCpu className="w-5 h-5" />
                      System Load
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">CPU Usage</span>
                        <span className="font-medium">
                          {systemStatus.systemLoad}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${systemStatus.systemLoad}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiHardDrive className="w-5 h-5" />
                      Memory Usage
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">RAM</span>
                        <span className="font-medium">
                          {systemStatus.memoryUsage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${systemStatus.memoryUsage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiHardDrive className="w-5 h-5" />
                      Disk Usage
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Storage</span>
                        <span className="font-medium">
                          {systemStatus.diskUsage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${systemStatus.diskUsage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent System Activity */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Recent System Activity
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        type: "info",
                        message: "Database backup completed successfully",
                        time: "2 hours ago",
                      },
                      {
                        type: "warning",
                        message: "High memory usage detected (85%)",
                        time: "4 hours ago",
                      },
                      {
                        type: "success",
                        message: "Security patches installed",
                        time: "1 day ago",
                      },
                      {
                        type: "info",
                        message: "System maintenance completed",
                        time: "2 days ago",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            activity.type === "success"
                              ? "bg-green-500"
                              : activity.type === "warning"
                              ? "bg-yellow-500"
                              : activity.type === "error"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {activity.message}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    ))}
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
