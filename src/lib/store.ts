import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import quizReducer from "./slices/quizSlice";
import achievementsReducer from "./slices/achievementsSlice";
import courseReducer from "./slices/courseSlice";
import adminReducer from "./slices/adminSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    quiz: quizReducer,
    achievements: achievementsReducer,
    course: courseReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
