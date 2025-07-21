import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
  category: string;
  criteria: Record<string, unknown>;
  xpReward: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  achievement: Achievement;
}

export interface AchievementNotification {
  id: string;
  achievement: Achievement;
  showAnimation: boolean;
  timestamp: number;
}

export interface AchievementsState {
  // All available achievements
  allAchievements: Achievement[];

  // User's unlocked achievements
  userAchievements: UserAchievement[];

  // Achievement notifications
  notifications: AchievementNotification[];

  // Achievement categories for filtering
  categories: string[];
  selectedCategory: string | null;

  // Achievement statistics
  stats: {
    total: number;
    unlocked: number;
    common: number;
    uncommon: number;
    rare: number;
    epic: number;
    legendary: number;
    totalXpFromAchievements: number;
  };

  // Loading states
  isLoading: boolean;
  isUnlocking: boolean;
  error: string | null;

  // UI states
  showAchievementModal: boolean;
  selectedAchievement: Achievement | null;
}

const initialState: AchievementsState = {
  allAchievements: [],
  userAchievements: [],
  notifications: [],
  categories: [],
  selectedCategory: null,
  stats: {
    total: 0,
    unlocked: 0,
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    totalXpFromAchievements: 0,
  },
  isLoading: false,
  isUnlocking: false,
  error: null,
  showAchievementModal: false,
  selectedAchievement: null,
};

// Async thunks
export const fetchAchievements = createAsyncThunk(
  "achievements/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/achievements");
      if (!response.ok) {
        throw new Error("Failed to fetch achievements");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchUserAchievements = createAsyncThunk(
  "achievements/fetchUserAchievements",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/achievements/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user achievements");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const unlockAchievement = createAsyncThunk(
  "achievements/unlock",
  async (achievementId: string, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/achievements/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ achievementId }),
      });
      if (!response.ok) {
        throw new Error("Failed to unlock achievement");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const checkAchievementProgress = createAsyncThunk(
  "achievements/checkProgress",
  async (action: { type: string; data: unknown }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/achievements/check-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action),
      });
      if (!response.ok) {
        throw new Error("Failed to check achievement progress");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const achievementsSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Achievement>) => {
      const notification: AchievementNotification = {
        id: `${action.payload.id}-${Date.now()}`,
        achievement: action.payload,
        showAnimation: true,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    hideNotificationAnimation: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.showAnimation = false;
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    openAchievementModal: (state, action: PayloadAction<Achievement>) => {
      state.selectedAchievement = action.payload;
      state.showAchievementModal = true;
    },
    closeAchievementModal: (state) => {
      state.selectedAchievement = null;
      state.showAchievementModal = false;
    },
    calculateStats: (state) => {
      const totalAchievements = state.allAchievements.length;
      const unlockedAchievements = state.userAchievements.length;

      const rarityCount = {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
      };

      let totalXp = 0;

      state.userAchievements.forEach((userAchievement) => {
        const rarity =
          userAchievement.achievement.rarity.toLowerCase() as keyof typeof rarityCount;
        rarityCount[rarity]++;
        totalXp += userAchievement.achievement.xpReward;
      });

      state.stats = {
        total: totalAchievements,
        unlocked: unlockedAchievements,
        ...rarityCount,
        totalXpFromAchievements: totalXp,
      };
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all achievements
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allAchievements = action.payload;

        // Extract categories
        const categories = [
          ...new Set(action.payload.map((a: Achievement) => a.category)),
        ];
        state.categories = categories as string[];
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch user achievements
    builder
      .addCase(fetchUserAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userAchievements = action.payload;
        // Recalculate stats when user achievements are loaded
        achievementsSlice.caseReducers.calculateStats(state);
      })
      .addCase(fetchUserAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Unlock achievement
    builder
      .addCase(unlockAchievement.pending, (state) => {
        state.isUnlocking = true;
        state.error = null;
      })
      .addCase(unlockAchievement.fulfilled, (state, action) => {
        state.isUnlocking = false;
        const newAchievement = action.payload;
        state.userAchievements.push(newAchievement);

        // Add notification
        achievementsSlice.caseReducers.addNotification(state, {
          type: "addNotification",
          payload: newAchievement.achievement,
        });

        // Recalculate stats
        achievementsSlice.caseReducers.calculateStats(state);
      })
      .addCase(unlockAchievement.rejected, (state, action) => {
        state.isUnlocking = false;
        state.error = action.payload as string;
      });

    // Check achievement progress
    builder.addCase(checkAchievementProgress.fulfilled, (state, action) => {
      const { newlyUnlocked } = action.payload;
      if (newlyUnlocked && newlyUnlocked.length > 0) {
        // Add newly unlocked achievements
        state.userAchievements.push(...newlyUnlocked);

        // Add notifications for each new achievement
        newlyUnlocked.forEach((achievement: UserAchievement) => {
          achievementsSlice.caseReducers.addNotification(state, {
            type: "addNotification",
            payload: achievement.achievement,
          });
        });

        // Recalculate stats
        achievementsSlice.caseReducers.calculateStats(state);
      }
    });
  },
});

export const {
  addNotification,
  removeNotification,
  hideNotificationAnimation,
  clearAllNotifications,
  setSelectedCategory,
  openAchievementModal,
  closeAchievementModal,
  calculateStats,
  setError,
} = achievementsSlice.actions;

export default achievementsSlice.reducer;
