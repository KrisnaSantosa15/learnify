import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  // User profile data
  id: string | null;
  email: string | null;
  username: string | null;
  name: string | null;
  avatar: string | null;
  bio: string | null;

  // Gamification stats
  level: number;
  xp: number;
  hearts: number;
  lastHeartRefill: string | null;
  streak: number;
  lastActive: string;

  // User preferences
  plan: "FREE" | "PRO" | "PREMIUM";
  role: "USER" | "ADMIN";

  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  // Real-time updates
  recentXpGain: number;
  showXpAnimation: boolean;
  recentAchievements: string[];
}

const initialState: UserState = {
  id: null,
  email: null,
  username: null,
  name: null,
  avatar: null,
  bio: null,
  level: 1,
  xp: 0,
  hearts: 5,
  lastHeartRefill: null,
  streak: 0,
  lastActive: new Date().toISOString(),
  plan: "FREE",
  role: "USER",
  isLoading: false,
  isUpdating: false,
  error: null,
  recentXpGain: 0,
  showXpAnimation: false,
  recentAchievements: [],
};

// Async thunks for API calls
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData: Partial<UserState>, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const awardXP = createAsyncThunk(
  "user/awardXP",
  async (
    { xp, source }: { xp: number; source: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/users/award-xp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ xp, source }),
      });
      if (!response.ok) {
        throw new Error("Failed to award XP");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
    clearUser: (state) => {
      Object.assign(state, initialState);
    },
    addXP: (state, action: PayloadAction<number>) => {
      state.xp += action.payload;
      state.recentXpGain = action.payload;
      state.showXpAnimation = true;

      // Level up logic
      const newLevel = Math.floor(state.xp / 100) + 1;
      if (newLevel > state.level) {
        state.level = newLevel;
        state.hearts = Math.min(state.hearts + 1, 5); // Bonus heart for level up
      }
    },
    hideXpAnimation: (state) => {
      state.showXpAnimation = false;
      state.recentXpGain = 0;
    },
    useHeart: (state) => {
      if (state.hearts > 0) {
        state.hearts -= 1;
      }
    },
    refillHearts: (state) => {
      state.hearts = 5;
      state.lastHeartRefill = new Date().toISOString();
    },
    incrementStreak: (state) => {
      state.streak += 1;
      state.lastActive = new Date().toISOString();
    },
    resetStreak: (state) => {
      state.streak = 0;
    },
    addRecentAchievement: (state, action: PayloadAction<string>) => {
      state.recentAchievements.push(action.payload);
    },
    clearRecentAchievements: (state) => {
      state.recentAchievements = [];
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        Object.assign(state, action.payload);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Award XP
    builder.addCase(awardXP.fulfilled, (state, action) => {
      const { xp, newLevel, achievements } = action.payload;
      state.xp = xp;
      state.recentXpGain = action.meta.arg.xp;
      state.showXpAnimation = true;

      if (newLevel && newLevel > state.level) {
        state.level = newLevel;
        state.hearts = Math.min(state.hearts + 1, 5);
      }

      if (achievements?.length > 0) {
        state.recentAchievements.push(...achievements);
      }
    });
  },
});

export const {
  setUser,
  clearUser,
  addXP,
  hideXpAnimation,
  useHeart,
  refillHearts,
  incrementStreak,
  resetStreak,
  addRecentAchievement,
  clearRecentAchievements,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
