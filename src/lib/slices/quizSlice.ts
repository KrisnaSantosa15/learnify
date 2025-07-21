import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  order: number;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  categoryId: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  xpReward: number;
  isPublished: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  maxScore: number;
  timeSpent: number;
  answers: Record<string, number>;
  isCompleted: boolean;
  completedAt?: string;
}

export interface QuizState {
  // Available quizzes
  quizzes: Quiz[];
  currentQuiz: Quiz | null;

  // Current quiz session
  currentQuestionIndex: number;
  userAnswers: Record<string, number>;
  startTime: number | null;
  timeRemaining: number | null;

  // Quiz results
  currentAttempt: QuizAttempt | null;
  score: number;
  showResults: boolean;
  showExplanation: boolean;

  // Quiz filters and pagination
  selectedCategory: string | null;
  selectedDifficulty: string | null;
  searchQuery: string;
  currentPage: number;
  totalPages: number;

  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // UI states
  showHint: boolean;
  hintsUsed: number;
  showConfetti: boolean;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  startTime: null,
  timeRemaining: null,
  currentAttempt: null,
  score: 0,
  showResults: false,
  showExplanation: false,
  selectedCategory: null,
  selectedDifficulty: null,
  searchQuery: "",
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  isSubmitting: false,
  error: null,
  showHint: false,
  hintsUsed: 0,
  showConfetti: false,
};

// Async thunks
export const fetchQuizzes = createAsyncThunk(
  "quiz/fetchQuizzes",
  async (
    params: {
      category?: string;
      difficulty?: string;
      search?: string;
      page?: number;
      admin?: boolean;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.category && params.category !== "all")
        queryParams.append("categoryId", params.category);
      if (params.difficulty)
        queryParams.append("difficulty", params.difficulty);
      if (params.search) queryParams.append("search", params.search);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.admin) queryParams.append("admin", "true");

      const response = await fetch(`/api/quizzes?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  "quiz/fetchById",
  async (quizId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch quiz");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const submitQuizAttempt = createAsyncThunk(
  "quiz/submitAttempt",
  async (
    attemptData: {
      quizId: string;
      answers: Record<string, number>;
      timeSpent: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/quiz-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attemptData),
      });
      if (!response.ok) {
        throw new Error("Failed to submit quiz attempt");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    startQuiz: (state, action: PayloadAction<Quiz>) => {
      state.currentQuiz = action.payload;
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
      state.startTime = Date.now();
      state.timeRemaining = action.payload.timeLimit
        ? action.payload.timeLimit * 60
        : null;
      state.score = 0;
      state.showResults = false;
      state.showExplanation = false;
      state.hintsUsed = 0;
      state.showHint = false;
      state.showConfetti = false;
    },
    answerQuestion: (
      state,
      action: PayloadAction<{ questionId: string; answer: number }>
    ) => {
      const { questionId, answer } = action.payload;
      state.userAnswers[questionId] = answer;
      state.showExplanation = false;
    },
    nextQuestion: (state) => {
      if (
        state.currentQuiz &&
        state.currentQuestionIndex < state.currentQuiz.questions.length - 1
      ) {
        state.currentQuestionIndex += 1;
        state.showExplanation = false;
        state.showHint = false;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        state.showExplanation = false;
        state.showHint = false;
      }
    },
    showQuestionExplanation: (state) => {
      state.showExplanation = true;
    },
    hideQuestionExplanation: (state) => {
      state.showExplanation = false;
    },
    showQuestionHint: (state) => {
      state.showHint = true;
      state.hintsUsed += 1;
    },
    hideQuestionHint: (state) => {
      state.showHint = false;
    },
    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    finishQuiz: (state) => {
      if (!state.currentQuiz) return;

      let totalScore = 0;
      let maxScore = 0;

      state.currentQuiz.questions.forEach((question) => {
        maxScore += question.points;
        const userAnswer = state.userAnswers[question.id];
        if (userAnswer === question.correctAnswer) {
          totalScore += question.points;
        }
      });

      state.score = totalScore;
      state.showResults = true;
      state.showConfetti = totalScore > maxScore * 0.8; // Show confetti if score > 80%
    },
    setQuizFilters: (
      state,
      action: PayloadAction<{
        category?: string | null;
        difficulty?: string | null;
        search?: string;
      }>
    ) => {
      const { category, difficulty, search } = action.payload;
      if (category !== undefined) state.selectedCategory = category;
      if (difficulty !== undefined) state.selectedDifficulty = difficulty;
      if (search !== undefined) state.searchQuery = search;
      state.currentPage = 1; // Reset to first page when filters change
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearQuiz: (state) => {
      state.currentQuiz = null;
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
      state.startTime = null;
      state.timeRemaining = null;
      state.currentAttempt = null;
      state.score = 0;
      state.showResults = false;
      state.showExplanation = false;
      state.hintsUsed = 0;
      state.showHint = false;
      state.showConfetti = false;
    },
    hideConfetti: (state) => {
      state.showConfetti = false;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch quizzes
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizzes = action.payload.quizzes || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch quiz by ID
    builder
      .addCase(fetchQuizById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Submit quiz attempt
    builder
      .addCase(submitQuizAttempt.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentAttempt = action.payload;
      })
      .addCase(submitQuizAttempt.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  startQuiz,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  showQuestionExplanation,
  hideQuestionExplanation,
  showQuestionHint,
  hideQuestionHint,
  updateTimeRemaining,
  finishQuiz,
  setQuizFilters,
  setCurrentPage,
  clearQuiz,
  hideConfetti,
  setError,
} = quizSlice.actions;

export default quizSlice.reducer;
