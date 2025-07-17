"use client";

import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiX,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiZap,
  FiLayers,
  FiClock,
  FiTarget,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiTrendingUp,
  FiBarChart,
  FiBook,
  FiEye,
  FiCopy,
} from "react-icons/fi";

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: Category;
  categoryId: string;
  difficulty: string;
  questions: QuizQuestion[];
  timeLimit: number;
  xpReward: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  attempts?: number;

  // Advanced settings
  randomizeQuestions?: boolean;
  showProgress?: boolean;
  allowRetakes?: boolean;
  showExplanations?: boolean;
  instantFeedback?: boolean;
  certificateEligible?: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
  order: number;
}

const QuizManager: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // AI Generator State
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [generatingQuizzes, setGeneratingQuizzes] = useState<string[]>([]);
  const [generatingDetails, setGeneratingDetails] = useState<{
    [key: string]: {
      placeholderQuiz: Quiz;
      generationParams: {
        topic: string;
        categoryId: string;
        difficulty: string;
        questionCount: number;
        includeCodeExamples: boolean;
        realWorldScenarios: boolean;
        templateType: string;
      };
    };
  }>({});
  const [aiSettings, setAiSettings] = useState({
    topic: "",
    categoryId: "",
    difficulty: "BEGINNER",
    questionCount: 5,
    questionStyle: "classic",
    customizations: {
      templateType: "multiple-choice",
      includeCodeExamples: false,
      realWorldScenarios: false,
      interactiveElements: false,
    },
  });

  // Advanced Quiz Builder State
  const [showAdvancedBuilder, setShowAdvancedBuilder] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    points: 10,
  });

  // Interface States
  const [viewMode, setViewMode] = useState<
    "dashboard" | "categories" | "analytics"
  >("dashboard");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<
    "title" | "category" | "difficulty" | "createdAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const difficultyLevels = [
    {
      value: "BEGINNER",
      label: "Beginner",
      emoji: "🌱",
      color: "green",
      points: 10,
    },
    {
      value: "INTERMEDIATE",
      label: "Intermediate",
      emoji: "🔥",
      color: "orange",
      points: 15,
    },
    {
      value: "ADVANCED",
      label: "Advanced",
      emoji: "⚡",
      color: "red",
      points: 20,
    },
    {
      value: "EXPERT",
      label: "Expert",
      emoji: "🚀",
      color: "purple",
      points: 25,
    },
  ];

  const questionStyles = [
    {
      id: "classic",
      name: "📝 Classic Quiz",
      description: "Traditional multiple choice questions, clean and focused",
      emoji: "📝",
      tags: ["Traditional", "Multiple Choice", "Fundamentals"],
      titleSuffix: "Fundamentals",
      descriptionTemplate:
        "Traditional quiz focusing on core concepts and fundamental knowledge",
      config: {
        templateType: "multiple-choice",
        includeCodeExamples: false,
        realWorldScenarios: false,
        interactiveElements: false,
      },
    },
    {
      id: "practical",
      name: "💼 Practical Code",
      description: "Code-focused questions with programming challenges",
      emoji: "💼",
      tags: ["Code Challenges", "Programming", "Hands-on"],
      titleSuffix: "Code Challenges",
      descriptionTemplate:
        "Practical coding quiz with real programming challenges and code completion exercises",
      config: {
        templateType: "code-completion",
        includeCodeExamples: true,
        realWorldScenarios: false,
        interactiveElements: false,
      },
    },
    {
      id: "scenario",
      name: "🌍 Real-World",
      description: "Workplace scenarios and practical applications",
      emoji: "🌍",
      tags: ["Real-World", "Scenarios", "Workplace"],
      titleSuffix: "Real-World Applications",
      descriptionTemplate:
        "Scenario-based quiz focusing on practical workplace applications and real-world problem solving",
      config: {
        templateType: "scenario-based",
        includeCodeExamples: false,
        realWorldScenarios: true,
        interactiveElements: false,
      },
    },
    {
      id: "interactive",
      name: "🎮 Interactive",
      description: "Engaging, modern questions with interactive elements",
      emoji: "🎮",
      tags: ["Interactive", "Modern", "Engaging"],
      titleSuffix: "Interactive Experience",
      descriptionTemplate:
        "Interactive quiz with engaging elements and modern question formats for enhanced learning",
      config: {
        templateType: "interactive-demo",
        includeCodeExamples: false,
        realWorldScenarios: false,
        interactiveElements: true,
      },
    },
    {
      id: "comprehensive",
      name: "🚀 Comprehensive",
      description:
        "Full-featured questions with code, scenarios, and interactivity",
      emoji: "🚀",
      tags: ["Comprehensive", "Advanced", "Full-Featured"],
      titleSuffix: "Mastery Challenge",
      descriptionTemplate:
        "Comprehensive quiz combining code challenges, real-world scenarios, and interactive elements for complete skill assessment",
      config: {
        templateType: "multiple-choice",
        includeCodeExamples: true,
        realWorldScenarios: true,
        interactiveElements: true,
      },
    },
  ];

  const continueBackgroundGeneration = async (
    quizId: string,
    details?: {
      placeholderQuiz: Quiz;
      generationParams: {
        topic: string;
        categoryId: string;
        difficulty: string;
        questionCount: number;
        includeCodeExamples: boolean;
        realWorldScenarios: boolean;
        templateType: string;
      };
    }
  ) => {
    if (!details) {
      // If no details available, just remove from generating list
      console.warn(
        `Quiz ${quizId} was generating before page refresh. Removing from generating list.`
      );
      setGeneratingQuizzes((prev) => prev.filter((id) => id !== quizId));
      setGeneratingDetails((prev) => {
        const updated = { ...prev };
        delete updated[quizId];
        return updated;
      });
      return;
    }

    // Continue generation with saved details
    try {
      const response = await fetch("/api/quizzes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details.generationParams),
      });

      if (response.ok) {
        const data = await response.json();

        // Create the final quiz
        const finalQuizData = {
          ...details.placeholderQuiz,
          questions: data.questions,
        };

        // Save the completed quiz
        const saveResponse = await fetch("/api/quizzes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalQuizData),
        });

        if (saveResponse.ok) {
          const savedQuiz = await saveResponse.json();

          // Remove the placeholder quiz and add the saved quiz
          setQuizzes((prev) =>
            prev.filter((quiz) => quiz.id !== quizId).concat([savedQuiz])
          );

          setSuccessMessage(
            `✅ Successfully completed "${details.placeholderQuiz.title}" quiz with ${data.questions.length} questions!`
          );
          setShowSuccess(true);

          // Refresh the full quiz list to ensure consistency
          fetchQuizzes();
        } else {
          throw new Error("Failed to save quiz");
        }
      } else {
        throw new Error("Failed to generate questions");
      }
    } catch (error) {
      handleGenerationError(quizId, error);
    } finally {
      // Clean up
      setGeneratingQuizzes((prev) => prev.filter((id) => id !== quizId));
      setGeneratingDetails((prev) => {
        const updated = { ...prev };
        delete updated[quizId];
        return updated;
      });
    }
  };

  const handleGenerationError = (quizId: string, error: unknown) => {
    console.error("AI generation failed:", error);

    // Remove failed quiz from list
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));

    // Determine error message based on error type
    let errorMessage = "❌ Failed to generate quiz. Please try again.";
    const errorMsg = error instanceof Error ? error.message : String(error);

    if (errorMsg.includes("overloaded") || errorMsg.includes("503")) {
      errorMessage =
        "🔄 AI service is currently overloaded. Please try again in a few moments.";
    } else if (errorMsg.includes("network") || errorMsg.includes("fetch")) {
      errorMessage =
        "🌐 Network error. Please check your connection and try again.";
    }

    setSuccessMessage(errorMessage);
    setShowSuccess(true);

    // Remove from generating list
    setGeneratingQuizzes((prev) => prev.filter((id) => id !== quizId));
    setGeneratingDetails((prev) => {
      const updated = { ...prev };
      delete updated[quizId];
      return updated;
    });
  };

  useEffect(() => {
    fetchQuizzes();
    fetchCategories();

    // Initialize generating quizzes from localStorage
    const storedGenerating = localStorage.getItem("generatingQuizzes");
    const storedDetails = localStorage.getItem("generatingDetails");

    if (storedGenerating && storedDetails) {
      try {
        const generating = JSON.parse(storedGenerating);
        const details = JSON.parse(storedDetails);
        setGeneratingQuizzes(generating);
        setGeneratingDetails(details);

        // Continue background generation for any existing generating quizzes
        generating.forEach((quizId: string) => {
          if (details[quizId]) {
            continueBackgroundGeneration(quizId, details[quizId]);
          }
        });
      } catch (error) {
        console.error(
          "Error loading generating quizzes from localStorage:",
          error
        );
        localStorage.removeItem("generatingQuizzes");
        localStorage.removeItem("generatingDetails");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-select first category when categories are loaded and none is selected
  useEffect(() => {
    if (categories.length > 0 && !aiSettings.categoryId) {
      setAiSettings((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [categories, aiSettings.categoryId]);

  // Persist generating quizzes to localStorage
  useEffect(() => {
    localStorage.setItem(
      "generatingQuizzes",
      JSON.stringify(generatingQuizzes)
    );
    localStorage.setItem(
      "generatingDetails",
      JSON.stringify(generatingDetails)
    );
  }, [generatingQuizzes, generatingDetails]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/quizzes?admin=true");
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleQuestionStyleSelect = (styleId: string) => {
    const selectedStyle = questionStyles.find((style) => style.id === styleId);
    if (selectedStyle) {
      setAiSettings((prev) => ({
        ...prev,
        questionStyle: styleId,
        customizations: selectedStyle.config,
      }));
    }
  };

  const generateQuestionsWithAI = async () => {
    // Validate that a category is selected
    if (!aiSettings.categoryId) {
      setSuccessMessage(
        "❌ Please select a category before generating quiz. Categories help organize your content!"
      );
      setShowSuccess(true);
      return;
    }

    // Validate that topic is not empty
    if (!aiSettings.topic.trim()) {
      setSuccessMessage(
        "❌ Please enter a topic for your quiz. Be specific for better AI generation!"
      );
      setShowSuccess(true);
      return;
    }

    // Find the selected category
    const selectedCategory = categories.find(
      (cat) => cat.id === aiSettings.categoryId
    );
    if (!selectedCategory) {
      setSuccessMessage(
        "❌ Selected category not found. Please refresh the page and try again."
      );
      setShowSuccess(true);
      return;
    }

    const quizId = `quiz_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Get selected question style for enhanced metadata
    const selectedStyle = questionStyles.find(
      (style) => style.id === aiSettings.questionStyle
    );

    // Create placeholder quiz immediately with enhanced titles and descriptions using real category
    const placeholderQuiz: Quiz = {
      id: quizId,
      title: `${aiSettings.topic} ${selectedStyle?.titleSuffix || "Quiz"}`,
      description: selectedStyle?.descriptionTemplate
        ? `${selectedStyle.descriptionTemplate} covering ${aiSettings.topic} concepts`
        : `AI-generated quiz covering ${aiSettings.topic} concepts`,
      category: selectedCategory,
      categoryId: selectedCategory.id,
      difficulty: aiSettings.difficulty,
      timeLimit: aiSettings.questionCount * 2,
      xpReward: aiSettings.questionCount * 20,
      questions: [],
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attempts: 0,
    };

    // Add to quizzes list with generating status
    setQuizzes((prev) => [placeholderQuiz, ...prev]);
    setGeneratingQuizzes((prev) => [...prev, quizId]);

    // Save generation details for persistence
    const generationParams = {
      topic: aiSettings.topic,
      categoryId: aiSettings.categoryId,
      difficulty: aiSettings.difficulty,
      questionCount: aiSettings.questionCount,
      includeCodeExamples: aiSettings.customizations.includeCodeExamples,
      realWorldScenarios: aiSettings.customizations.realWorldScenarios,
      templateType: aiSettings.customizations.templateType,
    };

    setGeneratingDetails((prev) => ({
      ...prev,
      [quizId]: {
        placeholderQuiz,
        generationParams,
      },
    }));

    // Close modal immediately
    setShowAIGenerator(false);

    // Show success message with style-specific title
    const quizTitle = `${aiSettings.topic} ${
      selectedStyle?.titleSuffix || "Quiz"
    }`;
    setSuccessMessage(
      `🚀 AI is generating your "${quizTitle}" in the background!`
    );
    setShowSuccess(true);

    try {
      // Generate questions in background
      const response = await fetch("/api/quizzes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generationParams),
      });

      if (response.ok) {
        const data = await response.json();

        // Create the actual quiz with generated questions
        const finalQuizData = {
          ...placeholderQuiz,
          questions: data.questions,
        };

        // Save the completed quiz
        const saveResponse = await fetch("/api/quizzes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalQuizData),
        });

        if (saveResponse.ok) {
          const savedQuiz = await saveResponse.json();

          // Remove the placeholder quiz and add the saved quiz
          setQuizzes((prev) =>
            prev.filter((quiz) => quiz.id !== quizId).concat([savedQuiz])
          );

          setSuccessMessage(
            `✅ Successfully generated "${aiSettings.topic}" quiz with ${data.questions.length} questions!`
          );
          setShowSuccess(true);

          // Refresh the full quiz list to ensure consistency
          fetchQuizzes();
        } else {
          throw new Error("Failed to save quiz");
        }
      } else {
        throw new Error("Failed to generate questions");
      }
    } catch (error) {
      handleGenerationError(quizId, error);
    } finally {
      // Remove from generating list
      setGeneratingQuizzes((prev) => prev.filter((id) => id !== quizId));
    }
  };

  const createAdvancedQuiz = async (formData: FormData) => {
    setLoading(true);
    try {
      const quizData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        categoryId: formData.get("categoryId") as string,
        difficulty: formData.get("difficulty") as string,
        timeLimit: parseInt(formData.get("timeLimit") as string),
        xpReward: parseInt(formData.get("xpReward") as string),
        questions: currentQuestions, // Include the questions
        isPublished: true, // Explicitly set as published when creating/updating

        // Advanced settings
        randomizeQuestions: formData.get("randomizeQuestions") === "on",
        showProgress: formData.get("showProgress") === "on",
        allowRetakes: formData.get("allowRetakes") === "on",
        showExplanations: formData.get("showExplanations") === "on",
        instantFeedback: formData.get("instantFeedback") === "on",
        certificateEligible: formData.get("certificateEligible") === "on",
      };

      const url = editingQuiz
        ? `/api/quizzes/${editingQuiz.id}`
        : "/api/quizzes";
      const method = editingQuiz ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        setSuccessMessage(
          editingQuiz
            ? "🎉 Quiz updated successfully!"
            : "🎉 Quiz created successfully with questions!"
        );
        setShowSuccess(true);
        setShowAdvancedBuilder(false);
        setCurrentQuestions([]); // Reset questions
        setEditingQuiz(null); // Reset editing state
        setCurrentQuestion({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
          points: 1,
        });
        setEditingQuestionIndex(null);
        fetchQuizzes();
      }
    } catch (error) {
      console.error("Error creating/updating quiz:", error);
      setSuccessMessage("❌ Failed to save quiz. Please try again.");
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    // Get form data from the current form state
    const formElement = document.querySelector("form") as HTMLFormElement;
    if (!formElement) return;

    const formData = new FormData(formElement);

    setLoading(true);
    try {
      const quizData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        categoryId: formData.get("categoryId") as string,
        difficulty: formData.get("difficulty") as string,
        timeLimit: parseInt(formData.get("timeLimit") as string),
        xpReward: parseInt(formData.get("xpReward") as string),
        questions: currentQuestions, // Include the questions
        isPublished: false, // Explicitly set as draft

        // Advanced settings
        randomizeQuestions: formData.get("randomizeQuestions") === "on",
        showProgress: formData.get("showProgress") === "on",
        allowRetakes: formData.get("allowRetakes") === "on",
        showExplanations: formData.get("showExplanations") === "on",
        instantFeedback: formData.get("instantFeedback") === "on",
        certificateEligible: formData.get("certificateEligible") === "on",
      };

      const url = editingQuiz
        ? `/api/quizzes/${editingQuiz.id}`
        : "/api/quizzes";
      const method = editingQuiz ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        setSuccessMessage(
          editingQuiz
            ? "📝 Quiz draft updated successfully!"
            : "📝 Quiz draft saved successfully!"
        );
        setShowSuccess(true);
        fetchQuizzes();

        // Close modal and reset form state
        setShowAdvancedBuilder(false);
        setEditingQuiz(null);
        setCurrentQuestions([]);
        setCurrentQuestion({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
          points: 1,
        });
        setEditingQuestionIndex(null);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      setSuccessMessage("❌ Failed to save draft. Please try again.");
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    if (
      currentQuestion.question &&
      currentQuestion.options.every((opt) => opt.trim())
    ) {
      if (editingQuestionIndex !== null) {
        // Edit existing question
        const updatedQuestions = [...currentQuestions];
        updatedQuestions[editingQuestionIndex] = {
          ...updatedQuestions[editingQuestionIndex],
          question: currentQuestion.question,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correctAnswer,
          explanation: currentQuestion.explanation,
          points: currentQuestion.points,
        };
        setCurrentQuestions(updatedQuestions);
        setEditingQuestionIndex(null);
      } else {
        // Add new question
        const newQuestion: QuizQuestion = {
          id: `temp-${Date.now()}`,
          question: currentQuestion.question,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correctAnswer,
          explanation: currentQuestion.explanation,
          points: currentQuestion.points,
          order: currentQuestions.length + 1,
        };
        setCurrentQuestions([...currentQuestions, newQuestion]);
      }

      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        points: 10,
      });
      setShowQuestionModal(false);
    }
  };

  const editQuestion = (index: number) => {
    const question = currentQuestions[index];
    setCurrentQuestion({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
      points: question.points,
    });
    setEditingQuestionIndex(index);
    setShowQuestionModal(true);
  };

  const deleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessMessage("🗑️ Quiz deleted successfully!");
        setShowSuccess(true);
        fetchQuizzes();
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const cloneQuiz = async (quiz: Quiz) => {
    try {
      const clonedQuiz = {
        ...quiz,
        title: `${quiz.title} (Copy)`,
        questions: quiz.questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points,
        })),
      };

      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clonedQuiz),
      });

      if (response.ok) {
        setSuccessMessage("📋 Quiz cloned successfully!");
        setShowSuccess(true);
        fetchQuizzes();
      }
    } catch (error) {
      console.error("Error cloning quiz:", error);
    }
  };

  const editQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setCurrentQuestions(quiz.questions);
    setShowAdvancedBuilder(true);
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    // Safely handle undefined/null properties
    const title = quiz.title || "";
    const description = quiz.description || "";
    const category = quiz.category?.name || "";
    const difficulty = quiz.difficulty || "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || category === filterCategory;
    const matchesDifficulty =
      filterDifficulty === "all" || difficulty === filterDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Sorting logic
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    let aValue: string | number = "";
    let bValue: string | number = "";

    switch (sortBy) {
      case "title":
        aValue = (a.title || "").toLowerCase();
        bValue = (b.title || "").toLowerCase();
        break;
      case "category":
        aValue = (a.category?.name || "").toLowerCase();
        bValue = (b.category?.name || "").toLowerCase();
        break;
      case "difficulty":
        const difficultyOrder = {
          BEGINNER: 0,
          INTERMEDIATE: 1,
          ADVANCED: 2,
          EXPERT: 3,
        };
        aValue =
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
        bValue =
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt || "").getTime();
        bValue = new Date(b.createdAt || "").getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalItems = sortedQuizzes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuizzes = sortedQuizzes.slice(startIndex, endIndex);

  // Sort handler
  const handleSort = (
    column: "title" | "category" | "difficulty" | "createdAt"
  ) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const organizedQuizzes = categories.reduce((acc, category) => {
    acc[category.name] = sortedQuizzes.filter(
      (quiz) => quiz.category?.id === category.id
    );
    return acc;
  }, {} as Record<string, Quiz[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-xl border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🚀 Quiz Manager
              </h1>
              <p className="text-gray-600 mt-2">
                AI-Powered Learning Management System with Advanced Analytics
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Switcher */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {[
                  { mode: "dashboard", icon: FiBarChart, label: "Dashboard" },
                  { mode: "categories", icon: FiLayers, label: "Categories" },
                  { mode: "analytics", icon: FiTrendingUp, label: "Analytics" },
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() =>
                      setViewMode(
                        mode as "dashboard" | "categories" | "analytics"
                      )
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      viewMode === mode
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setShowAIGenerator(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiZap className="w-5 h-5" />
                AI Generator
              </button>

              <button
                onClick={() => setShowAdvancedBuilder(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5" />
                Advanced Builder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Search & Filters */}
      <div className="px-8 py-6 bg-white border-b border-gray-100">
        <div className="flex items-center gap-6">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search quizzes with AI-powered suggestions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900 placeholder-gray-500 text-sm"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-white text-gray-900 text-sm min-w-[200px]"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-white text-gray-900 text-sm min-w-[150px]"
          >
            <option value="all">All Levels</option>
            {difficultyLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.emoji} {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dashboard View */}
      {viewMode === "dashboard" && (
        <div className="p-8">
          {/* Advanced Data Table with Integrated Stats */}
          {filteredQuizzes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="max-w-md mx-auto">
                <FiBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Quizzes Found
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first quiz with our AI-powered
                  generator or advanced builder.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowAIGenerator(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                  >
                    <FiZap className="w-5 h-5" />
                    AI Generator
                  </button>
                  <button
                    onClick={() => setShowAdvancedBuilder(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    <FiPlus className="w-5 h-5" />
                    Create Quiz
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Integrated Stats Header */}
              <div className="px-6 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-xs font-medium uppercase tracking-wide">
                          Total Quizzes
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {quizzes.length}
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FiBook className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-xs font-medium uppercase tracking-wide">
                          Published
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {quizzes.filter((q) => q.isPublished).length}
                        </p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FiEye className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-xs font-medium uppercase tracking-wide">
                          Total Questions
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {quizzes.reduce(
                            (sum, q) => sum + (q.questions?.length || 0),
                            0
                          )}
                        </p>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FiTarget className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-xs font-medium uppercase tracking-wide">
                          Categories
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {categories.length}
                        </p>
                      </div>
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FiLayers className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Quiz Management
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalItems)}{" "}
                      of {totalItems} quizzes
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Show:
                      </label>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-900 bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-sm font-medium text-gray-700">
                        per page
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("title")}
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          Quiz Info
                          {sortBy === "title" &&
                            (sortOrder === "asc" ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("category")}
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          Category
                          {sortBy === "category" &&
                            (sortOrder === "asc" ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("difficulty")}
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          Difficulty
                          {sortBy === "difficulty" &&
                            (sortOrder === "asc" ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("createdAt")}
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          Created
                          {sortBy === "createdAt" &&
                            (sortOrder === "asc" ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedQuizzes.map((quiz, index) => (
                      <tr
                        key={quiz.id || `quiz-${index}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {startIndex + index + 1}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                  {quiz.title}
                                </h4>
                                {generatingQuizzes.includes(quiz.id) && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                    <FiRefreshCw className="w-3 h-3 animate-spin" />
                                    Generating...
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {quiz.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <FiClock className="w-3 h-3" />
                                  {quiz.timeLimit}min
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiTarget className="w-3 h-3" />
                                  {quiz.xpReward} XP
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {quiz.category?.icon} {quiz.category?.name}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              quiz.difficulty === "BEGINNER"
                                ? "bg-green-100 text-green-800"
                                : quiz.difficulty === "INTERMEDIATE"
                                ? "bg-orange-100 text-orange-800"
                                : quiz.difficulty === "ADVANCED"
                                ? "bg-red-100 text-red-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {difficultyLevels.find(
                              (d) => d.value === quiz.difficulty
                            )?.label || quiz.difficulty}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {quiz.questions?.length || 0}
                            </span>
                            <span className="text-xs text-gray-500">
                              questions
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              quiz.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {quiz.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {new Date(
                              quiz.createdAt || ""
                            ).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                alert(
                                  `Viewing: ${quiz.title}\n${
                                    quiz.questions?.length || 0
                                  } questions\nDifficulty: ${quiz.difficulty}`
                                )
                              }
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Quiz"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => editQuiz(quiz)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Quiz"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => cloneQuiz(quiz)}
                              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Clone Quiz"
                            >
                              <FiCopy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteQuiz(quiz.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Quiz"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-800">
                      Showing{" "}
                      <span className="font-bold text-blue-600">
                        {startIndex + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold text-blue-600">
                        {Math.min(endIndex, totalItems)}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-blue-600">
                        {totalItems}
                      </span>{" "}
                      results
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                  currentPage === pageNum
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-700 bg-white hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-300"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Categories View */}
      {viewMode === "categories" && (
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quiz Categories
            </h2>
            <p className="text-gray-600">
              Organize and manage quizzes by category for better structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryQuizzes = organizedQuizzes[category.name] || [];
              const totalQuestions = categoryQuizzes.reduce(
                (sum, q) => sum + (q.questions?.length || 0),
                0
              );
              const publishedCount = categoryQuizzes.filter(
                (q) => q.isPublished
              ).length;

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.icon} {category.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowAdvancedBuilder(true)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Total Quizzes
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {categoryQuizzes.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Published</span>
                        <span className="text-sm font-semibold text-green-600">
                          {publishedCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Total Questions
                        </span>
                        <span className="text-sm font-semibold text-purple-600">
                          {totalQuestions}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs text-gray-500">
                          {publishedCount}/{categoryQuizzes.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              categoryQuizzes.length > 0
                                ? (publishedCount / categoryQuizzes.length) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {categoryQuizzes.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Recent Quizzes
                      </h4>
                      <div className="space-y-2">
                        {categoryQuizzes.slice(0, 3).map((quiz, index) => (
                          <div
                            key={quiz.id || `category-quiz-${index}`}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-600 truncate flex-1">
                              {quiz.title}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                quiz.isPublished
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {quiz.isPublished ? "Published" : "Draft"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analytics View */}
      {viewMode === "analytics" && (
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quiz Analytics Dashboard
            </h2>
            <p className="text-gray-600">
              Comprehensive insights into your quiz performance and engagement
              metrics.
            </p>
          </div>

          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Attempts</p>
                  <p className="text-3xl font-bold">
                    {quizzes.reduce((sum, q) => sum + (q.attempts || 0), 0)}
                  </p>
                </div>
                <FiTrendingUp className="w-8 h-8 text-blue-200" />
              </div>
              <div className="mt-4">
                <span className="text-blue-100 text-sm">
                  ↗ +12% from last month
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Avg. Score</p>
                  <p className="text-3xl font-bold">87%</p>
                </div>
                <FiTarget className="w-8 h-8 text-green-200" />
              </div>
              <div className="mt-4">
                <span className="text-green-100 text-sm">
                  ↗ +5% improvement
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold">92%</p>
                </div>
                <FiBarChart className="w-8 h-8 text-purple-200" />
              </div>
              <div className="mt-4">
                <span className="text-purple-100 text-sm">↗ +8% this week</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Active Users</p>
                  <p className="text-3xl font-bold">1,247</p>
                </div>
                <FiUsers className="w-8 h-8 text-orange-200" />
              </div>
              <div className="mt-4">
                <span className="text-orange-100 text-sm">↗ +15% growth</span>
              </div>
            </div>
          </div>

          {/* Performance by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiBarChart className="w-5 h-5 text-blue-600" />
                Performance by Category
              </h3>

              <div className="space-y-4">
                {categories.map((category) => {
                  const categoryQuizzes = organizedQuizzes[category.name] || [];
                  const percentage =
                    categoryQuizzes.length > 0
                      ? Math.floor(Math.random() * 40) + 60
                      : 0; // Show 0% if no quizzes in category

                  return (
                    <div key={category.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {category.icon} {category.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {categoryQuizzes.length} quiz
                          {categoryQuizzes.length !== 1 ? "es" : ""} (
                          {percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-green-600" />
                Top Performing Quizzes
              </h3>

              <div className="space-y-4">
                {filteredQuizzes.slice(0, 5).map((quiz, index) => (
                  <div
                    key={quiz.id || `top-quiz-${index}`}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {quiz.title}
                        </h4>
                        {generatingQuizzes.includes(quiz.id) && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                            <FiRefreshCw className="w-3 h-3 animate-spin" />
                            AI Generating...
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        {quiz.category?.icon} {quiz.category?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        {90 + index}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {quiz.attempts || 0} attempts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiClock className="w-5 h-5 text-purple-600" />
              Recent Activity
            </h3>

            <div className="space-y-4">
              {[
                {
                  action: "Quiz completed",
                  quiz: "JavaScript Fundamentals",
                  user: "John Doe",
                  time: "2 minutes ago",
                  score: "95%",
                },
                {
                  action: "New quiz created",
                  quiz: "React Hooks Deep Dive",
                  user: "Admin",
                  time: "1 hour ago",
                  score: "",
                },
                {
                  action: "Quiz published",
                  quiz: "CSS Layout Fundamentals",
                  user: "Admin",
                  time: "3 hours ago",
                  score: "",
                },
                {
                  action: "Quiz completed",
                  quiz: "Python Data Structures",
                  user: "Jane Smith",
                  time: "5 hours ago",
                  score: "88%",
                },
                {
                  action: "Quiz updated",
                  quiz: "JavaScript Advanced Concepts",
                  user: "Admin",
                  time: "1 day ago",
                  score: "",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white">
                    <FiTarget className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{activity.quiz}</span> by{" "}
                      {activity.user}
                      {activity.score && (
                        <span className="ml-2 text-green-600 font-medium">
                          {activity.score}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    🤖 AI Question Generator
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Generate intelligent, adaptive questions using advanced AI
                    algorithms
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAIGenerator(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* AI Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      🎯 Topic & Subject Area
                    </label>
                    <input
                      type="text"
                      value={aiSettings.topic}
                      onChange={(e) =>
                        setAiSettings((prev) => ({
                          ...prev,
                          topic: e.target.value,
                        }))
                      }
                      placeholder="e.g., JavaScript Promises, React Hooks, Python Classes..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-900 placeholder-gray-500 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      🏷️ Category
                    </label>
                    <select
                      value={aiSettings.categoryId}
                      onChange={(e) =>
                        setAiSettings((prev) => ({
                          ...prev,
                          categoryId: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 bg-white text-gray-900 text-sm"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      ⚡ Difficulty Level
                    </label>
                    <select
                      value={aiSettings.difficulty}
                      onChange={(e) =>
                        setAiSettings((prev) => ({
                          ...prev,
                          difficulty: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 bg-white text-gray-900 text-sm"
                    >
                      {difficultyLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.emoji} {level.label} ({level.points}pts)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      📊 Question Count
                    </label>
                    <select
                      value={aiSettings.questionCount}
                      onChange={(e) =>
                        setAiSettings((prev) => ({
                          ...prev,
                          questionCount: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 bg-white text-gray-900 text-sm"
                    >
                      {[5, 10, 15, 20, 25, 30].map((count) => (
                        <option key={count} value={count}>
                          {count} questions
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Question Styles */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiZap className="w-5 h-5 text-purple-600" />
                    Smart Question Styles
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">
                    Choose a question style that automatically configures all
                    settings for the best experience
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {questionStyles.map((style) => (
                      <div
                        key={style.id}
                        onClick={() => handleQuestionStyleSelect(style.id)}
                        className={`group p-4 border-2 rounded-xl transition-all cursor-pointer ${
                          aiSettings.questionStyle === style.id
                            ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                            : "border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{style.emoji}</div>
                          <h5
                            className={`font-semibold text-sm mb-2 ${
                              aiSettings.questionStyle === style.id
                                ? "text-purple-900"
                                : "text-gray-900"
                            }`}
                          >
                            {style.name}
                          </h5>
                          <p className="text-xs text-gray-600 leading-relaxed mb-3">
                            {style.description}
                          </p>

                          {/* Show style tags */}
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {style.tags?.map((tag, index) => (
                                <span
                                  key={index}
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    aiSettings.questionStyle === style.id
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Show quiz preview info */}
                          {aiSettings.topic && (
                            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-500">Preview:</p>
                              <p className="text-xs font-medium text-gray-700 truncate">
                                {aiSettings.topic} {style.titleSuffix}
                              </p>
                            </div>
                          )}

                          {/* Show configuration preview */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {style.config.includeCodeExamples && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                  Code
                                </span>
                              )}
                              {style.config.realWorldScenarios && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                  Scenarios
                                </span>
                              )}
                              {style.config.interactiveElements && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                                  Interactive
                                </span>
                              )}
                              {!style.config.includeCodeExamples &&
                                !style.config.realWorldScenarios &&
                                !style.config.interactiveElements && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    Classic
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowAIGenerator(false);
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateQuestionsWithAI}
                    disabled={loading || !aiSettings.topic}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <FiRefreshCw className="w-5 h-5 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <FiZap className="w-5 h-5" />
                        Generate{" "}
                        {
                          questionStyles.find(
                            (s) => s.id === aiSettings.questionStyle
                          )?.name
                        }{" "}
                        Questions
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Builder Modal */}
      {showAdvancedBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    🚀 {editingQuiz ? "Edit Quiz" : "Advanced Quiz Builder"}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {editingQuiz
                      ? "Update your quiz with new questions and settings"
                      : "Create professional quizzes with advanced features and customization options"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAdvancedBuilder(false);
                    setEditingQuiz(null);
                    setCurrentQuestions([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  createAdvancedQuiz(formData);
                }}
              >
                {/* Basic Quiz Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FiBook className="w-5 h-5 text-blue-600" />
                    Quiz Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        📝 Quiz Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editingQuiz?.title || ""}
                        placeholder="Enter an engaging quiz title..."
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900 placeholder-gray-500 text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        🏷️ Category
                      </label>
                      <select
                        name="categoryId"
                        defaultValue={editingQuiz?.categoryId || ""}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-white text-gray-900 text-sm"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      📄 Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingQuiz?.description || ""}
                      rows={4}
                      placeholder="Provide a detailed description of what students will learn..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900 placeholder-gray-500 text-sm transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        ⚡ Difficulty Level
                      </label>
                      <select
                        name="difficulty"
                        defaultValue={editingQuiz?.difficulty || ""}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-white text-gray-900 text-sm"
                      >
                        {difficultyLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.emoji} {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        ⏱️ Time Limit (minutes)
                      </label>
                      <input
                        type="number"
                        name="timeLimit"
                        min="5"
                        max="180"
                        defaultValue={editingQuiz?.timeLimit || "30"}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900 text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        🎯 XP Reward
                      </label>
                      <input
                        type="number"
                        name="xpReward"
                        min="10"
                        max="1000"
                        defaultValue={editingQuiz?.xpReward || "100"}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900 text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FiZap className="w-5 h-5 text-purple-600" />
                    Advanced Settings
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        key: "randomizeQuestions",
                        label: "🎲 Randomize Question Order",
                        desc: "Questions appear in random order for each attempt",
                      },
                      {
                        key: "showProgress",
                        label: "📊 Show Progress Bar",
                        desc: "Display completion progress to students",
                      },
                      {
                        key: "allowRetakes",
                        label: "🔄 Allow Retakes",
                        desc: "Students can retake the quiz multiple times",
                      },
                      {
                        key: "showExplanations",
                        label: "💡 Show Explanations",
                        desc: "Display explanations after each question",
                      },
                      {
                        key: "instantFeedback",
                        label: "⚡ Instant Feedback",
                        desc: "Show correct/incorrect immediately",
                      },
                      {
                        key: "certificateEligible",
                        label: "🏆 Certificate Eligible",
                        desc: "High scores earn completion certificates",
                      },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={key}
                          name={key}
                          defaultChecked={
                            editingQuiz
                              ? (editingQuiz[key as keyof Quiz] as boolean)
                              : key === "showProgress" ||
                                key === "allowRetakes" ||
                                key === "showExplanations"
                          }
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-1"
                        />
                        <div>
                          <label
                            htmlFor={key}
                            className="text-sm font-medium text-gray-900 cursor-pointer"
                          >
                            {label}
                          </label>
                          <p className="text-xs text-gray-600 mt-1">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question Management */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FiTarget className="w-5 h-5 text-green-600" />
                      Quiz Questions ({currentQuestions.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowQuestionModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  {currentQuestions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FiTarget className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>
                        No questions added yet. Click &ldquo;Add Question&rdquo;
                        to start building your quiz.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentQuestions.map((question, index) => (
                        <div
                          key={question.id}
                          className="bg-white rounded-lg p-4 border border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </span>
                                <h5 className="font-medium text-gray-900">
                                  {question.question}
                                </h5>
                              </div>
                              <div className="ml-9 space-y-1">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`text-sm ${
                                      optIndex === question.correctAnswer
                                        ? "text-green-600 font-medium"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIndex)}.{" "}
                                    {option}{" "}
                                    {optIndex === question.correctAnswer && "✓"}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => editQuestion(index)}
                                className="text-blue-500 hover:text-blue-700 p-1"
                                title="Edit Question"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setCurrentQuestions(
                                    currentQuestions.filter(
                                      (q) => q.id !== question.id
                                    )
                                  )
                                }
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Delete Question"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedBuilder(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <FiEye className="w-4 h-4" />
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiZap className="w-5 h-5" />
                    {editingQuiz ? "Update Quiz" : "Create Quiz"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Question Creation Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingQuestionIndex !== null
                    ? "Edit Question"
                    : "Add New Question"}
                </h3>
                <button
                  onClick={() => {
                    setShowQuestionModal(false);
                    setEditingQuestionIndex(null);
                    setCurrentQuestion({
                      question: "",
                      options: ["", "", "", ""],
                      correctAnswer: 0,
                      explanation: "",
                      points: 10,
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Question
                  </label>
                  <textarea
                    value={currentQuestion.question}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        question: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Enter your question here..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white text-gray-900 placeholder-gray-500 text-sm transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Answer Options
                  </label>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="correct-answer"
                          checked={currentQuestion.correctAnswer === index}
                          onChange={() =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              correctAnswer: index,
                            })
                          }
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion({
                              ...currentQuestion,
                              options: newOptions,
                            });
                          }}
                          placeholder={`Option ${String.fromCharCode(
                            65 + index
                          )}`}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 bg-white text-gray-900 placeholder-gray-500 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Explanation (Optional)
                  </label>
                  <textarea
                    value={currentQuestion.explanation}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        explanation: e.target.value,
                      })
                    }
                    rows={2}
                    placeholder="Explain why this is the correct answer..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 bg-white text-gray-900 placeholder-gray-500 text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={currentQuestion.points}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        points: parseInt(e.target.value) || 10,
                      })
                    }
                    min="1"
                    max="100"
                    className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 bg-white text-gray-900 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowQuestionModal(false);
                    setEditingQuestionIndex(null);
                    setCurrentQuestion({
                      question: "",
                      options: ["", "", "", ""],
                      correctAnswer: 0,
                      explanation: "",
                      points: 10,
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addQuestion}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  {editingQuestionIndex !== null
                    ? "Update Question"
                    : "Add Question"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-3">
          <FiZap className="w-5 h-5" />
          {successMessage}
          <button
            onClick={() => setShowSuccess(false)}
            className="text-green-200 hover:text-white"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizManager;
