import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { xp, source } = await request.json();

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate new XP and level
    const newXP = user.xp + xp;
    const newLevel = Math.floor(newXP / 100) + 1;
    const leveledUp = newLevel > user.level;

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: newXP,
        level: newLevel,
      },
    });

    // Check for new achievements (simplified)
    const achievements = [];
    if (leveledUp) {
      achievements.push(`Level ${newLevel} Achieved!`);
    }

    return NextResponse.json({
      xp: newXP,
      level: newLevel,
      leveledUp,
      achievements,
      source,
    });
  } catch (error) {
    console.error("Error awarding XP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
