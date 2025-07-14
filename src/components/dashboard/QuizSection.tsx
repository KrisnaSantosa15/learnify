"use client";

import React, { useState, useEffect, useMemo } from "react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  xpReward: number;
  explanation?: string;
}

export default function QuizSection() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizCategories, setQuizCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Hearts system
  const maxHearts = 5;
  const [hearts, setHearts] = useState(5);
  const [heartAnimation, setHeartAnimation] = useState(false);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [nextHeartRefill, setNextHeartRefill] = useState<Date | null>(null);
  const [timeToNextHeart, setTimeToNextHeart] = useState("");

  // Track when the next heart will be refilled
  useEffect(() => {
    if (hearts < maxHearts && !nextHeartRefill) {
      const next = new Date();
      next.setHours(next.getHours() + 1);
      setNextHeartRefill(next);
    }

    if (hearts === maxHearts) {
      setNextHeartRefill(null);
    }
  }, [hearts, maxHearts, nextHeartRefill]);

  // Timer for heart refill countdown
  useEffect(() => {
    if (!nextHeartRefill) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextHeartRefill.getTime() - now.getTime();
      if (diff <= 0) {
        clearInterval(timer);
        // Refill one heart
        setHearts((prevHearts) => Math.min(prevHearts + 1, maxHearts));
        setNextHeartRefill(null);
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeToNextHeart(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [nextHeartRefill, maxHearts]);

  const allQuizzes: QuizQuestion[] = useMemo(
    () => [
      {
        id: 1,
        question:
          "Which method adds an element to the end of an array in JavaScript?",
        options: [
          "array.push()",
          "array.pop()",
          "array.unshift()",
          "array.shift()",
        ],
        correctAnswer: 0,
        category: "JavaScript",
        difficulty: "Easy",
        xpReward: 15,
        explanation:
          "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
      },
      {
        id: 2,
        question: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Creative Style Sheets",
          "Cascading Style Sheets",
          "Colorful Style Sheets",
        ],
        correctAnswer: 2,
        category: "CSS",
        difficulty: "Easy",
        xpReward: 15,
        explanation:
          "CSS stands for Cascading Style Sheets, which is a style sheet language used for describing the presentation of a document written in HTML or XML.",
      },
      {
        id: 3,
        question:
          "Which of the following is NOT a JavaScript framework or library?",
        options: ["React", "Angular", "Django", "Vue"],
        correctAnswer: 2,
        category: "Web Development",
        difficulty: "Medium",
        xpReward: 20,
        explanation:
          "Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. It's not a JavaScript framework.",
      },
      {
        id: 4,
        question: "Which HTTP status code indicates 'Not Found'?",
        options: ["200", "404", "500", "302"],
        correctAnswer: 1,
        category: "Web Development",
        difficulty: "Easy",
        xpReward: 15,
      },
      {
        id: 5,
        question: "Which of these is NOT a valid CSS position property?",
        options: ["static", "relative", "fixed", "floating"],
        correctAnswer: 3,
        category: "CSS",
        difficulty: "Medium",
        xpReward: 20,
        explanation:
          "The valid CSS position properties are static, relative, absolute, fixed, and sticky. There is no 'floating' position property.",
      },
      {
        id: 6,
        question:
          "Which JavaScript method is used to remove the last element from an array?",
        options: ["pop()", "push()", "shift()", "unshift()"],
        correctAnswer: 0,
        category: "JavaScript",
        difficulty: "Easy",
        xpReward: 15,
      },
      {
        id: 7,
        question: "What does the 'Box Model' in CSS describe?",
        options: [
          "How elements are displayed on a page",
          "How margins and padding interact",
          "The content, padding, border, and margin areas",
          "How flexbox works",
        ],
        correctAnswer: 2,
        category: "CSS",
        difficulty: "Medium",
        xpReward: 20,
      },
      {
        id: 8,
        question:
          "Which is the correct JavaScript syntax to declare a constant?",
        options: ["constant x = 5", "var x = 5", "let x = 5", "const x = 5"],
        correctAnswer: 3,
        category: "JavaScript",
        difficulty: "Easy",
        xpReward: 15,
      },
    ],
    []
  );

  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(allQuizzes);

  useEffect(() => {
    const categories = [
      "All",
      ...new Set(allQuizzes.map((quiz) => quiz.category)),
    ];
    setQuizCategories(categories);
  }, [allQuizzes]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setQuizzes(allQuizzes);
    } else {
      const filtered = allQuizzes.filter(
        (quiz) => quiz.category === selectedCategory
      );
      setQuizzes(filtered);
    }
    setCurrentQuiz(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizCompleted(false);
  }, [selectedCategory, allQuizzes]);

  const currentQuestion = quizzes[currentQuiz];

  useEffect(() => {
    if (isSubmitted && selectedOption === currentQuestion?.correctAnswer) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, selectedOption, currentQuestion]);

  const handleOptionSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null && !isSubmitted) {
      setIsSubmitted(true);
      if (selectedOption === currentQuestion.correctAnswer) {
        setCorrectStreak((prev) => prev + 1);
        const streakBonus = Math.min(correctStreak, 5) * 2;
        const earnedXp = currentQuestion.xpReward + streakBonus;
        setTotalXpEarned((prev) => prev + earnedXp);
      } else {
        // Reduce hearts when answer is wrong
        setHeartAnimation(true);
        setTimeout(() => setHeartAnimation(false), 500);
        setCorrectStreak(0);
        setHearts((prev) => Math.max(0, prev - 1));

        // Show modal if out of hearts
        if (hearts <= 1) {
          setShowOutOfHeartsModal(true);
        }
      }
    }
  };

  const handleNextQuestion = () => {
    if (isSubmitted) {
      setIsSubmitted(false);
      setSelectedOption(null);
      if (currentQuiz === quizzes.length - 1 || hearts === 0) {
        setQuizCompleted(true);
      } else {
        setCurrentQuiz((prev) => prev + 1);
      }
    }
  };

  const handleReset = () => {
    const shuffled = [...allQuizzes].sort(() => 0.5 - Math.random());
    setQuizzes(shuffled.slice(0, Math.min(5, shuffled.length)));
    setCurrentQuiz(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizCompleted(false);
  };

  // Function to handle getting more hearts (could be connected to watch ads, etc.)
  const handleGetMoreHearts = () => {
    // In a real app, this would be connected to watching ads, etc.
    setHearts(maxHearts);
    setShowOutOfHeartsModal(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-[#58c896]";
      case "Medium":
        return "text-[#fab72b]";
      case "Hard":
        return "text-[#ff5e7d]";
      default:
        return "text-[#58c896]";
    }
  };

  // Out of Hearts Modal
  if (showOutOfHeartsModal) {
    return (
      <div className="bg-dark-300/30 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-[#ff5e7d]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Out of Hearts!
          </h2>
        </div>

        <div className="p-5">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex justify-center mb-4 space-x-2">
              {[...Array(maxHearts)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-8 h-8 text-gray-600`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ))}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Out of Hearts
            </h3>
            <p className="text-gray-400 text-center mb-6">
              You&apos;ve run out of hearts! Wait for hearts to refill or get
              more hearts to continue your quiz.
            </p>

            {timeToNextHeart && (
              <div className="bg-dark-200/50 rounded-lg p-4 flex flex-col items-center w-full mb-6">
                <p className="text-white text-sm mb-2">Next heart in:</p>
                <div className="text-[#ff5e7d] text-2xl font-bold">
                  {timeToNextHeart}
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  1 heart refills every hour
                </p>
              </div>
            )}

            <button
              onClick={handleGetMoreHearts}
              className="w-full py-3 rounded-lg bg-[#28c7f9] hover:bg-[#28c7f9]/80 text-white font-medium mb-3 flex justify-center items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Get 5 Hearts
            </button>

            <button
              onClick={() => {
                setShowOutOfHeartsModal(false);
                setQuizCompleted(true);
              }}
              className="w-full py-3 rounded-lg bg-dark-200 hover:bg-dark-100 text-white font-medium"
            >
              End Quiz & See Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="bg-dark-300/30 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-[#8e5ff5]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            Quiz Completed!
          </h2>
          <div className="px-3 py-1 rounded-full bg-[#8e5ff5]/20 text-[#8e5ff5] text-xs flex items-center">
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            +{totalXpEarned} XP
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-24 h-24 rounded-full bg-[#8e5ff5]/20 flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-[#8e5ff5]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Quiz Completed!
            </h3>
            <p className="text-gray-400 text-center mb-4">
              You&apos;ve earned {totalXpEarned} XP from this quiz session
            </p>

            {/* Hearts remaining */}
            <div className="flex justify-center mb-6 mt-1">
              <div className="bg-dark-200/50 rounded-lg px-3 py-2 flex items-center">
                <div className="flex mr-2">
                  {[...Array(maxHearts)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < hearts ? "text-[#ff5e7d]" : "text-gray-600"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white font-medium text-sm">
                  {hearts} hearts remaining
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full space-y-4 mb-6">
              <div className="bg-dark-200/50 rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-[#8e5ff5]/20 flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-[#8e5ff5]"
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
                  </div>
                  <div>
                    <p className="text-white">Current Streak</p>
                  </div>
                </div>
                <div className="text-[#8e5ff5] font-bold">
                  {correctStreak} correct
                </div>
              </div>

              {correctStreak >= 3 && (
                <div className="bg-dark-200/50 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-lg bg-[#58c896]/20 flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-[#58c896]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white">Streak Bonus</p>
                    </div>
                  </div>
                  <div className="text-[#58c896] font-bold">
                    +{Math.min(correctStreak, 5) * 2} XP
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-lg bg-[#8e5ff5] hover:bg-[#8e5ff5]/80 text-white font-medium"
            >
              New Quiz Session
            </button>

            {correctStreak >= 5 && (
              <div className="mt-4 p-3 bg-[#58c896]/10 border border-[#58c896]/30 rounded-lg flex items-center">
                <div className="h-8 w-8 rounded-full bg-[#58c896]/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-[#58c896]"
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
                </div>
                <div>
                  <p className="text-[#58c896] font-medium">
                    Achievement Progress
                  </p>
                  <p className="text-gray-400 text-xs">
                    You&apos;re making progress toward the &apos;Quiz
                    Master&apos; achievement!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-300/30 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden relative">
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div
            className="confetti-piece"
            style={{
              left: "10%",
              animationDuration: "2.5s",
              backgroundColor: "#28c7f9",
              position: "absolute",
              width: "8px",
              height: "16px",
              top: "-10px",
              animation: "confettiFall linear forwards 2.5s",
            }}
          ></div>
          <div
            className="confetti-piece"
            style={{
              left: "20%",
              animationDuration: "3.5s",
              backgroundColor: "#58c896",
              position: "absolute",
              width: "8px",
              height: "16px",
              top: "-10px",
              animation: "confettiFall linear forwards 3.5s",
            }}
          ></div>
          <div
            className="confetti-piece"
            style={{
              left: "30%",
              animationDuration: "4s",
              backgroundColor: "#8e5ff5",
              position: "absolute",
              width: "8px",
              height: "16px",
              top: "-10px",
              animation: "confettiFall linear forwards 4s",
            }}
          ></div>
          <div
            className="confetti-piece"
            style={{
              left: "40%",
              animationDuration: "2s",
              backgroundColor: "#ff5e7d",
              position: "absolute",
              width: "8px",
              height: "16px",
              top: "-10px",
              animation: "confettiFall linear forwards 2s",
            }}
          ></div>
          <div
            className="confetti-piece"
            style={{
              left: "50%",
              animationDuration: "3s",
              backgroundColor: "#28c7f9",
              position: "absolute",
              width: "8px",
              height: "16px",
              top: "-10px",
              animation: "confettiFall linear forwards 3s",
            }}
          ></div>
          <div
            className="confetti-piece"
            style={{
              left: "60%",
              animationDuration: "2.7s",
              backgroundColor: "#8e5ff5",
              position: "absolute",
              width: "8px",
              height: "16px",
              top: "-10px",
              animation: "confettiFall linear forwards 2.7s",
            }}
          ></div>
          <div
            className="confetti-piece"
            style={{
              left: "70%",
              animationDuration: "3.1s",
              backgroundColor: "#ff5e7d",
              position: "absolute",
              width: "8px",
              height: "16px",
              top: "-10px",
              animation: "confettiFall linear forwards 3.1s",
            }}
          ></div>
          <div
            className="confetti-piece"
            style={{
              left: "80%",
              animationDuration: "2.4s",
              backgroundColor: "#58c896",
              position: "absolute",
              width: "8px",
              height: "16px",
              top: "-10px",
              animation: "confettiFall linear forwards 2.4s",
            }}
          ></div>
          <div
            className="confetti-piece"
            style={{
              left: "90%",
              animationDuration: "3.7s",
              backgroundColor: "#28c7f9",
              position: "absolute",
              width: "8px",
              height: "16px",
              top: "-10px",
              animation: "confettiFall linear forwards 3.7s",
            }}
          ></div>
        </div>
      )}

      <div className="p-5 border-b border-white/5 flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-[#8e5ff5]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          Daily Quiz Challenge
        </h2>
        <div className="flex items-center">
          <div className="flex mr-3">
            {[...Array(maxHearts)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < hearts ? "text-[#ff5e7d]" : "text-gray-600"
                } ${heartAnimation && i === hearts ? "animate-heartbeat" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ))}
            {hearts < maxHearts && timeToNextHeart && (
              <span className="text-xs text-[#58c896] ml-1">
                {timeToNextHeart}
              </span>
            )}
          </div>
          <div className="px-3 py-1 rounded-full bg-[#8e5ff5]/20 text-[#8e5ff5] text-xs mr-2">
            +{currentQuestion?.xpReward} XP
          </div>
          <span className="text-gray-400 text-sm">
            {currentQuiz + 1}/{quizzes.length}
          </span>
        </div>
      </div>

      <div className="p-4 border-b border-white/5 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {quizCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-[#8e5ff5] text-white"
                  : "bg-dark-200 text-gray-400 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {correctStreak > 0 && (
        <div className="px-5 pt-3 flex items-center">
          <div className="flex-1 flex items-center">
            <div className="h-5 w-5 rounded-full bg-[#ff5e7d]/20 flex items-center justify-center mr-2">
              <svg
                className="w-3 h-3 text-[#ff5e7d]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-xs text-gray-400">Current streak:</span>
          </div>
          <div className="flex">
            {Array.from({ length: Math.min(correctStreak, 5) }).map((_, i) => (
              <div key={i} className="h-4 w-4 ml-1">
                <svg
                  className="w-full h-full text-[#ff5e7d]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            ))}
            {correctStreak > 5 && (
              <span className="text-xs text-[#ff5e7d] ml-1 font-medium">
                +{correctStreak - 5}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap justify-between items-center mb-5">
          <div className="bg-dark-200 rounded-full px-3 py-1 text-xs text-gray-300 flex items-center mb-2 sm:mb-0">
            <svg
              className="w-3 h-3 mr-1 text-[#8e5ff5]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            {currentQuestion?.category}
          </div>

          <div className="bg-dark-200 rounded-full px-3 py-1 text-xs text-gray-300 flex items-center">
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
              <path d="M18 6 7 17l-5-5" />
              <path d="m22 10-7.5 7.5L13 16" />
            </svg>
            <span className={getDifficultyColor(currentQuestion?.difficulty)}>
              {currentQuestion?.difficulty}
            </span>
          </div>
        </div>

        <div className="mb-5">
          <h3 className="text-white text-lg font-medium mb-5">
            {currentQuestion?.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion?.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all
                  ${
                    selectedOption === index
                      ? isSubmitted
                        ? index === currentQuestion.correctAnswer
                          ? "bg-[#58c896]/20 border border-[#58c896]"
                          : "bg-[#ff5e7d]/20 border border-[#ff5e7d]"
                        : "bg-[#8e5ff5]/20 border border-[#8e5ff5]"
                      : "bg-dark-200 border border-white/10 hover:bg-dark-100"
                  }
                  ${
                    isSubmitted && index === currentQuestion.correctAnswer
                      ? "bg-[#58c896]/20 border border-[#58c896]"
                      : ""
                  }
                `}
              >
                <div className="flex items-center">
                  <div
                    className={`
                    h-6 w-6 rounded-full flex items-center justify-center mr-3 text-sm
                    ${
                      selectedOption === index
                        ? isSubmitted
                          ? index === currentQuestion.correctAnswer
                            ? "bg-[#58c896] text-white"
                            : "bg-[#ff5e7d] text-white"
                          : "bg-[#8e5ff5] text-white"
                        : "bg-dark-300 text-gray-400"
                    }
                    ${
                      isSubmitted && index === currentQuestion.correctAnswer
                        ? "bg-[#58c896] text-white"
                        : ""
                    }
                  `}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-white">{option}</span>

                  {isSubmitted &&
                    (index === currentQuestion.correctAnswer ? (
                      <svg
                        className="w-5 h-5 ml-auto text-[#58c896]"
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
                    ) : selectedOption === index ? (
                      <svg
                        className="w-5 h-5 ml-auto text-[#ff5e7d]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    ) : null)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`
                w-full py-3 rounded-lg font-medium transition-all
                ${
                  selectedOption !== null
                    ? "bg-[#8e5ff5] hover:bg-[#8e5ff5]/80 text-white"
                    : "bg-dark-200 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3 rounded-lg bg-[#28c7f9] hover:bg-[#28c7f9]/80 text-white font-medium"
            >
              {currentQuiz === quizzes.length - 1
                ? "Complete Quiz"
                : "Next Question"}
            </button>
          )}
        </div>
      </div>

      {isSubmitted && (
        <div
          className={`p-4 ${
            selectedOption === currentQuestion?.correctAnswer
              ? "bg-[#58c896]/10"
              : "bg-[#ff5e7d]/10"
          }`}
        >
          <div className="flex items-start">
            {selectedOption === currentQuestion?.correctAnswer ? (
              <>
                <div className="h-6 w-6 rounded-full bg-[#58c896]/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-[#58c896]"
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
                </div>
                <div>
                  <p className="text-[#58c896] font-medium">Correct!</p>
                  <p className="text-gray-400 text-sm">
                    Great job! {currentQuestion?.xpReward} XP has been added to
                    your account.
                    {correctStreak > 1 &&
                      ` +${
                        Math.min(correctStreak, 5) * 2
                      } bonus XP for your streak of ${correctStreak}!`}
                  </p>
                  {currentQuestion?.explanation && (
                    <p className="text-white text-sm mt-2 border-l-2 border-[#58c896] pl-2">
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="h-6 w-6 rounded-full bg-[#ff5e7d]/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-[#ff5e7d]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#ff5e7d] font-medium">Incorrect</p>
                  <p className="text-gray-400 text-sm">
                    The correct answer is option{" "}
                    {String.fromCharCode(65 + currentQuestion?.correctAnswer)}:{" "}
                    {currentQuestion?.options[currentQuestion.correctAnswer]}
                  </p>
                  {hearts <= 1 ? (
                    <p className="text-[#ff5e7d] text-sm font-medium mt-2">
                      You lost your last heart! Be careful with your next
                      answers.
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm mt-1">
                      You lost a heart. {hearts - 1} hearts remaining.
                    </p>
                  )}
                  {currentQuestion?.explanation && (
                    <p className="text-white text-sm mt-2 border-l-2 border-[#ff5e7d] pl-2">
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
