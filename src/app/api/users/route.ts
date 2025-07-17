import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        level: true,
        xp: true,
        streak: true,
        plan: true,
        role: true,
        lastActive: true,
        createdAt: true,
        _count: {
          select: {
            progress: true, // enrollments count
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the expected interface
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || "",
      email: user.email,
      role: user.role,
      enrollments: user._count.progress,
      xp: user.xp,
      lastActive: user.lastActive.toISOString(),
      createdAt: user.createdAt.toISOString(),
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const { email, name, password, role = "USER" } = await request.json();

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Email, name, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate username from email if not provided
    const username =
      email.split("@")[0] + "_" + Date.now().toString().slice(-4);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashedPassword,
        role: role as "USER" | "ADMIN",
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        xp: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
