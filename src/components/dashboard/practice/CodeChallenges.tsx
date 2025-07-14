"use client";

import React, { useState, useEffect } from "react";
import AdvancedCodeEditor from "../AdvancedCodeEditor";

interface TestResult {
  id: number;
  passed: boolean;
  input: unknown;
  expected: unknown;
  actual: unknown;
}

interface CodeChallengesProps {
  selectedCategory: string;
  selectedDifficulty: string;
}

export default function CodeChallenges({
  selectedCategory,
  selectedDifficulty,
}: CodeChallengesProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const challenges = {
    javascript: {
      beginner: [
        {
          id: 1,
          title: "Array Sum",
          description:
            "Write a function that returns the sum of all numbers in an array.",
          starterCode: `function arraySum(numbers) {
  // Write your code here
  
}`,
          testCases: [
            { input: [1, 2, 3, 4, 5], expected: 15 },
            { input: [0, -1, 5], expected: 4 },
            { input: [], expected: 0 },
          ],
          hints: ["Use a loop or reduce method", "Handle empty arrays"],
          xp: 15,
        },
        {
          id: 2,
          title: "String Reverse",
          description:
            "Create a function that reverses a string without using built-in reverse methods.",
          starterCode: `function reverseString(str) {
  // Write your code here
  
}`,
          testCases: [
            { input: "hello", expected: "olleh" },
            { input: "JavaScript", expected: "tpircSavaJ" },
            { input: "", expected: "" },
          ],
          hints: [
            "Use a loop to iterate backwards",
            "Build the result character by character",
          ],
          xp: 12,
        },
      ],
      intermediate: [
        {
          id: 3,
          title: "Two Sum",
          description:
            "Given an array of integers and a target, return indices of two numbers that add up to target.",
          starterCode: `function twoSum(nums, target) {
  // Write your code here
  
}`,
          testCases: [
            { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
            { input: [[3, 2, 4], 6], expected: [1, 2] },
            { input: [[3, 3], 6], expected: [0, 1] },
          ],
          hints: [
            "Use a hash map for O(n) solution",
            "Store the complement as you iterate",
          ],
          xp: 25,
        },
      ],
    },
    algorithms: {
      intermediate: [
        {
          id: 4,
          title: "Binary Search",
          description:
            "Implement binary search algorithm to find target in sorted array.",
          starterCode: `function binarySearch(arr, target) {
  // Write your code here
  
}`,
          testCases: [
            { input: [[1, 2, 3, 4, 5], 3], expected: 2 },
            { input: [[1, 2, 3, 4, 5], 6], expected: -1 },
            { input: [[1], 1], expected: 0 },
          ],
          hints: [
            "Use left and right pointers",
            "Compare middle element with target",
          ],
          xp: 30,
        },
      ],
    },
  };

  const getCurrentChallenges = () => {
    const categoryData =
      challenges[selectedCategory as keyof typeof challenges];
    if (!categoryData) return [];

    const difficultyData =
      categoryData[selectedDifficulty as keyof typeof categoryData];
    return difficultyData || [];
  };

  const currentChallenges = getCurrentChallenges();
  const challenge = currentChallenges[currentChallenge];

  // Load starter code when challenge changes
  useEffect(() => {
    if (challenge?.starterCode) {
      setUserCode(challenge.starterCode);
    }
  }, [challenge]);

  const runTests = () => {
    if (!challenge) return;

    setIsRunning(true);
    // Simulate test execution
    setTimeout(() => {
      const results = challenge.testCases.map((testCase, index) => ({
        id: index,
        passed: Math.random() > 0.3, // Random for demo
        input: Array.isArray(testCase.input)
          ? testCase.input
          : [testCase.input],
        expected: testCase.expected,
        actual: testCase.expected, // Mock result
      }));
      setTestResults(results);
      setIsRunning(false);
    }, 2000);
  };

  const nextChallenge = () => {
    if (currentChallenge < currentChallenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setUserCode("");
      setTestResults([]);
    }
  };

  React.useEffect(() => {
    if (challenge) {
      setUserCode(challenge.starterCode);
    }
  }, [challenge, selectedCategory, selectedDifficulty]);

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-xl font-bold text-white mb-2">Coming Soon!</h3>
        <p className="text-gray-400">
          Challenges for {selectedCategory} - {selectedDifficulty} are being
          prepared.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Challenge Header */}
      <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {challenge.title}
            </h3>
            <p className="text-gray-300">{challenge.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">
              Challenge {currentChallenge + 1}/{currentChallenges.length}
            </div>
            <div className="text-lg font-bold text-[#28c7f9]">
              +{challenge.xp} XP
            </div>
          </div>
        </div>

        {/* Hints */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="text-sm font-medium text-yellow-300 mb-2">
            💡 Hints:
          </div>
          <ul className="text-sm text-yellow-200 space-y-1">
            {challenge.hints.map((hint, index) => (
              <li key={index}>• {hint}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div>
          <AdvancedCodeEditor
            code={userCode}
            onChange={setUserCode}
            language="javascript"
            height="500px"
            title={challenge.title}
            onSubmit={runTests}
            readOnly={isRunning}
          />
        </div>

        {/* Test Results */}
        <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Test Results</h4>

          {testResults.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">⚡</div>
              <p>Run tests to see results</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-4 rounded-lg border ${
                    result.passed
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">
                      Test Case {result.id + 1}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        result.passed ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {result.passed ? "✅ PASS" : "❌ FAIL"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <div>Input: {JSON.stringify(result.input)}</div>
                    <div>Expected: {JSON.stringify(result.expected)}</div>
                    <div>Actual: {JSON.stringify(result.actual)}</div>
                  </div>
                </div>
              ))}

              {testResults.every((r) => r.passed) && (
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <div className="text-green-300 font-bold">
                    All tests passed!
                  </div>
                  <div className="text-sm text-green-400">
                    +{challenge.xp} XP earned
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Test Cases Preview */}
      <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-4">Test Cases</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {challenge.testCases.map((testCase, index) => (
            <div key={index} className="bg-dark-300/40 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-300 mb-2">
                Case {index + 1}
              </div>
              <div className="text-xs text-gray-400">
                <div>Input: {JSON.stringify(testCase.input)}</div>
                <div>Expected: {JSON.stringify(testCase.expected)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Challenge Button */}
      {testResults.length > 0 && testResults.every((r) => r.passed) && (
        <div className="text-center">
          <button
            onClick={nextChallenge}
            disabled={currentChallenge >= currentChallenges.length - 1}
            className="px-8 py-3 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-xl text-white font-bold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {currentChallenge >= currentChallenges.length - 1
              ? "All Challenges Complete!"
              : "Next Challenge →"}
          </button>
        </div>
      )}
    </div>
  );
}
