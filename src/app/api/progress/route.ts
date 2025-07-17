import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET /api/progress - Get user's overall progress
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const userId = session.user.id;

    if (courseId) {
      // Get progress for a specific course
      const courseProgress = await prisma.courseProgress.findMany({
        where: {
          userId: userId,
          courseId: courseId,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              difficulty: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return NextResponse.json(courseProgress);
    } else {
      // Get all progress for the user
      const allProgress = await prisma.courseProgress.findMany({
        where: {
          userId: userId,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              technology: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      // Get user's overall stats
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          xp: true,
          level: true,
          streak: true,
          hearts: true,
          lastActive: true,
        },
      });

      return NextResponse.json({
        progress: allProgress,
        userStats: user,
      });
    }
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

// POST /api/progress - Update user progress
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      courseId,
      completedLessons,
      xpGained,
      heartsLost,
      streakMaintained,
    } = body;

    const userId = session.user.id;

    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Update or create user progress for the course
    const updatedProgress = await prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
      update: {
        progress: completedLessons || undefined,
        lastAccessed: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        courseId: courseId,
        progress: completedLessons || 0,
        lastAccessed: new Date(),
      },
    });

    // Update user stats if XP gained or hearts lost
    if (
      xpGained ||
      heartsLost !== undefined ||
      streakMaintained !== undefined
    ) {
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          xp: true,
          level: true,
          hearts: true,
          streak: true,
          lastActive: true,
        },
      });

      if (currentUser) {
        const newXp = currentUser.xp + (xpGained || 0);
        const newLevel = Math.floor(newXp / 100) + 1; // 100 XP per level
        const newHearts = Math.max(0, currentUser.hearts - (heartsLost || 0));

        // Calculate streak
        const today = new Date().toDateString();
        const lastActivity = currentUser.lastActive?.toDateString();
        const isConsecutiveDay =
          lastActivity &&
          new Date(today).getTime() - new Date(lastActivity).getTime() <=
            86400000; // 24 hours

        let newStreak = currentUser.streak;
        if (streakMaintained && isConsecutiveDay) {
          newStreak += 1;
        } else if (streakMaintained && !isConsecutiveDay) {
          newStreak = 1;
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: newXp,
            level: newLevel,
            hearts: newHearts,
            streak: newStreak,
            lastActive: new Date(),
          },
        });
      }
    }

    return NextResponse.json(updatedProgress, { status: 201 });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
