"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// Custom hook to add dropdown styles
const useDropdownStyles = () => {
  useEffect(() => {
    // Create style element for dropdown options
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .custom-dropdown option {
        background-color: #1f2937 !important;
        color: white !important;
        border: none !important;
        padding: 8px 12px !important;
      }
      .custom-dropdown option:checked {
        background-color: #3b82f6 !important;
        color: white !important;
      }
      .custom-dropdown option:hover {
        background-color: #374151 !important;
        color: white !important;
      }
      .custom-dropdown:focus option:checked {
        background-color: #3b82f6 !important;
        color: white !important;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
};

export default function PracticePage() {
  const router = useRouter();

  // Apply custom dropdown styles
  useDropdownStyles();

  const modes = [
    {
      id: "challenges",
      name: "Code Challenges",
      icon: "💻",
      description: "Solve coding problems step by step",
      color: "from-[#28c7f9] to-[#8e5ff5]",
    },
    {
      id: "quiz",
      name: "Knowledge Quiz",
      icon: "🧠",
      description: "Test your theoretical understanding",
      color: "from-[#8e5ff5] to-[#ff6b9d]",
    },
    {
      id: "speedrun",
      name: "Speed Coding",
      icon: "⚡",
      description: "Race against time for bonus XP",
      color: "from-[#ff6b9d] to-[#feca57]",
    },
    {
      id: "projects",
      name: "Mini Projects",
      icon: "🚀",
      description: "Build real applications",
      color: "from-[#feca57] to-[#48dbfb]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#28c7f9] via-[#8e5ff5] to-[#ff6b9d] bg-clip-text text-transparent mb-4">
            Practice Arena
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Sharpen your coding skills with interactive challenges and projects
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                switch (mode.id) {
                  case "challenges":
                    router.push("/dashboard/practice/challenges");
                    break;
                  case "quiz":
                    router.push("/dashboard/practice/quiz");
                    break;
                  case "speedrun":
                    router.push("/dashboard/practice/speedrun");
                    break;
                  case "projects":
                    router.push("/dashboard/practice/projects");
                    break;
                }
              }}
              className="p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 border-white/10 bg-dark-200/60 backdrop-blur-sm hover:border-white/20 group"
            >
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {mode.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-200 group-hover:text-white transition-colors">
                  {mode.name}
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {mode.description}
                </p>
                <div className="mt-4">
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${mode.color} text-white`}
                  >
                    Start Practice →
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Additional Practice Stats */}
        <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-2">
              🎯 Your Practice Journey
            </h3>
            <p className="text-gray-400 mb-6">
              Choose your practice mode above to start coding and level up your
              skills!
            </p>

            <div className="grid md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-dark-300/40 rounded-lg p-4">
                <div className="text-2xl font-bold text-[#28c7f9]">12</div>
                <div className="text-sm text-gray-400">Challenges Solved</div>
              </div>
              <div className="bg-dark-300/40 rounded-lg p-4">
                <div className="text-2xl font-bold text-[#8e5ff5]">8</div>
                <div className="text-sm text-gray-400">Quizzes Completed</div>
              </div>
              <div className="bg-dark-300/40 rounded-lg p-4">
                <div className="text-2xl font-bold text-[#ff6b9d]">5</div>
                <div className="text-sm text-gray-400">Speed Records</div>
              </div>
              <div className="bg-dark-300/40 rounded-lg p-4">
                <div className="text-2xl font-bold text-[#feca57]">2</div>
                <div className="text-sm text-gray-400">Projects Built</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
