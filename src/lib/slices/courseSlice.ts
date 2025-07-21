import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Course {
  id: string;
  title: string;
  description?: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  technology: string;
  thumbnail?: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  content: Record<string, unknown>;
  order: number;
  courseId: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: Record<string, unknown>;
  type: "THEORY" | "PRACTICE" | "QUIZ" | "PROJECT";
  order: number;
  moduleId: string;
  xpReward: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  isCompleted: boolean;
  completedAt?: string;
  progress: number;
  timeSpent: number;
  lastAccessed: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseState {
  // Available courses
  courses: Course[];
  currentCourse: Course | null;

  // Course content
  modules: Module[];
  lessons: Lesson[];
  currentModule: Module | null;
  currentLesson: Lesson | null;

  // Progress tracking
  courseProgress: CourseProgress[];
  currentProgress: CourseProgress | null;

  // Course filters and search
  selectedTechnology: string | null;
  selectedDifficulty: string | null;
  searchQuery: string;

  // Navigation
  currentModuleIndex: number;
  currentLessonIndex: number;

  // Learning session
  sessionStartTime: number | null;
  sessionTimeSpent: number;

  // Loading states
  isLoading: boolean;
  isLoadingContent: boolean;
  isUpdatingProgress: boolean;
  error: string | null;

  // UI states
  showProgressModal: boolean;
  showCertificateModal: boolean;
  completedLessons: string[];
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  modules: [],
  lessons: [],
  currentModule: null,
  currentLesson: null,
  courseProgress: [],
  currentProgress: null,
  selectedTechnology: null,
  selectedDifficulty: null,
  searchQuery: "",
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  sessionStartTime: null,
  sessionTimeSpent: 0,
  isLoading: false,
  isLoadingContent: false,
  isUpdatingProgress: false,
  error: null,
  showProgressModal: false,
  showCertificateModal: false,
  completedLessons: [],
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async (
    params: {
      technology?: string;
      difficulty?: string;
      search?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.technology && params.technology !== "all") {
        queryParams.append("technology", params.technology);
      }
      if (params.difficulty) {
        queryParams.append("difficulty", params.difficulty);
      }
      if (params.search) {
        queryParams.append("search", params.search);
      }

      const response = await fetch(`/api/courses?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchCourseContent = createAsyncThunk(
  "course/fetchContent",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/content`);
      if (!response.ok) {
        throw new Error("Failed to fetch course content");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchUserProgress = createAsyncThunk(
  "course/fetchProgress",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/progress/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user progress");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const updateLessonProgress = createAsyncThunk(
  "course/updateLessonProgress",
  async (
    params: {
      lessonId: string;
      moduleId: string;
      courseId: string;
      timeSpent: number;
      isCompleted: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/progress/lesson", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error("Failed to update lesson progress");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    selectCourse: (state, action: PayloadAction<Course>) => {
      state.currentCourse = action.payload;
      state.currentModuleIndex = 0;
      state.currentLessonIndex = 0;
    },
    selectModule: (
      state,
      action: PayloadAction<{ module: Module; index: number }>
    ) => {
      state.currentModule = action.payload.module;
      state.currentModuleIndex = action.payload.index;
      state.currentLessonIndex = 0;

      // Find lessons for this module
      const moduleLessons = state.lessons.filter(
        (l) => l.moduleId === action.payload.module.id
      );
      if (moduleLessons.length > 0) {
        state.currentLesson = moduleLessons[0];
      }
    },
    selectLesson: (
      state,
      action: PayloadAction<{ lesson: Lesson; index: number }>
    ) => {
      state.currentLesson = action.payload.lesson;
      state.currentLessonIndex = action.payload.index;
    },
    nextLesson: (state) => {
      const currentModuleLessons = state.lessons
        .filter((l) => l.moduleId === state.currentModule?.id)
        .sort((a, b) => a.order - b.order);

      if (state.currentLessonIndex < currentModuleLessons.length - 1) {
        state.currentLessonIndex += 1;
        state.currentLesson = currentModuleLessons[state.currentLessonIndex];
      } else {
        // Move to next module
        if (state.currentModuleIndex < state.modules.length - 1) {
          state.currentModuleIndex += 1;
          state.currentModule = state.modules[state.currentModuleIndex];
          state.currentLessonIndex = 0;

          const nextModuleLessons = state.lessons
            .filter(
              (l) =>
                state.currentModule && l.moduleId === state.currentModule.id
            )
            .sort((a, b) => a.order - b.order);

          if (nextModuleLessons.length > 0) {
            state.currentLesson = nextModuleLessons[0];
          }
        }
      }
    },
    previousLesson: (state) => {
      if (state.currentLessonIndex > 0) {
        state.currentLessonIndex -= 1;
        const currentModuleLessons = state.lessons
          .filter((l) => l.moduleId === state.currentModule?.id)
          .sort((a, b) => a.order - b.order);
        state.currentLesson = currentModuleLessons[state.currentLessonIndex];
      } else {
        // Move to previous module
        if (state.currentModuleIndex > 0) {
          state.currentModuleIndex -= 1;
          state.currentModule = state.modules[state.currentModuleIndex];

          const prevModuleLessons = state.lessons
            .filter(
              (l) =>
                state.currentModule && l.moduleId === state.currentModule.id
            )
            .sort((a, b) => a.order - b.order);

          if (prevModuleLessons.length > 0) {
            state.currentLessonIndex = prevModuleLessons.length - 1;
            state.currentLesson = prevModuleLessons[state.currentLessonIndex];
          }
        }
      }
    },
    startLearningSession: (state) => {
      state.sessionStartTime = Date.now();
      state.sessionTimeSpent = 0;
    },
    updateSessionTime: (state) => {
      if (state.sessionStartTime) {
        state.sessionTimeSpent = Date.now() - state.sessionStartTime;
      }
    },
    endLearningSession: (state) => {
      state.sessionStartTime = null;
    },
    markLessonCompleted: (state, action: PayloadAction<string>) => {
      const lessonId = action.payload;
      if (!state.completedLessons.includes(lessonId)) {
        state.completedLessons.push(lessonId);
      }

      // Update lesson in state
      const lesson = state.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        lesson.isCompleted = true;
      }
    },
    setCourseFilters: (
      state,
      action: PayloadAction<{
        technology?: string | null;
        difficulty?: string | null;
        search?: string;
      }>
    ) => {
      const { technology, difficulty, search } = action.payload;
      if (technology !== undefined) state.selectedTechnology = technology;
      if (difficulty !== undefined) state.selectedDifficulty = difficulty;
      if (search !== undefined) state.searchQuery = search;
    },
    showProgressModal: (state) => {
      state.showProgressModal = true;
    },
    hideProgressModal: (state) => {
      state.showProgressModal = false;
    },
    showCertificateModal: (state) => {
      state.showCertificateModal = true;
    },
    hideCertificateModal: (state) => {
      state.showCertificateModal = false;
    },
    clearCourseData: (state) => {
      state.currentCourse = null;
      state.modules = [];
      state.lessons = [];
      state.currentModule = null;
      state.currentLesson = null;
      state.currentModuleIndex = 0;
      state.currentLessonIndex = 0;
      state.sessionStartTime = null;
      state.sessionTimeSpent = 0;
      state.completedLessons = [];
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch course content
    builder
      .addCase(fetchCourseContent.pending, (state) => {
        state.isLoadingContent = true;
        state.error = null;
      })
      .addCase(fetchCourseContent.fulfilled, (state, action) => {
        state.isLoadingContent = false;
        state.modules = action.payload.modules || [];
        state.lessons = action.payload.lessons || [];

        // Set initial module and lesson
        if (state.modules.length > 0) {
          state.currentModule = state.modules[0];
          const firstModuleLessons = state.lessons
            .filter((l) => l.moduleId === state.modules[0].id)
            .sort((a, b) => a.order - b.order);

          if (firstModuleLessons.length > 0) {
            state.currentLesson = firstModuleLessons[0];
          }
        }
      })
      .addCase(fetchCourseContent.rejected, (state, action) => {
        state.isLoadingContent = false;
        state.error = action.payload as string;
      });

    // Fetch user progress
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courseProgress = action.payload;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update lesson progress
    builder
      .addCase(updateLessonProgress.pending, (state) => {
        state.isUpdatingProgress = true;
        state.error = null;
      })
      .addCase(updateLessonProgress.fulfilled, (state, action) => {
        state.isUpdatingProgress = false;
        const { lessonId, xpAwarded } = action.payload;

        // Mark lesson as completed
        courseSlice.caseReducers.markLessonCompleted(state, {
          type: "markLessonCompleted",
          payload: lessonId,
        });

        // Store XP for user slice to handle
        if (xpAwarded > 0) {
          // This will be handled by middleware or component
        }
      })
      .addCase(updateLessonProgress.rejected, (state, action) => {
        state.isUpdatingProgress = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectCourse,
  selectModule,
  selectLesson,
  nextLesson,
  previousLesson,
  startLearningSession,
  updateSessionTime,
  endLearningSession,
  markLessonCompleted,
  setCourseFilters,
  showProgressModal,
  hideProgressModal,
  showCertificateModal,
  hideCertificateModal,
  clearCourseData,
  setError,
} = courseSlice.actions;

export default courseSlice.reducer;
