import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/achievements - Get all achievements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const achievements = await prisma.achievement.findMany({
      include: userId
        ? {
            users: {
              where: { userId: userId },
            },
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add isUnlocked property for each achievement
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const achievementsWithStatus = achievements.map((achievement: any) => ({
      ...achievement,
      isUnlocked: userId
        ? achievement.users && achievement.users.length > 0
        : false,
      unlockedAt:
        userId && achievement.users && achievement.users.length > 0
          ? achievement.users[0].unlockedAt
          : null,
    }));

    return NextResponse.json({ achievements: achievementsWithStatus });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

// POST /api/achievements - Unlock an achievement for a user
export async function POST(request: NextRequest) {
  try {
    const { userId, achievementId } = await request.json();

    if (!userId || !achievementId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if achievement is already unlocked
    const existingUserAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: userId,
          achievementId: achievementId,
        },
      },
    });

    if (existingUserAchievement) {
      return NextResponse.json(
        { error: "Achievement already unlocked" },
        { status: 409 }
      );
    }

    // Get achievement details
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    // Unlock the achievement
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId: userId,
        achievementId: achievementId,
        unlockedAt: new Date(),
      },
      include: {
        achievement: true,
      },
    });

    // Award XP to user
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: {
          increment: achievement.xpReward,
        },
      },
    });

    return NextResponse.json({ userAchievement }, { status: 201 });
  } catch (error) {
    console.error("Error unlocking achievement:", error);
    return NextResponse.json(
      { error: "Failed to unlock achievement" },
      { status: 500 }
    );
  }
}
