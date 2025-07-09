"use client";

import React, { useState } from "react";

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  total: number;
  completed: boolean;
  icon: string;
  deadline?: string;
}

export default function DailyQuests() {
  const [showCompleted, setShowCompleted] = useState(false);

  // Mock data for daily quests
  const quests: Quest[] = [
    {
      id: "1",
      title: "Complete a Lesson",
      description: "Finish one full JavaScript lesson",
      xpReward: 20,
      progress: 0,
      total: 1,
      completed: false,
      icon: "📚",
      deadline: "Today",
    },
    {
      id: "2",
      title: "Daily Quiz",
      description: "Answer 5 quiz questions correctly",
      xpReward: 25,
      progress: 3,
      total: 5,
      completed: false,
      icon: "🧠",
      deadline: "Today",
    },
    {
      id: "3",
      title: "Practice Session",
      description: "Complete a practice session with 80% accuracy",
      xpReward: 30,
      progress: 65,
      total: 100,
      completed: false,
      icon: "🎯",
      deadline: "Today",
    },
    {
      id: "4",
      title: "Review Concepts",
      description: "Review previously learned concepts",
      xpReward: 15,
      progress: 1,
      total: 1,
      completed: true,
      icon: "🔄",
    },
  ];

  // Filter quests based on completion state
  const filteredQuests = quests.filter((quest) =>
    showCompleted ? quest.completed : !quest.completed
  );

  return (
    <div className="bg-dark-300/30 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-3 border-b border-white/5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-white flex items-center">
            <svg
              className="w-4 h-4 mr-1.5 text-[#fab72b]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Daily Quests
          </h2>
          <button
            className="text-xs text-[#fab72b] hover:text-white transition-colors"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? "Show Active" : "Show Completed"}
          </button>
        </div>

        {/* Quest timer (for daily refresh) */}
        <div className="flex items-center justify-between bg-dark-200 rounded-lg p-2 border border-white/5">
          <div className="text-xs text-gray-400">Next quests in:</div>
          <div className="text-white font-medium text-sm">07:24:16</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredQuests.map((quest, index) => (
          <div
            key={quest.id}
            className={`p-2.5 ${
              index !== filteredQuests.length - 1
                ? "border-b border-white/5"
                : ""
            } hover:bg-dark-200/50 transition-colors`}
          >
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-lg bg-dark-200 flex items-center justify-center text-lg shrink-0">
                {quest.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-medium text-sm">
                    {quest.title}
                  </h3>
                  <div className="px-1.5 py-0.5 rounded-full bg-[#fab72b]/20 text-[#fab72b] text-xs flex items-center shrink-0 ml-1">
                    <svg
                      className="w-2.5 h-2.5 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    +{quest.xpReward}
                  </div>
                </div>

                <p className="text-gray-400 text-xs mt-0.5 truncate">
                  {quest.description}
                </p>

                {/* Progress bar for incomplete quests */}
                {!quest.completed && (
                  <div className="mt-1.5">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-400 text-[0.7rem]">
                        Progress
                      </span>
                      <span className="text-[#fab72b] text-[0.7rem]">
                        {quest.progress}/{quest.total}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-dark-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#fab72b] rounded-full"
                        style={{
                          width: `${(quest.progress / quest.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                    {quest.deadline && (
                      <div className="mt-1 flex items-center text-[0.7rem] text-gray-400">
                        <svg
                          className="w-2.5 h-2.5 mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Expires: {quest.deadline}
                      </div>
                    )}
                  </div>
                )}

                {/* Completed indicator */}
                {quest.completed && (
                  <div className="flex items-center mt-1 text-[#58c896] text-xs">
                    <svg
                      className="w-3 h-3 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Completed
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredQuests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-dark-200 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <circle cx="15.5" cy="8.5" r="1.5" />
                <path d="M8.5 15a6.5 6.5 0 0 0 7 0" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-white mb-2">
              {showCompleted
                ? "No completed quests yet"
                : "All quests completed!"}
            </h3>
            <p className="text-gray-400 text-xs">
              {showCompleted
                ? "Complete daily quests to see them here"
                : "Great job! Come back later for more quests"}
            </p>
          </div>
        )}
      </div>

      {/* This button stays at the bottom with no excess space */}
      <div className="p-2 mt-auto">
        <button className="w-full py-2 rounded-lg bg-[#fab72b] hover:bg-[#fab72b]/80 text-white font-medium flex items-center justify-center text-sm">
          <svg
            className="w-4 h-4 mr-1.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Claim All Rewards
        </button>
      </div>
    </div>
  );
}
