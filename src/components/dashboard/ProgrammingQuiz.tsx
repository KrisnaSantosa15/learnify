"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  technology: string;
  type: string;
  xpReward: number;
  timeLimit: number;
  prompt?: string;
  starterCode?: string;
  solution?: string;
  testCases?: {
    tests?: Array<{ input: unknown; expected: unknown; description?: string }>;
  }; // JSON field from database
  hints?: string[];
}

// JavaScript-focused coding challenges
const fallbackChallenges: Challenge[] = [
  {
    id: "1",
    title: "Sum of Array Elements",
    description: "Calculate the sum of all numbers in an array",
    difficulty: "Easy",
    technology: "JavaScript",
    type: "coding",
    xpReward: 100,
    timeLimit: 300,
    prompt:
      "Write a function that takes an array of numbers and returns the sum of all elements.",
    starterCode: `function sumArray(numbers) {
  // Write your solution here
  
}

// Test your function
console.log(sumArray([1, 2, 3, 4, 5])); // Should output: 15
console.log(sumArray([10, -5, 3])); // Should output: 8`,
    solution: `function sumArray(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}`,
    testCases: {
      tests: [
        {
          input: [1, 2, 3, 4, 5],
          expected: 15,
          description: "Basic positive numbers",
        },
        {
          input: [10, -5, 3],
          expected: 8,
          description: "Mixed positive and negative",
        },
        { input: [], expected: 0, description: "Empty array" },
        { input: [0, 0, 0], expected: 0, description: "Array of zeros" },
      ],
    },
    hints: [
      "You can use a for loop to iterate through the array",
      "The reduce() method is perfect for this type of operation",
      "Don't forget to handle the case when the array is empty",
    ],
  },
  {
    id: "2",
    title: "Find Maximum Number",
    description: "Find the largest number in an array",
    difficulty: "Easy",
    technology: "JavaScript",
    type: "coding",
    xpReward: 120,
    timeLimit: 300,
    prompt:
      "Write a function that finds and returns the largest number in an array.",
    starterCode: `function findMax(numbers) {
  // Write your solution here
  
}

// Test your function
console.log(findMax([1, 5, 3, 9, 2])); // Should output: 9
console.log(findMax([-1, -5, -3])); // Should output: -1`,
    solution: `function findMax(numbers) {
  return Math.max(...numbers);
}`,
    testCases: {
      tests: [
        { input: [1, 5, 3, 9, 2], expected: 9, description: "Mixed numbers" },
        {
          input: [-1, -5, -3],
          expected: -1,
          description: "All negative numbers",
        },
        { input: [42], expected: 42, description: "Single element" },
      ],
    },
    hints: [
      "You can use Math.max() with the spread operator",
      "Or use a for loop to compare each element",
      "Remember to handle arrays with negative numbers correctly",
    ],
  },
  {
    id: "3",
    title: "Reverse String",
    description: "Reverse a string without using built-in reverse method",
    difficulty: "Easy",
    technology: "JavaScript",
    type: "coding",
    xpReward: 110,
    timeLimit: 300,
    prompt:
      "Write a function that reverses a string without using the built-in reverse() method.",
    starterCode: `function reverseString(str) {
  // Write your solution here
  
}

// Test your function
console.log(reverseString("hello")); // Should output: "olleh"
console.log(reverseString("JavaScript")); // Should output: "tpircSavaJ"`,
    solution: `function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}`,
    testCases: {
      tests: [
        { input: "hello", expected: "olleh", description: "Simple word" },
        {
          input: "JavaScript",
          expected: "tpircSavaJ",
          description: "Longer word",
        },
        { input: "a", expected: "a", description: "Single character" },
        { input: "", expected: "", description: "Empty string" },
      ],
    },
    hints: [
      "You can use a for loop starting from the last character",
      "Try building the reversed string character by character",
      "Another approach is to use recursion",
    ],
  },
];

export default function ProgrammingQuiz() {
  const { data: session } = useSession();
  const [feedback, setFeedback] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCode, setUserCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  // Load challenges from database
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/challenges");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Ensure challenges is an array
        if (
          data &&
          Array.isArray(data.challenges) &&
          data.challenges.length > 0
        ) {
          setChallenges(data.challenges);
        } else {
          console.warn(
            "No challenges found in database, using fallback challenges"
          );
          setChallenges(fallbackChallenges);
        }
      } catch (err) {
        console.error("Error fetching challenges:", err);
        // Use fallback challenges if API fails
        setChallenges(fallbackChallenges);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Initialize starter code when challenge changes
  useEffect(() => {
    const currentChallenge =
      challenges[currentQuestionIndex] || fallbackChallenges[0];
    if (currentChallenge) {
      setUserCode(
        currentChallenge.starterCode || "// Write your solution here\n"
      );
    }
  }, [challenges, currentQuestionIndex]);

  // JavaScript-focused coding challenges

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode).then(() => {
      // Could add a toast notification here
    });
  };

  const handleSubmitCode = async () => {
    if (!userCode.trim()) return;

    setIsSubmitting(true);
    setFeedback("");

    try {
      // Simulate code execution/validation
      // In a real app, this would send code to a backend for execution
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simple validation - check if code contains key elements
      const hasFunction =
        userCode.includes("function") || userCode.includes("=>");
      const hasReturn = userCode.includes("return");

      if (hasFunction && hasReturn) {
        setFeedback("Great job! Your solution looks correct. Keep coding!");

        // Award XP (in a real app, this would be sent to backend)
        if (session?.user) {
          // TODO: Update user XP with NextAuth
        }
      } else {
        setFeedback(
          "Your solution needs some work. Make sure you have a function that returns a value."
        );
      }
    } catch {
      setFeedback("Error executing code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
    const currentChallenge = getCurrentChallenge();
    if (
      currentChallenge?.hints &&
      currentHintIndex < currentChallenge.hints.length - 1
    ) {
      setCurrentHintIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % getTotalChallenges());
    resetState();
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) =>
      prev === 0 ? getTotalChallenges() - 1 : prev - 1
    );
    resetState();
  };

  const resetState = () => {
    setFeedback("");
    setShowHint(false);
    setCurrentHintIndex(0);
  };

  const getCurrentChallenge = () => {
    return challenges[currentQuestionIndex] || fallbackChallenges[0];
  };

  const getTotalChallenges = () => {
    return challenges.length || fallbackChallenges.length;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-dark-300/40 to-dark-200/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Programming Challenges
              </h2>
              <p className="text-gray-400 text-sm">Loading challenges...</p>
            </div>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8e5ff5] mb-4"></div>
              <p className="text-gray-400">Loading programming challenges...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-dark-300/40 to-dark-200/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-8">
        {/* Header with motivational elements */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Programming Challenges
            </h2>
            <p className="text-gray-400 text-sm">
              Challenge {currentQuestionIndex + 1} of {getTotalChallenges()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] px-4 py-2 rounded-full">
              <span className="text-white font-semibold text-sm">
                🔥 Streak: 7
              </span>
            </div>
          </div>
        </div>

        {/* Challenge Info */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              {getCurrentChallenge()?.title}
            </h3>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getCurrentChallenge()?.difficulty === "Easy"
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : getCurrentChallenge()?.difficulty === "Medium"
                    ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {getCurrentChallenge()?.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-sm font-medium">
                {getCurrentChallenge()?.xpReward} XP
              </span>
            </div>
          </div>

          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            {getCurrentChallenge()?.description}
          </p>

          {/* Problem Statement */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
            <h4 className="text-white font-medium mb-2">📝 Problem:</h4>
            <p className="text-gray-300 leading-relaxed">
              {getCurrentChallenge()?.prompt}
            </p>
          </div>

          {/* Test Cases */}
          {getCurrentChallenge()?.testCases?.tests && (
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-400/30 rounded-xl p-4 mb-6">
              <h4 className="text-white font-medium mb-3">🧪 Test Cases:</h4>
              <div className="space-y-2">
                {getCurrentChallenge()?.testCases?.tests?.map(
                  (testCase, index) => (
                    <div key={index} className="bg-dark-200/40 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">
                          {testCase.description}
                        </span>
                      </div>
                      <div className="mt-2 font-mono text-sm">
                        <span className="text-blue-300">Input:</span>{" "}
                        <span className="text-gray-300">
                          {JSON.stringify(testCase.input)}
                        </span>
                        <span className="text-green-300 ml-4">Expected:</span>{" "}
                        <span className="text-gray-300">
                          {JSON.stringify(testCase.expected)}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Code Editor */}
          <div className="bg-dark-300/80 border border-gray-600/50 rounded-xl overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-3 bg-dark-200/50 border-b border-gray-600/30">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-gray-400 text-sm font-mono">
                  solution.js
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 text-xs rounded-md transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy</span>
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full h-64 bg-transparent text-gray-300 font-mono text-sm resize-none outline-none leading-relaxed"
                placeholder="Write your solution here..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Hints */}
          {showHint && getCurrentChallenge()?.hints && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-xl p-4 mb-6">
              <h4 className="text-white font-medium mb-2">💡 Hint:</h4>
              <p className="text-gray-300 leading-relaxed">
                {getCurrentChallenge()?.hints?.[currentHintIndex]}
              </p>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-4 rounded-xl border-2 mb-6 ${
                feedback.includes("Great job") || feedback.includes("Correct")
                  ? "bg-green-500/20 border-green-500/40 text-green-200"
                  : "bg-orange-500/20 border-orange-500/40 text-orange-200"
              }`}
            >
              <p className="font-medium">{feedback}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              onClick={handlePrevious}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Previous</span>
            </button>

            <button
              onClick={handleShowHint}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-300 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span>View Hint</span>
            </button>

            <button
              onClick={handleSkip}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 9l3 3-3 3m-4-6l3 3-3 3"
                />
              </svg>
              <span>Skip</span>
            </button>
          </div>

          <button
            onClick={handleSubmitCode}
            disabled={isSubmitting || !userCode.trim()}
            className={`flex items-center space-x-2 px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
              isSubmitting || !userCode.trim()
                ? "bg-gray-600/30 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] hover:from-[#28c7f9]/90 hover:to-[#8e5ff5]/90 text-white transform hover:scale-105 shadow-lg"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a1 1 0 001 1h4M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1"
                  />
                </svg>
                <span>Submit Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
