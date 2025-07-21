import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface AdminStats {
  totalUsers: number;
  totalQuizzes: number;
  totalCourses: number;
  totalAchievements: number;
  activeUsersToday: number;
  quizzesCompletedToday: number;
  averageScore: number;
  topPerformers: Array<{
    id: string;
    name: string;
    xp: number;
    level: number;
  }>;
}

export interface UserManagement {
  users: Array<{
    id: string;
    email: string;
    name: string;
    level: number;
    xp: number;
    role: "USER" | "ADMIN";
    plan: "FREE" | "PRO" | "PREMIUM";
    createdAt: string;
    lastActive: string;
  }>;
  totalUsers: number;
  currentPage: number;
  totalPages: number;
}

export interface QuizManagement {
  quizzes: Array<{
    id: string;
    title: string;
    difficulty: string;
    categoryId: string;
    isPublished: boolean;
    createdAt: string;
    _count: {
      attempts: number;
    };
  }>;
  totalQuizzes: number;
  currentPage: number;
  totalPages: number;
}

export interface AdminState {
  // Dashboard stats
  stats: AdminStats | null;

  // User management
  userManagement: UserManagement;
  selectedUser: UserManagement["users"][0] | null;

  // Quiz management
  quizManagement: QuizManagement;
  selectedQuiz: QuizManagement["quizzes"][0] | null;

  // Category management
  categories: Array<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
  }>;

  // Analytics
  analyticsData: {
    userActivity: Array<{
      date: string;
      activeUsers: number;
      quizzesCompleted: number;
      xpEarned: number;
    }>;
    quizPerformance: Array<{
      quizId: string;
      title: string;
      averageScore: number;
      completionRate: number;
      attempts: number;
    }>;
    learningProgress: Array<{
      category: string;
      completionRate: number;
      averageTime: number;
    }>;
  };

  // Loading states
  isLoadingStats: boolean;
  isLoadingUsers: boolean;
  isLoadingQuizzes: boolean;
  isLoadingAnalytics: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;

  // UI states
  selectedTab: "overview" | "users" | "quizzes" | "analytics" | "settings";
  showUserModal: boolean;
  showQuizModal: boolean;
  showDeleteConfirm: boolean;
  deleteTarget: { type: string; id: string } | null;
}

const initialState: AdminState = {
  stats: null,
  userManagement: {
    users: [],
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
  },
  selectedUser: null,
  quizManagement: {
    quizzes: [],
    totalQuizzes: 0,
    currentPage: 1,
    totalPages: 1,
  },
  selectedQuiz: null,
  categories: [],
  analyticsData: {
    userActivity: [],
    quizPerformance: [],
    learningProgress: [],
  },
  isLoadingStats: false,
  isLoadingUsers: false,
  isLoadingQuizzes: false,
  isLoadingAnalytics: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  selectedTab: "overview",
  showUserModal: false,
  showQuizModal: false,
  showDeleteConfirm: false,
  deleteTarget: null,
};

// Async thunks
export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch admin stats");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (
    params: { page?: number; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.search) queryParams.append("search", params.search);

      const response = await fetch(`/api/admin/users?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchQuizzes = createAsyncThunk(
  "admin/fetchQuizzes",
  async (
    params: { page?: number; category?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams({ admin: "true" });
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.category && params.category !== "all") {
        queryParams.append("categoryId", params.category);
      }

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

export const fetchAnalytics = createAsyncThunk(
  "admin/fetchAnalytics",
  async (timeRange: string = "30d", { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      return userId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  "admin/deleteQuiz",
  async (quizId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete quiz");
      }
      return quizId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setSelectedTab: (
      state,
      action: PayloadAction<AdminState["selectedTab"]>
    ) => {
      state.selectedTab = action.payload;
    },
    setSelectedUser: (
      state,
      action: PayloadAction<UserManagement["users"][0] | null>
    ) => {
      state.selectedUser = action.payload;
    },
    setSelectedQuiz: (
      state,
      action: PayloadAction<QuizManagement["quizzes"][0] | null>
    ) => {
      state.selectedQuiz = action.payload;
    },
    openUserModal: (
      state,
      action: PayloadAction<UserManagement["users"][0] | null>
    ) => {
      state.selectedUser = action.payload;
      state.showUserModal = true;
    },
    closeUserModal: (state) => {
      state.selectedUser = null;
      state.showUserModal = false;
    },
    openQuizModal: (
      state,
      action: PayloadAction<QuizManagement["quizzes"][0] | null>
    ) => {
      state.selectedQuiz = action.payload;
      state.showQuizModal = true;
    },
    closeQuizModal: (state) => {
      state.selectedQuiz = null;
      state.showQuizModal = false;
    },
    openDeleteConfirm: (
      state,
      action: PayloadAction<{ type: string; id: string }>
    ) => {
      state.deleteTarget = action.payload;
      state.showDeleteConfirm = true;
    },
    closeDeleteConfirm: (state) => {
      state.deleteTarget = null;
      state.showDeleteConfirm = false;
    },
    setUsersPage: (state, action: PayloadAction<number>) => {
      state.userManagement.currentPage = action.payload;
    },
    setQuizzesPage: (state, action: PayloadAction<number>) => {
      state.quizManagement.currentPage = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch admin stats
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.isLoadingStats = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.error = action.payload as string;
      });

    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.userManagement = {
          users: action.payload.users,
          totalUsers: action.payload.totalUsers,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.error = action.payload as string;
      });

    // Fetch quizzes
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.isLoadingQuizzes = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.isLoadingQuizzes = false;
        state.quizManagement = {
          quizzes: action.payload.quizzes || action.payload,
          totalQuizzes: action.payload.total || action.payload.length,
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
        };
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.isLoadingQuizzes = false;
        state.error = action.payload as string;
      });

    // Fetch analytics
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoadingAnalytics = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoadingAnalytics = false;
        state.analyticsData = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoadingAnalytics = false;
        state.error = action.payload as string;
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.userManagement.users = state.userManagement.users.filter(
          (user) => user.id !== action.payload
        );
        state.userManagement.totalUsers -= 1;
        state.showDeleteConfirm = false;
        state.deleteTarget = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });

    // Delete quiz
    builder
      .addCase(deleteQuiz.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.quizManagement.quizzes = state.quizManagement.quizzes.filter(
          (quiz) => quiz.id !== action.payload
        );
        state.quizManagement.totalQuizzes -= 1;
        state.showDeleteConfirm = false;
        state.deleteTarget = null;
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedTab,
  setSelectedUser,
  setSelectedQuiz,
  openUserModal,
  closeUserModal,
  openQuizModal,
  closeQuizModal,
  openDeleteConfirm,
  closeDeleteConfirm,
  setUsersPage,
  setQuizzesPage,
  setError,
} = adminSlice.actions;

export default adminSlice.reducer;
