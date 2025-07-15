import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/me - Get current authenticated user
// For now, we'll use a demo user since auth isn't set up yet
export async function GET() {
  try {
    // TODO: Replace this with actual session/auth logic
    // For demo purposes, we'll get the first user from our seeded data
    const user = await prisma.user.findFirst({
      where: {
        email: "demo@learnifycode.com",
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        level: true,
        xp: true,
        hearts: true,
        lastHeartRefill: true,
        streak: true,
        lastActive: true,
        plan: true,
        _count: {
          select: {
            submissions: true,
            achievements: true,
            progress: true,
          },
        },
      },
    });

    if (!user) {
      // If demo user doesn't exist, create one
      const newUser = await prisma.user.create({
        data: {
          email: "demo@learnifycode.com",
          username: "demo_user",
          name: "Demo User",
          level: 1,
          xp: 0,
          hearts: 5,
          streak: 0,
          plan: "FREE",
        },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          avatar: true,
          level: true,
          xp: true,
          hearts: true,
          lastHeartRefill: true,
          streak: true,
          lastActive: true,
          plan: true,
          _count: {
            select: {
              submissions: true,
              achievements: true,
              progress: true,
            },
          },
        },
      });
      return NextResponse.json({ user: newUser });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch current user" },
      { status: 500 }
    );
  }
}
