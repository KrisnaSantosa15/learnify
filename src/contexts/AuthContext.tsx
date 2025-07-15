"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  avatar?: string | null;
  level: number;
  xp: number;
  streak: number;
  hearts: number;
  lastHeartRefill: Date | null;
  plan: string;
  _count?: {
    submissions: number;
    achievements: number;
    progress: number;
  };
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
    const fetchCurrentUser = async () => {
      try {
        // For now, we'll fetch the demo user from our database
        // TODO: Replace with actual session-based authentication
        const response = await fetch("/api/users/me");
        if (response.ok) {
          const { user } = await response.json();
          setUser(user);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual authentication API call
      // For now, we'll simulate login by fetching the demo user
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch("/api/users/me");
      if (response.ok) {
        const { user } = await response.json();
        setUser(user);

        // Store session indicator (in real app, this would be handled by cookies/JWT)
        localStorage.setItem("learnify_session", "active");
        return true;
      }

      return false;
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

      // TODO: Replace with actual user registration API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, create a new user in the database
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          username:
            userData.firstName.toLowerCase() +
            "_" +
            userData.lastName.toLowerCase(),
          name: `${userData.firstName} ${userData.lastName}`,
        }),
      });

      if (response.ok) {
        const { user } = await response.json();
        setUser(user);

        // Store session indicator
        localStorage.setItem("learnify_session", "active");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("learnify_session");
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      // Update user in database
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const { user: updatedUser } = await response.json();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
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
