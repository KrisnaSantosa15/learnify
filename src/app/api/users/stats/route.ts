import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user basic stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        level: true,
        xp: true,
        streak: true,
        lastActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get quiz statistics
    const quizStats = await prisma.quizAttempt.aggregate({
      where: {
        userId,
        isCompleted: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        score: true,
        timeSpent: true,
      },
      _sum: {
        score: true,
        timeSpent: true,
      },
    });

    // Get total possible score from completed quizzes
    const completedAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        isCompleted: true,
      },
      select: {
        maxScore: true,
        score: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalMaxScore = completedAttempts.reduce(
      (sum, attempt) => sum + attempt.maxScore,
      0
    );
    const totalScore = completedAttempts.reduce(
      (sum, attempt) => sum + attempt.score,
      0
    );
    const averageAccuracy =
      totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

    // Get recent quiz attempts (last 7 days for streak calculation)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        isCompleted: true,
        completedAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        completedAt: true,
        score: true,
        maxScore: true,
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    // Calculate current streak
    let currentStreak = 0;

    // Group attempts by date
    const attemptsByDate = new Map();
    recentAttempts.forEach((attempt) => {
      const date = attempt.completedAt?.toDateString();
      if (date && !attemptsByDate.has(date)) {
        attemptsByDate.set(date, true);
      }
    });

    // Calculate streak
    const checkDate = new Date();
    while (checkDate >= sevenDaysAgo) {
      const dateStr = checkDate.toDateString();
      if (attemptsByDate.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Get achievements count
    const achievementsCount = await prisma.userAchievement.count({
      where: { userId },
    });

    // Get performance by category
    const categoryPerformance = await prisma.quizAttempt.findMany({
      where: {
        userId,
        isCompleted: true,
      },
      include: {
        quiz: {
          include: {
            category: true,
          },
        },
      },
    });

    interface CategoryStat {
      name: string;
      icon?: string | null;
      color?: string | null;
      totalAttempts: number;
      totalScore: number;
      totalMaxScore: number;
      averageAccuracy: number;
    }

    const categoryStats = categoryPerformance.reduce(
      (acc: Record<string, CategoryStat>, attempt) => {
        const categoryName = attempt.quiz.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = {
            name: categoryName,
            icon: attempt.quiz.category.icon,
            color: attempt.quiz.category.color,
            totalAttempts: 0,
            totalScore: 0,
            totalMaxScore: 0,
            averageAccuracy: 0,
          };
        }

        acc[categoryName].totalAttempts++;
        acc[categoryName].totalScore += attempt.score;
        acc[categoryName].totalMaxScore += attempt.maxScore;
        acc[categoryName].averageAccuracy = Math.round(
          (acc[categoryName].totalScore / acc[categoryName].totalMaxScore) * 100
        );

        return acc;
      },
      {}
    );

    // Calculate XP needed for next level
    const currentLevel = user.level;
    const xpForNextLevel = currentLevel * 1000; // 1000 XP per level
    const xpProgress = user.xp % 1000;
    const xpNeeded = xpForNextLevel - user.xp;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await prisma.quizAttempt.findMany({
      where: {
        userId,
        isCompleted: true,
        completedAt: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        quiz: {
          select: {
            title: true,
            category: {
              select: {
                name: true,
                icon: true,
              },
            },
          },
        },
      },
      orderBy: {
        completedAt: "desc",
      },
      take: 10,
    });

    const stats = {
      user: {
        ...user,
        level: currentLevel,
        xp: user.xp,
        xpProgress,
        xpNeeded,
        xpForNextLevel,
        streak: currentStreak,
      },
      quiz: {
        totalAttempts: quizStats._count.id || 0,
        averageScore: Math.round(quizStats._avg.score || 0),
        averageAccuracy,
        totalTimeSpent: Math.round((quizStats._sum.timeSpent || 0) / 60), // Convert to minutes
        averageTimePerQuiz: Math.round((quizStats._avg.timeSpent || 0) / 60), // Convert to minutes
      },
      achievements: {
        total: achievementsCount,
      },
      categories: Object.values(categoryStats),
      recentActivity: recentActivity.map((attempt) => ({
        id: attempt.id,
        quiz: attempt.quiz,
        score: attempt.score,
        maxScore: attempt.maxScore,
        accuracy: Math.round((attempt.score / attempt.maxScore) * 100),
        completedAt: attempt.completedAt,
        timeSpent: Math.round(attempt.timeSpent / 60), // Convert to minutes
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}
