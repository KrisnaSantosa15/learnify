"use client";

import React, { useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";

export default function ProgrammingQuiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Safe syntax highlighting helper
  const highlightCode = (code: string, language: string) => {
    try {
      const grammar = Prism.languages[language] || Prism.languages.javascript;
      return Prism.highlight(code, grammar, language);
    } catch (error) {
      console.warn("Syntax highlighting failed:", error);
      return code; // Fallback to plain text
    }
  };

  // JavaScript-focused quiz questions with improved code presentation
  const javascriptQuestions = [
    {
      question:
        "Which method adds an element to the end of an array in JavaScript?",
      codeBlocks: [
        {
          type: "setup",
          content: `const fruits = ['apple', 'banana', 'orange'];`,
          language: "javascript",
        },
        {
          type: "question",
          content: `// Add 'grape' to the end of the array
fruits.__BLANK__('grape');`,
          language: "javascript",
          highlight: true,
        },
        {
          type: "result",
          content: `console.log(fruits); // Output: ['apple', 'banana', 'orange', 'grape']`,
          language: "javascript",
        },
      ],
      answers: ["push()", "append()", "add()", "insert()"],
      correctAnswer: 0,
      explanation:
        "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
    },
    {
      question:
        "What is the correct way to declare a variable in modern JavaScript?",
      codeBlocks: [
        {
          type: "question",
          content: `// Which is the recommended way to declare a variable?
__BLANK__ myVariable = "Hello World";`,
          language: "javascript",
          highlight: true,
        },
        {
          type: "result",
          content: `console.log(myVariable);`,
          language: "javascript",
        },
      ],
      answers: ["var", "let", "const", "variable"],
      correctAnswer: 1,
      explanation:
        "The 'let' keyword is the modern way to declare variables that can be reassigned. Use 'const' for values that won't change.",
    },
    {
      question: "How do you create a function in JavaScript?",
      codeBlocks: [
        {
          type: "question",
          content: `// Create a function that returns the sum of two numbers
__BLANK__ addNumbers(a, b) {
  return a + b;
}`,
          language: "javascript",
          highlight: true,
        },
        {
          type: "result",
          content: `console.log(addNumbers(5, 3)); // Output: 8`,
          language: "javascript",
        },
      ],
      answers: ["func", "function", "def", "method"],
      correctAnswer: 1,
      explanation:
        "The 'function' keyword is used to declare functions in JavaScript.",
    },
    {
      question: "Which operator is used for strict equality comparison?",
      codeBlocks: [
        {
          type: "setup",
          content: `const x = 5;
const y = "5";`,
          language: "javascript",
        },
        {
          type: "question",
          content: `// Which comparison returns false?
console.log(x __BLANK__ y);`,
          language: "javascript",
          highlight: true,
        },
      ],
      answers: ["==", "===", "!=", "!=="],
      correctAnswer: 1,
      explanation:
        "The === operator checks for strict equality (same value and same type), while == performs type coercion.",
    },
    {
      question: "How do you access the first element of an array?",
      codeBlocks: [
        {
          type: "setup",
          content: `const colors = ['red', 'green', 'blue'];`,
          language: "javascript",
        },
        {
          type: "question",
          content: `// Get the first element
const firstColor = colors__BLANK__;`,
          language: "javascript",
          highlight: true,
        },
        {
          type: "result",
          content: `console.log(firstColor); // Output: 'red'`,
          language: "javascript",
        },
      ],
      answers: ["[1]", "[0]", ".first()", ".get(0)"],
      correctAnswer: 1,
      explanation:
        "Arrays in JavaScript are zero-indexed, so the first element is at index 0.",
    },
    {
      question: "How do you create an object in JavaScript?",
      codeBlocks: [
        {
          type: "question",
          content: `// Create a user object
__BLANK__ user = {
  name: "Alice",
  age: 25,
  city: "New York"
};`,
          language: "javascript",
          highlight: true,
        },
        {
          type: "result",
          content: `console.log(user.name); // Output: "Alice"`,
          language: "javascript",
        },
      ],
      answers: ["var", "let", "const", "object"],
      correctAnswer: 2,
      explanation:
        "Use 'const' for objects that won't be reassigned. The object's properties can still be modified.",
    },
  ];

  const handleCopyCode = () => {
    const completeCode = currentQuiz.codeBlocks
      .map((block) =>
        block.content.replace(
          "__BLANK__",
          currentQuiz.answers[currentQuiz.correctAnswer]
        )
      )
      .join("\n");

    navigator.clipboard.writeText(completeCode).then(() => {
      // Could add a toast notification here
    });
  };

  const currentQuiz = javascriptQuestions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === currentQuiz.correctAnswer) {
      setFeedback("Correct! Great job!");
    } else {
      setFeedback(`Incorrect. ${currentQuiz.explanation}`);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback("");
    // Move to next question or loop back to start
    setCurrentQuestionIndex((prev) => (prev + 1) % javascriptQuestions.length);
  };

  return (
    <div className="bg-gradient-to-br from-dark-300/40 to-dark-200/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-8">
        {/* Header with motivational elements */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              JavaScript Challenge
            </h2>
            <p className="text-gray-400 text-sm">
              Question {currentQuestionIndex + 1} of{" "}
              {javascriptQuestions.length}
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

        {/* Quiz question - larger and more prominent */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 leading-relaxed">
            {currentQuiz.question}
          </h3>
          {/* Code blocks with improved presentation */}
          <div className="mb-8 space-y-4">
            {currentQuiz.codeBlocks.map((block, index) => (
              <div key={index} className="relative">
                {/* Block type label */}
                <div className="flex items-center mb-2">
                  <span
                    className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${
                    block.type === "setup"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : ""
                  }
                  ${
                    block.type === "question"
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      : ""
                  }
                  ${
                    block.type === "result"
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : ""
                  }
                `}
                  >
                    {block.type === "setup" && "🔧 Setup"}
                    {block.type === "question" && "❓ Fill in the blank"}
                    {block.type === "result" && "✅ Expected output"}
                  </span>
                </div>

                {/* Code block */}
                <div
                  className={`
                rounded-xl p-6 font-mono text-sm overflow-x-auto border transition-all duration-200
                ${
                  block.highlight
                    ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 shadow-lg shadow-yellow-500/10"
                    : "bg-gray-900/80 border-gray-700/50"
                }
              `}
                >
                  <pre className="leading-relaxed">
                    <code className={`language-${block.language}`}>
                      {block.content.includes("__BLANK__") ? (
                        // Custom rendering for code with blanks
                        block.content
                          .split("__BLANK__")
                          .map((part, partIndex, parts) => (
                            <span key={partIndex}>
                              <span
                                className="text-gray-300"
                                dangerouslySetInnerHTML={{
                                  __html: highlightCode(part, block.language),
                                }}
                              />
                              {partIndex < parts.length - 1 && (
                                <span className="bg-yellow-400/30 text-yellow-200 px-2 py-1 rounded border-2 border-dashed border-yellow-400/50 font-bold animate-pulse">
                                  ____
                                </span>
                              )}
                            </span>
                          ))
                      ) : (
                        // Standard syntax highlighting for complete code
                        <span
                          className="text-gray-300"
                          dangerouslySetInnerHTML={{
                            __html: highlightCode(
                              block.content,
                              block.language
                            ),
                          }}
                        />
                      )}
                    </code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz answers - more spaced and interactive */}
        <div className="space-y-4 mb-8">
          {currentQuiz.answers.map((answer, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 transform hover:scale-[1.02] ${
                selectedAnswer === index
                  ? selectedAnswer === currentQuiz.correctAnswer
                    ? "bg-green-500/20 border-green-500/60 text-green-200 shadow-lg shadow-green-500/20"
                    : "bg-red-500/20 border-red-500/60 text-red-200 shadow-lg shadow-red-500/20"
                  : "bg-dark-200/40 border-gray-600/50 text-gray-200 hover:border-gray-400/60 hover:bg-dark-200/60"
              }`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="flex items-center">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 text-sm font-bold ${
                    selectedAnswer === index
                      ? selectedAnswer === currentQuiz.correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-600/60 text-gray-300"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-medium">{answer}</span>

                {isAnswered && index === currentQuiz.correctAnswer && (
                  <svg
                    className="w-6 h-6 text-green-400 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}

                {isAnswered &&
                  selectedAnswer === index &&
                  selectedAnswer !== currentQuiz.correctAnswer && (
                    <svg
                      className="w-6 h-6 text-red-400 ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced feedback section with code solution */}
        {isAnswered && (
          <div className="space-y-4 mb-8">
            {/* Feedback message */}
            <div
              className={`p-6 rounded-xl border-2 ${
                selectedAnswer === currentQuiz.correctAnswer
                  ? "bg-green-500/20 border-green-500/40 shadow-lg shadow-green-500/20"
                  : "bg-orange-500/20 border-orange-500/40 shadow-lg shadow-orange-500/20"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedAnswer === currentQuiz.correctAnswer
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                >
                  {selectedAnswer === currentQuiz.correctAnswer ? "🎉" : "💡"}
                </div>
                <p className="text-white font-medium leading-relaxed">
                  {feedback}
                </p>
              </div>
            </div>

            {/* Show correct answer in code */}
            <div className="bg-gray-900/60 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                  ✅ Correct Answer
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white text-xs rounded-lg transition-all duration-200"
                  title="Copy complete code"
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
              <div className="font-mono text-sm">
                {currentQuiz.codeBlocks.map((block, index) => (
                  <div key={index}>
                    <pre className="leading-relaxed text-gray-300">
                      <code>
                        {block.content.includes("__BLANK__") ? (
                          block.content
                            .split("__BLANK__")
                            .map((part, partIndex, parts) => (
                              <span key={partIndex}>
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: highlightCode(part, block.language),
                                  }}
                                />
                                {partIndex < parts.length - 1 && (
                                  <span className="bg-green-500/30 text-green-200 px-2 py-1 rounded font-bold">
                                    {
                                      currentQuiz.answers[
                                        currentQuiz.correctAnswer
                                      ]
                                    }
                                  </span>
                                )}
                              </span>
                            ))
                        ) : (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightCode(
                                block.content,
                                block.language
                              ),
                            }}
                          />
                        )}
                      </code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions - prominent CTA */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <span className="text-[#28c7f9] font-medium">💪 Keep going!</span>{" "}
            Daily practice builds mastery
          </div>

          {isAnswered ? (
            <button
              onClick={handleNextQuestion}
              className="px-8 py-3 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] hover:from-[#28c7f9]/90 hover:to-[#8e5ff5]/90 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Next Challenge →
            </button>
          ) : (
            <div className="text-sm text-gray-500">
              Choose your answer above
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
