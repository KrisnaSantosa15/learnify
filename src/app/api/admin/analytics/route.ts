import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get basic counts
    const [
      totalUsers,
      totalQuizzes,
      totalQuizAttempts,
      totalAchievements,
      totalCategories,
      recentUsers,
      recentAttempts,
      topPerformers,
      popularQuizzes,
    ] = await Promise.all([
      // Total users count
      prisma.user.count(),

      // Total quizzes count
      prisma.quiz.count(),

      // Total quiz attempts
      prisma.quizAttempt.count(),

      // Total achievements
      prisma.achievement.count(),

      // Total categories
      prisma.category.count(),

      // Recent users (last 30 days)
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Recent quiz attempts (last 7 days)
      prisma.quizAttempt.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Top performers (users with highest XP)
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          xp: true,
          createdAt: true,
        },
        orderBy: { xp: "desc" },
        take: 5,
      }),

      // Most popular quizzes by attempt count
      prisma.quiz.findMany({
        select: {
          id: true,
          title: true,
          category: {
            select: {
              name: true,
              color: true,
            },
          },
          _count: {
            select: {
              attempts: true,
            },
          },
        },
        orderBy: {
          attempts: {
            _count: "desc",
          },
        },
        take: 5,
      }),
    ]);

    // Calculate completion rate
    const completedAttempts = await prisma.quizAttempt.count({
      where: { isCompleted: true },
    });
    const completionRate =
      totalQuizAttempts > 0
        ? Math.round((completedAttempts / totalQuizAttempts) * 100)
        : 0;

    // Calculate growth rates (comparing last 30 days vs previous 30 days)
    const previousPeriodUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const userGrowthRate =
      previousPeriodUsers > 0
        ? Math.round(
            ((recentUsers - previousPeriodUsers) / previousPeriodUsers) * 100
          )
        : 0;

    // Get recent activity
    const recentActivity = await prisma.quizAttempt.findMany({
      select: {
        id: true,
        score: true,
        isCompleted: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        quiz: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Get quiz statistics by category
    const categoryStats = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        color: true,
        _count: {
          select: {
            quizzes: true,
          },
        },
      },
      orderBy: {
        quizzes: {
          _count: "desc",
        },
      },
    });

    // Get achievement distribution
    const achievementStats = await prisma.achievement.groupBy({
      by: ["rarity"],
      _count: {
        rarity: true,
      },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalQuizzes,
        totalQuizAttempts,
        totalAchievements,
        totalCategories,
        recentUsers,
        recentAttempts,
        completionRate,
        userGrowthRate,
      },
      topPerformers,
      popularQuizzes,
      recentActivity,
      categoryStats,
      achievementStats,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
