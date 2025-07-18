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

    // Get all achievements
    const allAchievements = await prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: [{ rarity: "asc" }, { createdAt: "asc" }],
    });

    // Get user's unlocked achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
    });

    const unlockedAchievementIds = new Set(
      userAchievements.map((ua) => ua.achievementId)
    );

    // Format achievements with unlock status
    const achievements = allAchievements.map((achievement) => ({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      rarity: achievement.rarity,
      category: achievement.category,
      xpReward: achievement.xpReward,
      isUnlocked: unlockedAchievementIds.has(achievement.id),
      unlockedAt:
        userAchievements.find((ua) => ua.achievementId === achievement.id)
          ?.unlockedAt || null,
    }));

    // Group by category
    interface CategoryData {
      name: string;
      achievements: typeof achievements;
      totalCount: number;
      unlockedCount: number;
    }

    const categories = achievements.reduce(
      (acc: Record<string, CategoryData>, achievement) => {
        if (!acc[achievement.category]) {
          acc[achievement.category] = {
            name: achievement.category,
            achievements: [],
            totalCount: 0,
            unlockedCount: 0,
          };
        }

        acc[achievement.category].achievements.push(achievement);
        acc[achievement.category].totalCount++;

        if (achievement.isUnlocked) {
          acc[achievement.category].unlockedCount++;
        }

        return acc;
      },
      {}
    );

    // Calculate overall progress
    const totalAchievements = achievements.length;
    const unlockedAchievements = achievements.filter(
      (a) => a.isUnlocked
    ).length;
    const progress =
      totalAchievements > 0
        ? Math.round((unlockedAchievements / totalAchievements) * 100)
        : 0;

    // Calculate total XP earned from achievements
    const totalXpEarned = achievements
      .filter((a) => a.isUnlocked)
      .reduce((sum, a) => sum + a.xpReward, 0);

    return NextResponse.json({
      achievements,
      categories: Object.values(categories),
      stats: {
        total: totalAchievements,
        unlocked: unlockedAchievements,
        locked: totalAchievements - unlockedAchievements,
        progress,
        totalXpEarned,
      },
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
