"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface SpeedChallenge {
  id: number;
  title: string;
  description: string;
  timeLimit: number; // in seconds
  basePoints: number;
  code: string;
  solution: string;
  hints: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
}

export default function SpeedCoding() {
  const [selectedChallenge, setSelectedChallenge] =
    useState<SpeedChallenge | null>(null);
  const [userCode, setUserCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHints, setShowHints] = useState(false);

  // Load starter code when challenge is selected
  useEffect(() => {
    if (selectedChallenge?.code) {
      setUserCode(selectedChallenge.code);
    }
  }, [selectedChallenge]);

  const challenges: SpeedChallenge[] = [
    {
      id: 1,
      title: "Reverse String",
      description:
        "Write a function that reverses a string without using built-in reverse methods.",
      timeLimit: 180, // 3 minutes
      basePoints: 100,
      code: `function reverseString(str) {
  // Your code here
  
}

// Test cases:
// reverseString("hello") should return "olleh"
// reverseString("JavaScript") should return "tpircSavaJ"`,
      solution: `function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}`,
      hints: [
        "Start from the last character and work backwards",
        "Use a loop to iterate through the string in reverse order",
        "Build the result string character by character",
      ],
      difficulty: "Easy",
      category: "Strings",
    },
    {
      id: 2,
      title: "Find Maximum",
      description:
        "Find the largest number in an array without using Math.max().",
      timeLimit: 120, // 2 minutes
      basePoints: 80,
      code: `function findMax(numbers) {
  // Your code here
  
}

// Test cases:
// findMax([1, 5, 3, 9, 2]) should return 9
// findMax([-1, -5, -3]) should return -1`,
      solution: `function findMax(numbers) {
  if (numbers.length === 0) return undefined;
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}`,
      hints: [
        "Start by assuming the first element is the maximum",
        "Compare each element with your current maximum",
        "Update the maximum when you find a larger value",
      ],
      difficulty: "Easy",
      category: "Arrays",
    },
    {
      id: 3,
      title: "Palindrome Check",
      description:
        "Check if a string is a palindrome (reads the same forwards and backwards).",
      timeLimit: 240, // 4 minutes
      basePoints: 120,
      code: `function isPalindrome(str) {
  // Your code here
  // Ignore case and spaces
  
}

// Test cases:
// isPalindrome("racecar") should return true
// isPalindrome("A man a plan a canal Panama") should return true
// isPalindrome("hello") should return false`,
      solution: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
      hints: [
        "Convert to lowercase and remove non-alphanumeric characters",
        "Compare the string with its reverse",
        "You can use two pointers approach for efficiency",
      ],
      difficulty: "Medium",
      category: "Strings",
    },
    {
      id: 4,
      title: "FizzBuzz",
      description:
        "Print numbers 1-100, but replace multiples of 3 with 'Fizz', multiples of 5 with 'Buzz', and multiples of both with 'FizzBuzz'.",
      timeLimit: 300, // 5 minutes
      basePoints: 90,
      code: `function fizzBuzz() {
  // Your code here
  // Return an array of the results
  
}

// Expected output: [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz", ...]`,
      solution: `function fizzBuzz() {
  const result = [];
  for (let i = 1; i <= 100; i++) {
    if (i % 15 === 0) {
      result.push("FizzBuzz");
    } else if (i % 3 === 0) {
      result.push("Fizz");
    } else if (i % 5 === 0) {
      result.push("Buzz");
    } else {
      result.push(i);
    }
  }
  return result;
}`,
      hints: [
        "Check for multiples of 15 first (both 3 and 5)",
        "Use the modulo operator (%) to check divisibility",
        "Return an array with the results",
      ],
      difficulty: "Easy",
      category: "Logic",
    },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isRunning]);

  const startChallenge = (challenge: SpeedChallenge) => {
    setSelectedChallenge(challenge);
    setUserCode(challenge.code);
    setTimeLeft(challenge.timeLimit);
    setIsRunning(true);
    setIsCompleted(false);
    setHintsUsed(0);
    setShowHints(false);
  };

  const handleTimeUp = () => {
    setIsRunning(false);
    setIsCompleted(true);
  };

  const submitSolution = () => {
    if (!selectedChallenge) return;

    setIsRunning(false);
    setIsCompleted(true);

    // Calculate score based on time remaining and hints used
    const timeBonus = Math.floor((timeLeft / selectedChallenge.timeLimit) * 50);
    const hintPenalty = hintsUsed * 10;
    const finalScore = Math.max(
      0,
      selectedChallenge.basePoints + timeBonus - hintPenalty
    );

    setScore(score + finalScore);
    setStreak(streak + 1);
  };

  const resetChallenge = () => {
    setSelectedChallenge(null);
    setUserCode("");
    setTimeLeft(0);
    setIsRunning(false);
    setIsCompleted(false);
    setHintsUsed(0);
    setShowHints(false);
  };

  const showHint = () => {
    if (!selectedChallenge || hintsUsed >= selectedChallenge.hints.length)
      return;
    setHintsUsed(hintsUsed + 1);
    setShowHints(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-400/10";
      case "Medium":
        return "text-yellow-400 bg-yellow-400/10";
      case "Hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  if (!selectedChallenge) {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold text-white mb-2">Speed Coding</h3>
          <p className="text-gray-400 mb-6">
            Race against time to solve coding challenges and earn bonus points!
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="bg-dark-300/40 rounded-lg p-4">
              <div className="text-lg font-bold text-[#28c7f9]">{score}</div>
              <div className="text-sm text-gray-400">Total Score</div>
            </div>
            <div className="bg-dark-300/40 rounded-lg p-4">
              <div className="text-lg font-bold text-[#8e5ff5]">{streak}</div>
              <div className="text-sm text-gray-400">Streak</div>
            </div>
            <div className="bg-dark-300/40 rounded-lg p-4">
              <div className="text-lg font-bold text-yellow-400">2.5x</div>
              <div className="text-sm text-gray-400">Speed Multiplier</div>
            </div>
          </div>
        </div>

        {/* Challenge List */}
        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-bold text-white">
                      {challenge.title}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium text-[#28c7f9] bg-[#28c7f9]/10">
                      {challenge.category}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">{challenge.description}</p>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">⏱️</span>
                      <span className="text-gray-300">
                        {formatTime(challenge.timeLimit)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">🎯</span>
                      <span className="text-gray-300">
                        {challenge.basePoints} pts
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">💡</span>
                      <span className="text-gray-300">
                        {challenge.hints.length} hints
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => startChallenge(challenge)}
                  className="px-6 py-3 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-xl text-white font-bold hover:scale-105 transition-transform"
                >
                  Start Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Challenge Header */}
      <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {selectedChallenge.title}
            </h3>
            <p className="text-gray-400">{selectedChallenge.description}</p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  timeLeft <= 30
                    ? "text-red-400 animate-pulse"
                    : timeLeft <= 60
                    ? "text-yellow-400"
                    : "text-[#28c7f9]"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-400">Time Left</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-[#8e5ff5]">
                {selectedChallenge.basePoints}
              </div>
              <div className="text-xs text-gray-400">Base Points</div>
            </div>

            <button
              onClick={resetChallenge}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white text-sm transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-300 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeLeft <= 30
                ? "bg-gradient-to-r from-red-500 to-red-400"
                : timeLeft <= 60
                ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                : "bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5]"
            }`}
            style={{
              width: `${(timeLeft / selectedChallenge.timeLimit) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h4 className="text-lg font-bold text-white">Code Editor</h4>
            <div className="flex items-center space-x-3">
              <button
                onClick={showHint}
                disabled={
                  hintsUsed >= selectedChallenge.hints.length || isCompleted
                }
                className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hint ({hintsUsed}/{selectedChallenge.hints.length})
              </button>
              <button
                onClick={submitSolution}
                disabled={!isRunning}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-400 rounded-lg text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>

          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <Editor
              height="384px"
              defaultLanguage="javascript"
              value={userCode}
              onChange={(value) => setUserCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
                contextmenu: false,
                readOnly: isCompleted,
                suggestOnTriggerCharacters: true,
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true,
                },
                parameterHints: {
                  enabled: true,
                },
                autoIndent: "full",
                formatOnType: true,
                formatOnPaste: true,
              }}
            />
          </div>
        </div>

        {/* Hints & Solution */}
        <div className="space-y-6">
          {/* Hints */}
          {showHints && (
            <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="text-yellow-400 mr-2">💡</span>
                Hints
              </h4>
              <div className="space-y-3">
                {selectedChallenge.hints
                  .slice(0, hintsUsed)
                  .map((hint, index) => (
                    <div
                      key={index}
                      className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20"
                    >
                      <div className="text-sm font-medium text-yellow-400 mb-1">
                        Hint {index + 1}:
                      </div>
                      <div className="text-gray-300">{hint}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Solution (shown after completion) */}
          {isCompleted && (
            <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="text-green-400 mr-2">✅</span>
                Solution
              </h4>
              <pre className="bg-dark-300/60 p-4 rounded-lg text-sm text-gray-300 font-mono overflow-x-auto">
                <code>{selectedChallenge.solution}</code>
              </pre>

              {/* Score Breakdown */}
              <div className="mt-6 p-4 bg-gradient-to-r from-[#28c7f9]/10 to-[#8e5ff5]/10 rounded-lg">
                <h5 className="font-bold text-white mb-3">Score Breakdown:</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base Points:</span>
                    <span className="text-white">
                      +{selectedChallenge.basePoints}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Bonus:</span>
                    <span className="text-green-400">
                      +
                      {Math.floor(
                        (timeLeft / selectedChallenge.timeLimit) * 50
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hint Penalty:</span>
                    <span className="text-red-400">-{hintsUsed * 10}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-[#28c7f9]">
                      {Math.max(
                        0,
                        selectedChallenge.basePoints +
                          Math.floor(
                            (timeLeft / selectedChallenge.timeLimit) * 50
                          ) -
                          hintsUsed * 10
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={resetChallenge}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-xl text-white font-bold hover:scale-105 transition-transform"
              >
                Next Challenge
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
