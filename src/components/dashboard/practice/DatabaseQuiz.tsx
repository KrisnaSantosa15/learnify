"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  order: number;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  difficulty: string;
  category: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
  timeLimit?: number;
  xpReward: number;
  questions: QuizQuestion[];
  settings: {
    randomizeQuestions: boolean;
    showProgress: boolean;
    allowRetakes: boolean;
    showExplanations: boolean;
    instantFeedback: boolean;
    certificateEligible: boolean;
  };
  stats: {
    totalAttempts: number;
    questionCount: number;
    maxScore: number;
  };
}

interface UserAttempt {
  id: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  completedAt: string;
}

interface DatabaseQuizProps {
  quizId: string;
  autoStart?: boolean;
}

export default function DatabaseQuiz({
  quizId,
  autoStart = false,
}: DatabaseQuizProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // Helper function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAttempts, setUserAttempts] = useState<UserAttempt[]>([]);
  const [canTakeQuiz, setCanTakeQuiz] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false); // New state for answer confirmation
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>(
    []
  );
  const [results, setResults] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
    xpEarned: number;
  } | null>(null);

  // Load quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/quizzes/${quizId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data = await response.json();
        setQuiz(data.quiz);
        setUserAttempts(data.userAttempts || []);
        setCanTakeQuiz(data.canTakeQuiz);

        // Set up questions (shuffled if required)
        if (data.quiz.settings.randomizeQuestions) {
          setShuffledQuestions(shuffleArray(data.quiz.questions));
        } else {
          setShuffledQuestions(data.quiz.questions);
        }

        // Check if there's an active quiz session in localStorage
        const activeQuiz = localStorage.getItem(`activeQuiz_${quizId}`);
        if (activeQuiz) {
          const quizState = JSON.parse(activeQuiz);

          // Check if quiz is completed
          if (quizState.isCompleted) {
            setQuizCompleted(true);
            setResults(quizState.results);
            return;
          }

          // Restore quiz state if it's still valid (within time limit)
          const timeElapsed = Date.now() - quizState.startTime;
          const totalTimeLimit = data.quiz.timeLimit
            ? data.quiz.timeLimit * 60 * 1000
            : Infinity;

          if (timeElapsed < totalTimeLimit) {
            setQuizStarted(true);
            setCurrentQuestion(quizState.currentQuestion || 0);
            setUserAnswers(quizState.userAnswers || []);
            setStartTime(quizState.startTime);

            // Restore shuffled questions if available, otherwise use current ones
            if (quizState.shuffledQuestions) {
              setShuffledQuestions(quizState.shuffledQuestions);
            }

            // Calculate remaining time from total quiz time (continuous timer)
            const totalQuizTime = data.quiz.timeLimit
              ? data.quiz.timeLimit * 60
              : 1800; // Default 30 minutes
            const elapsedSeconds = Math.floor(timeElapsed / 1000);
            const remainingTime = Math.max(0, totalQuizTime - elapsedSeconds);

            setTimeLeft(remainingTime);
            setIsAnswered(quizState.isAnswered || false);
            setIsConfirmed(quizState.isConfirmed || false);
            setSelectedAnswer(quizState.selectedAnswer ?? null);
          } else {
            // Quiz session expired, clear it
            localStorage.removeItem(`activeQuiz_${quizId}`);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  // Save quiz state helper
  const saveQuizState = React.useCallback(
    (state: {
      startTime: number;
      currentQuestion: number;
      userAnswers: number[];
      isAnswered: boolean;
      isConfirmed: boolean;
      selectedAnswer: number | null;
      shuffledQuestions?: QuizQuestion[];
      isCompleted?: boolean;
      results?: {
        score: number;
        maxScore: number;
        percentage: number;
        xpEarned: number;
      };
    }) => {
      localStorage.setItem(`activeQuiz_${quizId}`, JSON.stringify(state));
    },
    [quizId]
  );

  // Auto-start effect
  useEffect(() => {
    if (quiz && autoStart && canTakeQuiz && !quizStarted) {
      const activeQuiz = localStorage.getItem(`activeQuiz_${quizId}`);
      if (!activeQuiz) {
        setTimeout(() => {
          setQuizStarted(true);
          const now = Date.now();
          setStartTime(now);
          setCurrentQuestion(0);
          setUserAnswers([]);
          // Use total quiz time instead of per-question time
          const totalQuizTime = quiz.timeLimit ? quiz.timeLimit * 60 : 1800; // Default 30 minutes
          setTimeLeft(totalQuizTime);
          setQuizCompleted(false);
          setResults(null);

          // Save quiz state to localStorage
          localStorage.setItem(
            `activeQuiz_${quizId}`,
            JSON.stringify({
              startTime: now,
              currentQuestion: 0,
              userAnswers: [],
              isAnswered: false,
              isConfirmed: false,
              selectedAnswer: null,
              shuffledQuestions,
            })
          );
        }, 100);
      }
    }
  }, [quiz, autoStart, canTakeQuiz, quizStarted, quizId, shuffledQuestions]);

  const handleTimeUp = React.useCallback(() => {
    setIsAnswered(true);
    setIsConfirmed(true);
    setSelectedAnswer(-1); // Mark as no answer

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = -1;
    setUserAnswers(newAnswers);

    // Save updated state
    saveQuizState({
      startTime,
      currentQuestion,
      userAnswers: newAnswers,
      isAnswered: true,
      isConfirmed: true,
      selectedAnswer: -1,
      shuffledQuestions,
    });
  }, [
    userAnswers,
    currentQuestion,
    startTime,
    saveQuizState,
    shuffledQuestions,
  ]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timeLeft > 0 && !isConfirmed) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !isConfirmed) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizCompleted, isConfirmed, handleTimeUp]);

  const startQuiz = () => {
    if (!quiz) return;

    setQuizStarted(true);
    const now = Date.now();
    setStartTime(now);
    setCurrentQuestion(0);
    setUserAnswers([]);
    // Use total quiz time instead of per-question time
    const totalQuizTime = quiz.timeLimit ? quiz.timeLimit * 60 : 1800; // Default 30 minutes
    setTimeLeft(totalQuizTime);
    setQuizCompleted(false);
    setResults(null);

    // Save quiz state to localStorage
    saveQuizState({
      startTime: now,
      currentQuestion: 0,
      userAnswers: [],
      isAnswered: false,
      isConfirmed: false,
      selectedAnswer: null,
      shuffledQuestions,
    });
  };

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered && isConfirmed) return; // Only prevent if already confirmed

    setSelectedAnswer(answerIndex);
    // Don't set isAnswered or isConfirmed yet - just update selection
  };

  const confirmAnswer = () => {
    if (selectedAnswer === null) return;

    setIsAnswered(true);
    setIsConfirmed(true);

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);

    // Save updated state
    saveQuizState({
      startTime,
      currentQuestion,
      userAnswers: newAnswers,
      isAnswered: true,
      isConfirmed: true,
      selectedAnswer,
      shuffledQuestions,
    });
  };

  const nextQuestion = () => {
    if (!quiz) return;

    if (currentQuestion < shuffledQuestions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsConfirmed(false);
      // DON'T reset the timer - keep it continuous

      // Save updated state
      saveQuizState({
        startTime,
        currentQuestion: nextQuestionIndex,
        userAnswers,
        isAnswered: false,
        isConfirmed: false,
        selectedAnswer: null,
        shuffledQuestions,
      });
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!quiz || !session?.user) return;

    setQuizCompleted(true);
    setSubmitting(true);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      const response = await fetch("/api/quiz-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: userAnswers,
          timeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const data = await response.json();
      setResults(data);

      // Save completion state to localStorage (so refresh keeps user on results page)
      saveQuizState({
        startTime,
        currentQuestion,
        userAnswers,
        isAnswered: true,
        isConfirmed: true,
        selectedAnswer,
        isCompleted: true,
        results: data,
        shuffledQuestions,
      });

      // Refresh user attempts
      const updatedQuizResponse = await fetch(`/api/quizzes/${quizId}`);
      if (updatedQuizResponse.ok) {
        const updatedData = await updatedQuizResponse.json();
        setUserAttempts(updatedData.userAttempts || []);
        setCanTakeQuiz(updatedData.canTakeQuiz);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const restartQuiz = () => {
    if (!canTakeQuiz) return;

    // Clear any existing quiz state
    localStorage.removeItem(`activeQuiz_${quizId}`);

    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsConfirmed(false);
    setResults(null);
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8e5ff5] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={goBack}
            className="px-6 py-3 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-lg text-white font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Not Found</h2>
          <p className="text-gray-400 mb-6">
            The quiz you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={goBack}
            className="px-6 py-3 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-lg text-white font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Quiz completed - show results
  if (quizCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {results.percentage >= 80
                  ? "🏆"
                  : results.percentage >= 60
                  ? "⭐"
                  : "📚"}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Quiz Complete!
              </h2>
              <p className="text-gray-400">Here are your results:</p>
            </div>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-dark-300/40 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-[#28c7f9] mb-2">
                {results.score}/{results.maxScore}
              </div>
              <div className="text-gray-400">Score</div>
            </div>
            <div className="bg-dark-300/40 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-[#8e5ff5] mb-2">
                {results.percentage}%
              </div>
              <div className="text-gray-400">Accuracy</div>
            </div>
            <div className="bg-dark-300/40 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                +{results.xpEarned || 0}
              </div>
              <div className="text-gray-400">XP Earned</div>
            </div>
          </div>

          {/* Certificate eligibility */}
          {quiz.settings.certificateEligible && results.percentage >= 80 && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 mb-8">
              <div className="text-center">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  Certificate Eligible!
                </h3>
                <p className="text-gray-300 text-sm">
                  Congratulations! You scored {results.percentage}% and are
                  eligible for a completion certificate.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            {canTakeQuiz && quiz.settings.allowRetakes && (
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-xl text-white font-bold hover:scale-105 transition-transform"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => {
                // Clear the quiz state when going back
                localStorage.removeItem(`activeQuiz_${quizId}`);
                goBack();
              }}
              className="px-6 py-3 bg-dark-300 hover:bg-dark-200 rounded-xl text-white font-bold transition-colors"
            >
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors mb-6"
            >
              <span>←</span>
              <span>Back</span>
            </button>

            <div className="text-center">
              <div className="text-6xl mb-4">{quiz.category.icon || "🧠"}</div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {quiz.title}
              </h1>
              {quiz.description && (
                <p className="text-gray-400 mb-6">{quiz.description}</p>
              )}

              <div className="grid md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                <div className="bg-dark-300/40 rounded-lg p-4">
                  <div className="text-lg font-bold text-[#28c7f9]">
                    {shuffledQuestions.length}
                  </div>
                  <div className="text-sm text-gray-400">Questions</div>
                </div>
                <div className="bg-dark-300/40 rounded-lg p-4">
                  <div className="text-lg font-bold text-[#8e5ff5]">
                    {quiz.timeLimit ? `${quiz.timeLimit}m` : "30m"}
                  </div>
                  <div className="text-sm text-gray-400">Total Time</div>
                </div>
                <div className="bg-dark-300/40 rounded-lg p-4">
                  <div className="text-lg font-bold text-yellow-400">
                    {quiz.stats.maxScore}
                  </div>
                  <div className="text-sm text-gray-400">Max Points</div>
                </div>
                <div className="bg-dark-300/40 rounded-lg p-4">
                  <div className="text-lg font-bold text-green-400">
                    +{quiz.xpReward}
                  </div>
                  <div className="text-sm text-gray-400">XP Reward</div>
                </div>
              </div>

              {/* Quiz Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">
                  Quiz Features
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {quiz.settings.randomizeQuestions && (
                    <div className="flex items-center gap-2 bg-dark-300/40 px-3 py-2 rounded-lg">
                      <span className="text-lg">🎲</span>
                      <span className="text-sm text-gray-300">
                        Randomized Questions
                      </span>
                    </div>
                  )}
                  {quiz.settings.showProgress && (
                    <div className="flex items-center gap-2 bg-dark-300/40 px-3 py-2 rounded-lg">
                      <span className="text-lg">📊</span>
                      <span className="text-sm text-gray-300">
                        Progress Tracking
                      </span>
                    </div>
                  )}
                  {quiz.settings.allowRetakes && (
                    <div className="flex items-center gap-2 bg-dark-300/40 px-3 py-2 rounded-lg">
                      <span className="text-lg">🔄</span>
                      <span className="text-sm text-gray-300">
                        Retakes Allowed
                      </span>
                    </div>
                  )}
                  {quiz.settings.showExplanations && (
                    <div className="flex items-center gap-2 bg-dark-300/40 px-3 py-2 rounded-lg">
                      <span className="text-lg">💡</span>
                      <span className="text-sm text-gray-300">
                        Explanations
                      </span>
                    </div>
                  )}
                  {quiz.settings.instantFeedback && (
                    <div className="flex items-center gap-2 bg-dark-300/40 px-3 py-2 rounded-lg">
                      <span className="text-lg">⚡</span>
                      <span className="text-sm text-yellow-400">
                        Instant Feedback
                      </span>
                    </div>
                  )}
                  {quiz.settings.certificateEligible && (
                    <div className="flex items-center gap-2 bg-dark-300/40 px-3 py-2 rounded-lg">
                      <span className="text-lg">🏆</span>
                      <span className="text-sm text-green-400">
                        Certificate Eligible
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Previous attempts */}
              {userAttempts.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Previous Attempts
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {userAttempts.slice(0, 3).map((attempt, index) => (
                      <div
                        key={attempt.id}
                        className="bg-dark-300/40 rounded-lg p-4"
                      >
                        <div className="text-lg font-bold text-white">
                          {attempt.percentage}%
                        </div>
                        <div className="text-sm text-gray-400">
                          Attempt #{userAttempts.length - index}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {canTakeQuiz ? (
                <button
                  onClick={startQuiz}
                  className="px-8 py-4 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-xl text-white font-bold text-lg hover:scale-105 transition-transform"
                >
                  {userAttempts.length > 0 ? "Retake Quiz" : "Start Quiz"}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    You have completed this quiz and retakes are not allowed.
                  </p>
                  <button
                    onClick={goBack}
                    className="px-6 py-3 bg-dark-300 hover:bg-dark-200 rounded-xl text-white font-bold transition-colors"
                  >
                    Back to Practice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  const currentQ = shuffledQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

  // Don't render if questions aren't ready
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8e5ff5] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with progress */}
        <div className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="text-white font-medium whitespace-nowrap">
                Question {currentQuestion + 1} of {shuffledQuestions.length}
              </div>
              {quiz.settings.showProgress && (
                <div className="flex-1 max-w-md">
                  <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-[#28c7f9]">
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-gray-400">Time left</div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-dark-300/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-8">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isConfirmed || submitting}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                  isConfirmed && quiz.settings.instantFeedback
                    ? index === currentQ.correctAnswer
                      ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                      : selectedAnswer === index
                      ? "bg-red-500/20 border-2 border-red-500 text-red-400"
                      : "bg-dark-300/40 border border-white/10 text-gray-400"
                    : isConfirmed && !quiz.settings.instantFeedback
                    ? selectedAnswer === index
                      ? "bg-[#8e5ff5]/20 border-2 border-[#8e5ff5] text-white"
                      : "bg-dark-300/40 border border-white/10 text-gray-400"
                    : selectedAnswer === index
                    ? "bg-[#8e5ff5]/20 border-2 border-[#8e5ff5] text-white"
                    : "bg-dark-300/40 border border-white/10 text-white hover:bg-dark-300/60 hover:border-white/20"
                }`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-dark-300 flex items-center justify-center text-sm font-medium mr-4">
                    {String.fromCharCode(65 + index)}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>

          {/* Confirm Answer Button */}
          {selectedAnswer !== null && !isConfirmed && (
            <div className="mt-6 text-center">
              <button
                onClick={confirmAnswer}
                className="px-6 py-3 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-lg text-white font-medium hover:scale-105 transition-transform"
              >
                Confirm Answer
              </button>
              <p className="text-gray-400 text-sm mt-2">
                You can change your selection before confirming
              </p>
            </div>
          )}

          {/* Show explanation if instant feedback is enabled */}
          {isConfirmed &&
            quiz.settings.instantFeedback &&
            quiz.settings.showExplanations &&
            currentQ &&
            currentQ.explanation && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-400 mt-1">💡</div>
                  <div>
                    <h4 className="text-blue-400 font-medium mb-1">
                      Explanation
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Next button */}
        {isConfirmed && (
          <div className="text-center">
            <button
              onClick={nextQuestion}
              disabled={submitting}
              className="px-8 py-4 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-xl text-white font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Submitting..."
                : currentQuestion === shuffledQuestions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
