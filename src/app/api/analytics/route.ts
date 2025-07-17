import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get timeframe from query params
    const url = new URL(request.url);
    const timeframe = url.searchParams.get("timeframe") || "7d";

    // Calculate date range
    const now = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get user statistics
    const [totalUsers, activeUsers, newUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          lastActive: {
            gte: startDate,
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
    ]);

    // Get course statistics
    const [totalCourses, totalEnrollments, totalCompletions] =
      await Promise.all([
        prisma.course.count(),
        prisma.courseProgress.count(),
        prisma.courseProgress.count({
          where: {
            completedAt: {
              not: null,
            },
          },
        }),
      ]);

    // Get quiz statistics
    const [totalQuizzes, totalAttempts, quizAttempts] = await Promise.all([
      prisma.quiz.count(),
      prisma.quizAttempt.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      prisma.quizAttempt.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          score: true,
        },
      }),
    ]);

    // Calculate average quiz score
    const averageScore =
      quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce(
              (sum, attempt) => sum + (attempt.score || 0),
              0
            ) / quizAttempts.length
          )
        : 0;

    // Get engagement statistics
    const [dailyActive, weeklyActive, monthlyActive] = await Promise.all([
      prisma.user.count({
        where: {
          lastActive: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.user.count({
        where: {
          lastActive: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.user.count({
        where: {
          lastActive: {
            gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const analyticsData = {
      users: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers,
      },
      courses: {
        total: totalCourses,
        enrollments: totalEnrollments,
        completions: totalCompletions,
      },
      quizzes: {
        total: totalQuizzes,
        attempts: totalAttempts,
        averageScore: averageScore,
      },
      engagement: {
        dailyActive: dailyActive,
        weeklyActive: weeklyActive,
        monthlyActive: monthlyActive,
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
