import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/quiz-attempts - Submit a quiz attempt
export async function POST(request: NextRequest) {
  try {
    const { userId, quizId, answers, timeSpent } = await request.json();

    // Get the quiz with questions to calculate score
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Calculate score
    let score = 0;
    let maxScore = 0;
    const results: Array<{
      questionId: string;
      correct: boolean;
      points: number;
    }> = [];

    quiz.questions.forEach(
      (
        question: { id: string; correctAnswer: number; points: number },
        index: number
      ) => {
        maxScore += question.points;
        const userAnswer = answers[index];
        const isCorrect = userAnswer === question.correctAnswer;

        if (isCorrect) {
          score += question.points;
        }

        results.push({
          questionId: question.id,
          correct: isCorrect,
          points: isCorrect ? question.points : 0,
        });
      }
    );

    // Create quiz attempt record
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        maxScore,
        timeSpent,
        answers: answers,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Calculate XP reward based on performance
    const percentage = (score / maxScore) * 100;
    let xpEarned = 0;

    if (percentage >= 90) {
      xpEarned = quiz.xpReward;
    } else if (percentage >= 70) {
      xpEarned = Math.floor(quiz.xpReward * 0.8);
    } else if (percentage >= 50) {
      xpEarned = Math.floor(quiz.xpReward * 0.5);
    }

    // Update user XP and potentially level
    if (xpEarned > 0) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true },
      });

      if (user) {
        const newXp = user.xp + xpEarned;
        const newLevel = Math.floor(newXp / 1000) + 1; // 1000 XP per level

        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: newXp,
            level: newLevel,
            lastActive: new Date(),
          },
        });
      }
    }

    return NextResponse.json(
      {
        attempt: {
          ...attempt,
          xpEarned,
          percentage: Math.round(percentage),
          results,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz attempt" },
      { status: 500 }
    );
  }
}

// GET /api/quiz-attempts - Get user's quiz attempts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const quizId = searchParams.get("quizId");

    const whereClause: { userId?: string; quizId?: string } = {};
    if (userId) whereClause.userId = userId;
    if (quizId) whereClause.quizId = quizId;

    const attempts = await prisma.quizAttempt.findMany({
      where: whereClause,
      include: {
        quiz: {
          select: {
            title: true,
            category: true,
            difficulty: true,
            xpReward: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ attempts });
  } catch (error) {
    console.error("Error fetching quiz attempts:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz attempts" },
      { status: 500 }
    );
  }
}
