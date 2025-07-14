"use client";

import React from "react";
import { useRouter } from "next/navigation";
import KnowledgeQuiz from "@/components/dashboard/practice/KnowledgeQuiz";

export default function QuizPage() {
  const router = useRouter();

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
                <span>Back to Practice</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8e5ff5] to-[#ff6b9d] bg-clip-text text-transparent">
                  🧠 Knowledge Quiz
                </h1>
                <p className="text-gray-400 text-sm">
                  Test your theoretical understanding
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-[#8e5ff5]">15</div>
                <div className="text-xs text-gray-400">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#ff6b9d]">+50</div>
                <div className="text-xs text-gray-400">XP per correct</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <KnowledgeQuiz />
        </div>
      </div>
    </div>
  );
}
