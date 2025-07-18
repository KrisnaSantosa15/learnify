"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import QuizSection from "./QuizSection";

export function RoleBasedDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session && (session.user as { role?: string })?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // If user is admin, they will be redirected to /admin
  const isAdmin = (session.user as { role?: string })?.role === "ADMIN";
  if (isAdmin) {
    return null; // Will redirect to admin panel
  }

  return (
    <div className="space-y-6">
      {/* User Section - Visible to regular users only */}
      <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg p-6 border border-blue-200/20">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-blue-500">📚</span>
          Learning Center
        </h2>
        <QuizSection />
      </div>
    </div>
  );
}
