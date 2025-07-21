import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

export interface Modal {
  id: string;
  type: string;
  data?: unknown;
}

export interface UIState {
  // Global loading states
  isAppLoading: boolean;

  // Navigation
  sidebarOpen: boolean;
  currentPath: string;

  // Theme and appearance
  theme: "dark" | "light";
  reducedMotion: boolean;

  // Notifications
  notifications: Notification[];

  // Modals
  activeModals: Modal[];

  // Toast messages
  toasts: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    duration: number;
    timestamp: number;
  }>;

  // Search
  globalSearchOpen: boolean;
  searchQuery: string;
  searchResults: Array<{
    type: "quiz" | "course" | "achievement" | "user";
    id: string;
    title: string;
    description?: string;
    url: string;
  }>;
  isSearching: boolean;

  // Command palette
  commandPaletteOpen: boolean;

  // Confetti and animations
  showConfetti: boolean;
  showXpAnimation: boolean;
  animatingElements: string[];

  // Form states
  forms: Record<
    string,
    {
      isSubmitting: boolean;
      errors: Record<string, string>;
      isDirty: boolean;
    }
  >;

  // Pagination
  pagination: Record<
    string,
    {
      currentPage: number;
      totalPages: number;
      pageSize: number;
    }
  >;

  // Filters
  filters: Record<string, Record<string, unknown>>;

  // UI preferences
  preferences: {
    soundEnabled: boolean;
    animationsEnabled: boolean;
    hintsEnabled: boolean;
    autoSave: boolean;
    compactMode: boolean;
  };
}

const initialState: UIState = {
  isAppLoading: false,
  sidebarOpen: true,
  currentPath: "/",
  theme: "dark",
  reducedMotion: false,
  notifications: [],
  activeModals: [],
  toasts: [],
  globalSearchOpen: false,
  searchQuery: "",
  searchResults: [],
  isSearching: false,
  commandPaletteOpen: false,
  showConfetti: false,
  showXpAnimation: false,
  animatingElements: [],
  forms: {},
  pagination: {},
  filters: {},
  preferences: {
    soundEnabled: true,
    animationsEnabled: true,
    hintsEnabled: true,
    autoSave: true,
    compactMode: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // App loading
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.isAppLoading = action.payload;
    },

    // Navigation
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },

    // Theme
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.reducedMotion = action.payload;
    },

    // Notifications
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "timestamp">>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },

    // Modals
    openModal: (state, action: PayloadAction<Omit<Modal, "id">>) => {
      const modal: Modal = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.activeModals.push(modal);
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.activeModals = state.activeModals.filter(
        (m) => m.id !== action.payload
      );
    },
    closeAllModals: (state) => {
      state.activeModals = [];
    },

    // Toasts
    addToast: (
      state,
      action: PayloadAction<{
        type: "success" | "error" | "warning" | "info";
        message: string;
        duration?: number;
      }>
    ) => {
      const toast = {
        ...action.payload,
        id: Date.now().toString(),
        duration: action.payload.duration || 3000,
        timestamp: Date.now(),
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },

    // Search
    setGlobalSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.globalSearchOpen = action.payload;
    },
    toggleGlobalSearch: (state) => {
      state.globalSearchOpen = !state.globalSearchOpen;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (
      state,
      action: PayloadAction<UIState["searchResults"]>
    ) => {
      state.searchResults = action.payload;
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = "";
      state.searchResults = [];
      state.isSearching = false;
    },

    // Command palette
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.commandPaletteOpen = action.payload;
    },
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen;
    },

    // Animations
    setShowConfetti: (state, action: PayloadAction<boolean>) => {
      state.showConfetti = action.payload;
    },
    setShowXpAnimation: (state, action: PayloadAction<boolean>) => {
      state.showXpAnimation = action.payload;
    },
    addAnimatingElement: (state, action: PayloadAction<string>) => {
      if (!state.animatingElements.includes(action.payload)) {
        state.animatingElements.push(action.payload);
      }
    },
    removeAnimatingElement: (state, action: PayloadAction<string>) => {
      state.animatingElements = state.animatingElements.filter(
        (el) => el !== action.payload
      );
    },
    clearAllAnimations: (state) => {
      state.showConfetti = false;
      state.showXpAnimation = false;
      state.animatingElements = [];
    },

    // Forms
    setFormState: (
      state,
      action: PayloadAction<{
        formId: string;
        isSubmitting?: boolean;
        errors?: Record<string, string>;
        isDirty?: boolean;
      }>
    ) => {
      const { formId, ...formState } = action.payload;
      if (!state.forms[formId]) {
        state.forms[formId] = {
          isSubmitting: false,
          errors: {},
          isDirty: false,
        };
      }
      Object.assign(state.forms[formId], formState);
    },
    clearFormState: (state, action: PayloadAction<string>) => {
      delete state.forms[action.payload];
    },
    setFormErrors: (
      state,
      action: PayloadAction<{
        formId: string;
        errors: Record<string, string>;
      }>
    ) => {
      const { formId, errors } = action.payload;
      if (!state.forms[formId]) {
        state.forms[formId] = {
          isSubmitting: false,
          errors: {},
          isDirty: false,
        };
      }
      state.forms[formId].errors = errors;
    },

    // Pagination
    setPagination: (
      state,
      action: PayloadAction<{
        key: string;
        currentPage: number;
        totalPages: number;
        pageSize: number;
      }>
    ) => {
      const { key, ...pagination } = action.payload;
      state.pagination[key] = pagination;
    },
    setCurrentPage: (
      state,
      action: PayloadAction<{
        key: string;
        page: number;
      }>
    ) => {
      const { key, page } = action.payload;
      if (state.pagination[key]) {
        state.pagination[key].currentPage = page;
      }
    },

    // Filters
    setFilter: (
      state,
      action: PayloadAction<{
        key: string;
        filter: string;
        value: unknown;
      }>
    ) => {
      const { key, filter, value } = action.payload;
      if (!state.filters[key]) {
        state.filters[key] = {};
      }
      state.filters[key][filter] = value;
    },
    clearFilters: (state, action: PayloadAction<string>) => {
      state.filters[action.payload] = {};
    },

    // Preferences
    updatePreferences: (
      state,
      action: PayloadAction<Partial<UIState["preferences"]>>
    ) => {
      Object.assign(state.preferences, action.payload);
    },
    resetPreferences: (state) => {
      state.preferences = {
        soundEnabled: true,
        animationsEnabled: true,
        hintsEnabled: true,
        autoSave: true,
        compactMode: false,
      };
    },
  },
});

export const {
  setAppLoading,
  setSidebarOpen,
  toggleSidebar,
  setCurrentPath,
  setTheme,
  toggleTheme,
  setReducedMotion,
  addNotification,
  removeNotification,
  clearAllNotifications,
  openModal,
  closeModal,
  closeAllModals,
  addToast,
  removeToast,
  clearAllToasts,
  setGlobalSearchOpen,
  toggleGlobalSearch,
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  clearSearch,
  setCommandPaletteOpen,
  toggleCommandPalette,
  setShowConfetti,
  setShowXpAnimation,
  addAnimatingElement,
  removeAnimatingElement,
  clearAllAnimations,
  setFormState,
  clearFormState,
  setFormErrors,
  setPagination,
  setCurrentPage,
  setFilter,
  clearFilters,
  updatePreferences,
  resetPreferences,
} = uiSlice.actions;

export default uiSlice.reducer;
