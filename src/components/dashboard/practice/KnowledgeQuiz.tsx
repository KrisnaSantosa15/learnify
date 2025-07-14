"use client";

import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  question: string;
  type: "multiple-choice" | "true-false" | "fill-blank";
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  category: string;
  difficulty: string;
  points: number;
}

export default function KnowledgeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(
    null
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question:
        "What is the time complexity of Array.prototype.indexOf() in JavaScript?",
      type: "multiple-choice",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: 2,
      explanation:
        "Array.indexOf() performs a linear search through the array, resulting in O(n) time complexity.",
      category: "JavaScript",
      difficulty: "Intermediate",
      points: 10,
    },
    {
      id: 2,
      question: "Which of the following is NOT a JavaScript primitive type?",
      type: "multiple-choice",
      options: ["string", "object", "boolean", "symbol"],
      correctAnswer: 1,
      explanation:
        "Object is not a primitive type. The primitive types in JavaScript are: string, number, boolean, undefined, null, symbol, and bigint.",
      category: "JavaScript",
      difficulty: "Beginner",
      points: 5,
    },
    {
      id: 3,
      question:
        "Event bubbling in JavaScript means events propagate from child to parent elements.",
      type: "true-false",
      options: ["True", "False"],
      correctAnswer: 0,
      explanation:
        "True. Event bubbling is when an event starts from the target element and bubbles up to the parent elements.",
      category: "DOM",
      difficulty: "Intermediate",
      points: 8,
    },
    {
      id: 4,
      question:
        "What does the 'this' keyword refer to in a regular JavaScript function?",
      type: "multiple-choice",
      options: [
        "The function itself",
        "The global object",
        "The parent object",
        "undefined",
      ],
      correctAnswer: 1,
      explanation:
        "In a regular function, 'this' refers to the global object (window in browsers, global in Node.js) when not in strict mode.",
      category: "JavaScript",
      difficulty: "Advanced",
      points: 15,
    },
    {
      id: 5,
      question:
        "React hooks can only be called at the top level of React functions.",
      type: "true-false",
      options: ["True", "False"],
      correctAnswer: 0,
      explanation:
        "True. React hooks must be called at the top level and cannot be called inside loops, conditions, or nested functions.",
      category: "React",
      difficulty: "Intermediate",
      points: 10,
    },
  ];

  const currentQ = questions[currentQuestion];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timeLeft > 0 && !isAnswered) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizCompleted, isAnswered]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(30);
  };

  const handleAnswer = (answer: string | number) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === currentQ.correctAnswer) {
      setScore(score + currentQ.points);
    }
  };

  const handleTimeUp = () => {
    setIsAnswered(true);
    setSelectedAnswer(null);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(30);
    setQuizStarted(false);
    setQuizCompleted(false);
  };

  const getScoreColor = () => {
    const percentage = (score / (questions.length * 10)) * 100;
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  if (!quizStarted) {
    return (
      <div className="text-center py-12">
        <div className="mb-8">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-2xl font-bold text-white mb-2">Knowledge Quiz</h3>
          <p className="text-gray-400 mb-6">
            Test your programming knowledge with {questions.length} questions
          </p>

          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-dark-300/40 rounded-lg p-4">
              <div className="text-lg font-bold text-[#28c7f9]">
                {questions.length}
              </div>
              <div className="text-sm text-gray-400">Questions</div>
            </div>
            <div className="bg-dark-300/40 rounded-lg p-4">
              <div className="text-lg font-bold text-[#8e5ff5]">30s</div>
              <div className="text-sm text-gray-400">Per Question</div>
            </div>
            <div className="bg-dark-300/40 rounded-lg p-4">
              <div className="text-lg font-bold text-yellow-400">
                {questions.reduce((sum, q) => sum + q.points, 0)}
              </div>
              <div className="text-sm text-gray-400">Max Points</div>
            </div>
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="px-8 py-4 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-xl text-white font-bold text-lg hover:scale-105 transition-transform"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = (score / (questions.length * 10)) * 100;
    return (
      <div className="text-center py-12">
        <div className="mb-8">
          <div className="text-6xl mb-4">
            {percentage >= 80 ? "🏆" : percentage >= 60 ? "🎉" : "💪"}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Quiz Completed!
          </h3>

          <div className="bg-dark-300/40 rounded-2xl p-8 max-w-md mx-auto mb-6">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor()}`}>
              {score}/{questions.reduce((sum, q) => sum + q.points, 0)}
            </div>
            <div className="text-gray-400 mb-4">
              {percentage.toFixed(1)}% Accuracy
            </div>

            <div className="w-full bg-dark-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] h-3 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <div className="text-sm text-gray-400">
              {percentage >= 80
                ? "Excellent work! 🌟"
                : percentage >= 60
                ? "Good job! Keep practicing! 📚"
                : "Keep studying and try again! 💪"}
            </div>
          </div>
        </div>

        <button
          onClick={restartQuiz}
          className="px-8 py-4 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-xl text-white font-bold text-lg hover:scale-105 transition-transform"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="text-lg font-bold text-white">
              {currentQ.category} • {currentQ.difficulty}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#28c7f9]">{score}</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>

            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  timeLeft <= 10
                    ? "text-red-400 animate-pulse"
                    : "text-[#8e5ff5]"
                }`}
              >
                {timeLeft}s
              </div>
              <div className="text-xs text-gray-400">Time Left</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-300 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-xl font-bold text-white leading-relaxed flex-1">
            {currentQ.question}
          </h3>
          <div className="text-sm font-medium text-[#28c7f9] bg-[#28c7f9]/10 px-3 py-1 rounded-full ml-4">
            +{currentQ.points} pts
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQ.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                isAnswered
                  ? index === currentQ.correctAnswer
                    ? "bg-green-500/20 border-green-500/60 text-green-200"
                    : selectedAnswer === index
                    ? "bg-red-500/20 border-red-500/60 text-red-200"
                    : "bg-dark-300/40 border-gray-600/30 text-gray-400"
                  : selectedAnswer === index
                  ? "bg-[#28c7f9]/20 border-[#28c7f9]/60 text-white"
                  : "bg-dark-300/40 border-gray-600/30 text-gray-200 hover:border-gray-400/60 hover:bg-dark-300/60"
              }`}
            >
              <div className="flex items-center">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold ${
                    isAnswered
                      ? index === currentQ.correctAnswer
                        ? "bg-green-500 text-white"
                        : selectedAnswer === index
                        ? "bg-red-500 text-white"
                        : "bg-gray-600 text-gray-300"
                      : selectedAnswer === index
                      ? "bg-[#28c7f9] text-white"
                      : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-medium">{option}</span>

                {isAnswered && index === currentQ.correctAnswer && (
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
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-300">💡</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Explanation</h4>
              <p className="text-gray-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <div className="text-center">
          <button
            onClick={nextQuestion}
            className="px-8 py-3 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-xl text-white font-bold hover:scale-105 transition-transform"
          >
            {currentQuestion < questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}
          </button>
        </div>
      )}
    </div>
  );
}
