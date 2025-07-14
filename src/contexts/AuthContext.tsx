"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  hearts: number;
  maxHearts: number;
  achievements: string[];
  completedCourses: string[];
  currentCourse: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("lernify_user");
        const authToken = localStorage.getItem("lernify_token");

        if (storedUser && authToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear corrupted data
        localStorage.removeItem("lernify_user");
        localStorage.removeItem("lernify_token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      // In real implementation, validate email and password
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock validation - in real app, this would be server-side
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Mock user data
      const mockUser: User = {
        id: "1",
        email,
        firstName: "John",
        lastName: "Doe",
        level: 1,
        xp: 505,
        streak: 7,
        hearts: 3,
        maxHearts: 5,
        achievements: ["first_lesson", "streak_3", "early_bird"],
        completedCourses: [],
        currentCourse: "js",
        joinedAt: new Date().toISOString(),
      };

      // Mock authentication token
      const mockToken = "mock_jwt_token_" + Date.now();

      // Store in localStorage
      localStorage.setItem("lernify_user", JSON.stringify(mockUser));
      localStorage.setItem("lernify_token", mockToken);

      setUser(mockUser);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock user creation
      const newUser: User = {
        id: "new_" + Date.now(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        level: 1,
        xp: 0,
        streak: 0,
        hearts: 5,
        maxHearts: 5,
        achievements: ["welcome"],
        completedCourses: [],
        currentCourse: "js",
        joinedAt: new Date().toISOString(),
      };

      // Mock authentication token
      const mockToken = "mock_jwt_token_" + Date.now();

      // Store in localStorage
      localStorage.setItem("lernify_user", JSON.stringify(newUser));
      localStorage.setItem("lernify_token", mockToken);

      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lernify_user");
    localStorage.removeItem("lernify_token");
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("lernify_user", JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
