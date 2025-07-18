import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/achievements - Get all achievements for admin
export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform achievements to include user count and completion rate
    const totalUsers = await prisma.user.count();
    const transformedAchievements = achievements.map((achievement) => ({
      ...achievement,
      userCount: achievement._count.users,
      completionRate:
        totalUsers > 0 ? (achievement._count.users / totalUsers) * 100 : 0,
    }));

    return NextResponse.json({ achievements: transformedAchievements });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

// POST /api/admin/achievements - Create a new achievement
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      icon,
      rarity,
      category,
      criteria,
      xpReward,
      isActive = true,
    } = await request.json();

    if (!title || !description || !icon || !rarity || !category || !criteria) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const achievement = await prisma.achievement.create({
      data: {
        title,
        description,
        icon,
        rarity,
        category,
        criteria,
        xpReward: xpReward || 100,
        isActive,
      },
    });

    return NextResponse.json({ achievement }, { status: 201 });
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/achievements - Update an achievement
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      title,
      description,
      icon,
      rarity,
      category,
      criteria,
      xpReward,
      isActive,
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Achievement ID is required" },
        { status: 400 }
      );
    }

    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(icon && { icon }),
        ...(rarity && { rarity }),
        ...(category && { category }),
        ...(criteria && { criteria }),
        ...(xpReward !== undefined && { xpReward }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ achievement });
  } catch (error) {
    console.error("Error updating achievement:", error);
    return NextResponse.json(
      { error: "Failed to update achievement" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/achievements - Delete an achievement
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Achievement ID is required" },
        { status: 400 }
      );
    }

    // Check if achievement exists
    const existingAchievement = await prisma.achievement.findUnique({
      where: { id },
    });

    if (!existingAchievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    // Delete the achievement (this will cascade delete user achievements)
    await prisma.achievement.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json(
      { error: "Failed to delete achievement" },
      { status: 500 }
    );
  }
}
