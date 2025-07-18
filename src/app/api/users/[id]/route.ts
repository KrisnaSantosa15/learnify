import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role, name, email, username, plan, password } = body;

    // Validate the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: {
      role?: "USER" | "ADMIN";
      name?: string;
      email?: string;
      username?: string;
      plan?: "FREE" | "PRO" | "PREMIUM";
      password?: string;
    } = {};
    if (role !== undefined) updateData.role = role as "USER" | "ADMIN";
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (plan !== undefined)
      updateData.plan = plan as "FREE" | "PRO" | "PREMIUM";

    // Hash password if provided
    if (password !== undefined && password.trim()) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            progress: true,
          },
        },
      },
    });

    // Transform the data to match the expected interface
    const transformedUser = {
      id: updatedUser.id,
      name: updatedUser.name || "",
      email: updatedUser.email,
      username: updatedUser.username,
      role: updatedUser.role,
      plan: updatedUser.plan,
      level: updatedUser.level,
      xp: updatedUser.xp,
      streak: updatedUser.streak,
      enrollments: updatedUser._count.progress,
      lastActive: updatedUser.lastActive.toISOString(),
      createdAt: updatedUser.createdAt.toISOString(),
    };

    return NextResponse.json({ user: transformedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't allow deleting the last admin
    if (existingUser.role === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last administrator" },
          { status: 400 }
        );
      }
    }

    // Delete the user (this will cascade delete related records)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// GET /api/users/[id] - Get specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            progress: true,
            submissions: true,
            quizAttempts: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Transform the data
    const transformedUser = {
      id: user.id,
      name: user.name || "",
      email: user.email,
      username: user.username,
      role: user.role,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      plan: user.plan,
      enrollments: user._count.progress,
      submissions: user._count.submissions,
      quizAttempts: user._count.quizAttempts,
      achievements: user._count.achievements,
      lastActive: user.lastActive.toISOString(),
      createdAt: user.createdAt.toISOString(),
    };

    return NextResponse.json({ user: transformedUser });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
