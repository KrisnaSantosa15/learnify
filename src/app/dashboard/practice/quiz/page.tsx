"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ApiQuiz {
  id: string;
  title: string;
  description?: string;
  difficulty: string;
  category: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
  timeLimit?: number;
  xpReward: number;
  questions?: unknown[];
  _count?: {
    attempts: number;
  };
  randomizeQuestions?: boolean;
  showProgress?: boolean;
  allowRetakes?: boolean;
  showExplanations?: boolean;
  instantFeedback?: boolean;
  certificateEligible?: boolean;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  difficulty: string;
  category: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
  timeLimit?: number;
  xpReward: number;
  questionCount: number;
  attemptCount: number;

  // Advanced settings
  randomizeQuestions: boolean;
  showProgress: boolean;
  allowRetakes: boolean;
  showExplanations: boolean;
  instantFeedback: boolean;
  certificateEligible: boolean;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export default function QuizBrowserPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // Load quizzes and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch quizzes
        const quizParams = new URLSearchParams();
        if (selectedCategory !== "all") {
          quizParams.set("categoryId", selectedCategory);
        }
        if (selectedDifficulty !== "all") {
          quizParams.set("difficulty", selectedDifficulty.toUpperCase());
        }

        const [quizzesResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/quizzes?${quizParams.toString()}`),
          fetch("/api/categories"),
        ]);

        if (!quizzesResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const quizzesData = await quizzesResponse.json();
        const categoriesData = await categoriesResponse.json();

        // Transform quizzes data to match interface
        const transformedQuizzes = (quizzesData.quizzes || quizzesData).map(
          (quiz: ApiQuiz) => ({
            ...quiz,
            questionCount: quiz.questions?.length || 0,
            attemptCount: quiz._count?.attempts || 0,
            // Ensure all settings fields are present with defaults
            randomizeQuestions: quiz.randomizeQuestions ?? false,
            showProgress: quiz.showProgress ?? true,
            allowRetakes: quiz.allowRetakes ?? true,
            showExplanations: quiz.showExplanations ?? true,
            instantFeedback: quiz.instantFeedback ?? false,
            certificateEligible: quiz.certificateEligible ?? false,
          })
        );

        setQuizzes(transformedQuizzes);
        setCategories(categoriesData.categories || categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedDifficulty]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 bg-green-400/20";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20";
      case "advanced":
        return "text-orange-400 bg-orange-400/20";
      case "expert":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "🌱";
      case "intermediate":
        return "⚡";
      case "advanced":
        return "🔥";
      case "expert":
        return "💎";
      default:
        return "📝";
    }
  };

  const handleQuizSelect = (quizId: string) => {
    router.push(`/dashboard/practice/quiz/${quizId}?start=true`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8e5ff5] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quizzes...</p>
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
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-lg text-white font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200">
      {/* Header */}
      <div className="bg-dark-200/60 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8e5ff5] to-[#ff6b9d] bg-clip-text text-transparent">
                  🧠 Quiz Collection
                </h1>
                <p className="text-gray-400 text-sm">
                  Test your knowledge with interactive quizzes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category filter */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8e5ff5] hover:bg-gray-700 appearance-none cursor-pointer"
                style={{
                  colorScheme: "dark",
                  backgroundColor: "#1f2937",
                  color: "#ffffff",
                }}
              >
                <option
                  value="all"
                  style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
                >
                  All Categories
                </option>
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
                  >
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty filter */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8e5ff5] hover:bg-gray-700 appearance-none cursor-pointer"
                style={{
                  colorScheme: "dark",
                  backgroundColor: "#1f2937",
                  color: "#ffffff",
                }}
              >
                <option
                  value="all"
                  style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
                >
                  All Difficulties
                </option>
                <option
                  value="beginner"
                  style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
                >
                  🌱 Beginner
                </option>
                <option
                  value="intermediate"
                  style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
                >
                  ⚡ Intermediate
                </option>
                <option
                  value="advanced"
                  style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
                >
                  🔥 Advanced
                </option>
                <option
                  value="expert"
                  style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
                >
                  💎 Expert
                </option>
              </select>
            </div>

            <div className="flex-1"></div>

            {/* Results count */}
            <div className="text-gray-400 text-sm">
              {quizzes.length} quiz{quizzes.length !== 1 ? "es" : ""} found
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Quizzes Found
            </h3>
            <p className="text-gray-400">
              Try adjusting your filters or check back later for new quizzes.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                onClick={() => handleQuizSelect(quiz.id)}
              >
                {/* Category badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: quiz.category.color
                        ? `${quiz.category.color}20`
                        : "#8e5ff520",
                      color: quiz.category.color || "#8e5ff5",
                    }}
                  >
                    {quiz.category.icon} {quiz.category.name}
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      quiz.difficulty
                    )}`}
                  >
                    {getDifficultyIcon(quiz.difficulty)} {quiz.difficulty}
                  </div>
                </div>

                {/* Quiz info - flexible content area */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#8e5ff5] transition-colors">
                    {quiz.title}
                  </h3>

                  {/* Description with fixed height */}
                  <div className="mb-4 h-12 flex items-start">
                    {quiz.description && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {quiz.description}
                      </p>
                    )}
                  </div>

                  {/* Quiz Settings */}
                  <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
                    {quiz.randomizeQuestions && (
                      <div className="flex items-center gap-1 bg-dark-200/50 px-2 py-1 rounded text-xs text-gray-300">
                        <span>🎲</span>
                        <span>Randomized</span>
                      </div>
                    )}
                    {quiz.showProgress && (
                      <div className="flex items-center gap-1 bg-dark-200/50 px-2 py-1 rounded text-xs text-gray-300">
                        <span>📊</span>
                        <span>Progress</span>
                      </div>
                    )}
                    {quiz.allowRetakes && (
                      <div className="flex items-center gap-1 bg-dark-200/50 px-2 py-1 rounded text-xs text-gray-300">
                        <span>🔄</span>
                        <span>Retakes</span>
                      </div>
                    )}
                    {quiz.showExplanations && (
                      <div className="flex items-center gap-1 bg-dark-200/50 px-2 py-1 rounded text-xs text-gray-300">
                        <span>💡</span>
                        <span>Explanations</span>
                      </div>
                    )}
                    {quiz.instantFeedback && (
                      <div className="flex items-center gap-1 bg-dark-200/50 px-2 py-1 rounded text-xs text-yellow-400">
                        <span>⚡</span>
                        <span>Instant Feedback</span>
                      </div>
                    )}
                    {quiz.certificateEligible && (
                      <div className="flex items-center gap-1 bg-dark-200/50 px-2 py-1 rounded text-xs text-green-400">
                        <span>🏆</span>
                        <span>Certificate</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom section - always at bottom */}
                <div className="mt-auto">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#28c7f9]">
                        {quiz.questionCount}
                      </div>
                      <div className="text-xs text-gray-400">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">
                        +{quiz.xpReward}
                      </div>
                      <div className="text-xs text-gray-400">XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {quiz.attemptCount}
                      </div>
                      <div className="text-xs text-gray-400">Attempts</div>
                    </div>
                  </div>

                  {/* Time limit */}
                  {quiz.timeLimit && (
                    <div className="flex items-center justify-center text-gray-400 text-sm mb-4">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                      {quiz.timeLimit} minute{quiz.timeLimit !== 1 ? "s" : ""}
                    </div>
                  )}

                  {/* Action button */}
                  <div className="text-center">
                    <div className="px-4 py-2 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-lg text-white font-medium text-sm group-hover:scale-105 transition-transform">
                      Start Quiz
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
