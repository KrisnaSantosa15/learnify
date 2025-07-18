"use client";

import { useParams, useSearchParams } from "next/navigation";
import DatabaseQuiz from "@/components/dashboard/practice/DatabaseQuiz";

export default function QuizTakingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = params.id as string;

  // Check if quiz should auto-start (from quiz browser)
  const autoStart = searchParams.get("start") === "true";

  return <DatabaseQuiz quizId={quizId} autoStart={autoStart} />;
}
