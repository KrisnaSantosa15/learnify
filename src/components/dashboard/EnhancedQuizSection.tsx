"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchQuizzes,
  startQuiz,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  finishQuiz,
  clearQuiz,
  showQuestionHint,
  hideQuestionHint,
  showQuestionExplanation,
  hideQuestionExplanation,
  setQuizFilters,
  hideConfetti,
} from "@/lib/slices/quizSlice";
import { addXP } from "@/lib/slices/userSlice";
import { addToast } from "@/lib/slices/uiSlice";

export default function QuizSection() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  // Redux state
  const {
    quizzes,
    currentQuiz,
    currentQuestionIndex,
    userAnswers,
    score,
    showResults,
    showExplanation,
    showHint,
    hintsUsed,
    timeRemaining,
    isLoading,
    error,
    selectedCategory,
    selectedDifficulty,
    showConfetti,
  } = useAppSelector((state) => state.quiz);

  const { xp, level, showXpAnimation } = useAppSelector((state) => state.user);

  // Load quizzes on component mount
  useEffect(() => {
    dispatch(fetchQuizzes({}));
  }, [dispatch]);

  // Auto-hide confetti after 3 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        dispatch(hideConfetti());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, dispatch]);

  const handleStartQuiz = (quiz: any) => {
    dispatch(startQuiz(quiz));
    dispatch(
      addToast({
        type: "info",
        message: `Started quiz: ${quiz.title}`,
      })
    );
  };

  const handleAnswerQuestion = (answer: number) => {
    if (!currentQuiz) return;

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    dispatch(
      answerQuestion({
        questionId: currentQuestion.id,
        answer,
      })
    );
  };

  const handleNextQuestion = () => {
    if (!currentQuiz) return;

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      dispatch(nextQuestion());
    } else {
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    dispatch(previousQuestion());
  };

  const handleFinishQuiz = () => {
    dispatch(finishQuiz());

    // Calculate and award XP
    if (currentQuiz && score > 0) {
      const xpGained = Math.floor((score * currentQuiz.xpReward) / 100);
      dispatch(addXP(xpGained));

      dispatch(
        addToast({
          type: "success",
          message: `Quiz completed! +${xpGained} XP earned!`,
        })
      );
    }
  };

  const handleRetakeQuiz = () => {
    if (currentQuiz) {
      dispatch(clearQuiz());
      dispatch(startQuiz(currentQuiz));
    }
  };

  const handleBackToQuizzes = () => {
    dispatch(clearQuiz());
  };

  const handleShowHint = () => {
    dispatch(showQuestionHint());
  };

  const handleHideHint = () => {
    dispatch(hideQuestionHint());
  };

  const handleShowExplanation = () => {
    dispatch(showQuestionExplanation());
  };

  const handleHideExplanation = () => {
    dispatch(hideQuestionExplanation());
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "category") {
      dispatch(setQuizFilters({ category: value }));
    } else if (filterType === "difficulty") {
      dispatch(setQuizFilters({ difficulty: value }));
    }
    // Refetch quizzes with new filters
    dispatch(
      fetchQuizzes({
        category:
          filterType === "category" ? value : selectedCategory || undefined,
        difficulty:
          filterType === "difficulty" ? value : selectedDifficulty || undefined,
      })
    );
  };

  // Error handling
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h3 className="text-red-400 font-semibold mb-2">
            Error Loading Quizzes
          </h3>
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => dispatch(fetchQuizzes({}))}
            className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-400">Loading quizzes...</span>
      </div>
    );
  }

  // Quiz selection view
  if (!currentQuiz) {
    return (
      <div className="space-y-6">
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][
                    Math.floor(Math.random() * 4)
                  ],
                }}
              >
                🎉
              </div>
            ))}
          </div>
        )}

        {/* XP Animation */}
        {showXpAnimation && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
              +{xp} XP!
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={selectedCategory || ""}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="bg-dark-300 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Categories</option>
            <option value="programming">Programming</option>
            <option value="web-development">Web Development</option>
            <option value="data-structures">Data Structures</option>
          </select>

          <select
            value={selectedDifficulty || ""}
            onChange={(e) => handleFilterChange("difficulty", e.target.value)}
            className="bg-dark-300 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Difficulties</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-dark-300 border border-gray-700 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    quiz.difficulty === "BEGINNER"
                      ? "bg-green-500/20 text-green-400"
                      : quiz.difficulty === "INTERMEDIATE"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : quiz.difficulty === "ADVANCED"
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {quiz.difficulty}
                </span>
                <span className="text-xs text-gray-400">
                  {quiz.questions?.length || 0} Questions
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                {quiz.title}
              </h3>

              {quiz.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {quiz.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-medium">
                  +{quiz.xpReward} XP
                </span>
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto w-16 h-16 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Quizzes Available</h3>
            <p className="text-gray-400">
              No quizzes found for the selected filters. Try adjusting your
              search criteria.
            </p>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBackToQuizzes}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Quizzes
        </button>
        <div className="text-right">
          <h2 className="text-xl font-semibold">{currentQuiz.title}</h2>
          <p className="text-gray-400">
            Question {currentQuestionIndex + 1} of{" "}
            {currentQuiz.questions.length}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-dark-300 rounded-full h-2 mb-6">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timer */}
      {timeRemaining !== null && (
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeRemaining < 60
                ? "bg-red-500/20 text-red-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            ⏰ {Math.floor(timeRemaining / 60)}:
            {(timeRemaining % 60).toString().padStart(2, "0")}
          </div>
        </div>
      )}

      {/* Question */}
      {!showResults && currentQuestion && (
        <div className="bg-dark-300 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              {currentQuestion.question}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={showHint ? handleHideHint : handleShowHint}
                className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors"
              >
                💡 {showHint ? "Hide" : "Hint"} ({hintsUsed})
              </button>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                {currentQuestion.points} pts
              </span>
            </div>
          </div>

          {/* Hint */}
          {showHint && currentQuestion.explanation && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-300 text-sm">
                💡 <strong>Hint:</strong> {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = userAnswers[currentQuestion.id] === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showAnswer = showExplanation;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerQuestion(index)}
                  disabled={showAnswer}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                    showAnswer
                      ? isCorrect
                        ? "border-green-500 bg-green-500/20 text-green-300"
                        : isSelected
                        ? "border-red-500 bg-red-500/20 text-red-300"
                        : "border-gray-600 bg-gray-800 text-gray-400"
                      : isSelected
                      ? "border-blue-500 bg-blue-500/20 text-blue-300"
                      : "border-gray-600 bg-dark-400 hover:border-blue-500/50 hover:bg-blue-500/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showAnswer && isCorrect && (
                      <span className="ml-auto">✓</span>
                    )}
                    {showAnswer && isSelected && !isCorrect && (
                      <span className="ml-auto">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && currentQuestion.explanation && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300">
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {!showExplanation &&
                userAnswers[currentQuestion.id] !== undefined && (
                  <button
                    onClick={handleShowExplanation}
                    className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                  >
                    Show Answer
                  </button>
                )}
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={userAnswers[currentQuestion.id] === undefined}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:text-gray-400 rounded-lg transition-colors"
            >
              {currentQuestionIndex === currentQuiz.questions.length - 1
                ? "Finish"
                : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="bg-dark-300 rounded-lg p-8 text-center">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-4">Quiz Complete! 🎉</h2>
            <div className="text-6xl font-bold text-blue-400 mb-4">
              {Math.round(
                (score /
                  currentQuiz.questions.reduce((sum, q) => sum + q.points, 0)) *
                  100
              )}
              %
            </div>
            <p className="text-gray-400">
              You scored {score} out of{" "}
              {currentQuiz.questions.reduce((sum, q) => sum + q.points, 0)}{" "}
              points
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRetakeQuiz}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
            >
              Retake Quiz
            </button>
            <button
              onClick={handleBackToQuizzes}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
