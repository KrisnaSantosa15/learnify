"use client";

import React from "react";
import { AdminDashboard } from "./AdminDashboard";
import { AdminUsersManagement } from "./AdminUsersManagement";
import QuizManager from "./QuizManager";
import { AdminAnalytics } from "./AdminAnalytics";

interface AdminPagesProps {
  activePage: string;
}

export default function AdminPages({ activePage }: AdminPagesProps) {
  switch (activePage) {
    case "dashboard":
      return <AdminDashboard />;

    case "users":
      return <AdminUsersManagement />;

    case "quizzes":
      return <QuizManager />;

    case "analytics":
      return <AdminAnalytics />;

    default:
      return <AdminDashboard />;
  }
}
