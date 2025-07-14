"use client";

import React, { useState, useEffect } from "react";
import AdvancedCodeEditor from "../AdvancedCodeEditor";

interface SpeedChallenge {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  basePoints: number;
  code: string;
  solution: string;
  hints: string[];
  difficulty: string;
  category: string;
  expectedOutput?: string;
  startingCode?: string;
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
      timeLimit: 180,
      basePoints: 100,
      code: `function reverseString(str) {
  // Your code here
  
}`,
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
  };

  const handleTimeUp = () => {
    setIsRunning(false);
    setIsCompleted(true);
  };

  const submitSolution = () => {
    if (!selectedChallenge) return;
    setIsRunning(false);
    setIsCompleted(true);
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
  };

  const showHint = () => {
    if (!selectedChallenge || hintsUsed >= selectedChallenge.hints.length)
      return;
    setHintsUsed(hintsUsed + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
        </div>

        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {challenge.title}
                  </h4>
                  <p className="text-gray-400 mb-4">{challenge.description}</p>
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
    <div className="max-w-7xl mx-auto">
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
                  timeLeft <= 30 ? "text-red-400" : "text-[#28c7f9]"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-400">Time Left</div>
            </div>
            <button
              onClick={resetChallenge}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white text-sm transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Hints Section - Above Code Editor */}
      {hintsUsed > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-yellow-400 text-xl">💡</span>
            <h4 className="text-lg font-bold text-yellow-400">
              Available Hints ({hintsUsed}/{selectedChallenge.hints.length})
            </h4>
          </div>
          <div className="space-y-3">
            {selectedChallenge.hints.slice(0, hintsUsed).map((hint, index) => (
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

      {/* Code Editor */}
      <AdvancedCodeEditor
        code={userCode}
        onChange={setUserCode}
        language="javascript"
        height="600px"
        title={selectedChallenge.title}
        onSubmit={submitSolution}
        onHint={
          hintsUsed < selectedChallenge.hints.length ? showHint : undefined
        }
        hints={selectedChallenge.hints}
        hintsUsed={hintsUsed}
        readOnly={!isRunning}
        isCompleted={isCompleted}
        onReset={() => setUserCode(selectedChallenge.code)}
      />

      {/* Solution Display */}
      {isCompleted && (
        <div className="mt-6 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 backdrop-blur-sm border border-green-400/20 rounded-xl p-6">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="text-2xl mr-3">🏆</span>
            Solution Revealed
          </h4>
          <div className="bg-dark-300/80 border border-green-400/20 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-dark-200/50 border-b border-green-400/10">
              <span className="text-gray-400 text-sm font-mono">
                solution.js
              </span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(selectedChallenge.solution)
                }
                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <pre className="p-6 text-sm text-gray-300 font-mono overflow-x-auto">
              <code>{selectedChallenge.solution}</code>
            </pre>
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
  );
}
