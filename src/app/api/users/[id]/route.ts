import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/[id] - Get a specific user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        level: true,
        xp: true,
        hearts: true,
        lastHeartRefill: true,
        streak: true,
        lastActive: true,
        isVerified: true,
        plan: true,
        createdAt: true,
        updatedAt: true,
        // Include related data
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Update user data
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updateData = await request.json();

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const allowedFields = ["username", "name", "avatar", "bio", "lastActive"];
    const allowedUpdates = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj: Record<string, unknown>, key: string) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    const user = await prisma.user.update({
      where: { id },
      data: allowedUpdates,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        level: true,
        xp: true,
        hearts: true,
        streak: true,
        plan: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
