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
      username: user.username,
      role: user.role,
      plan: user.plan,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      enrollments: user._count.progress,
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
    const {
      email,
      name,
      password,
      role = "USER",
      plan = "FREE",
      username,
    } = await request.json();

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

    // Use provided username or generate one from email if not provided
    let finalUsername = username;
    if (!finalUsername || finalUsername.trim() === "") {
      finalUsername =
        email.split("@")[0] + "_" + Date.now().toString().slice(-4);
    }

    // Check if username is already taken and make it unique if needed
    let uniqueUsername = finalUsername;
    let counter = 1;
    while (
      await prisma.user.findUnique({ where: { username: uniqueUsername } })
    ) {
      uniqueUsername = `${finalUsername}_${counter}`;
      counter++;
    }

    const user = await prisma.user.create({
      data: {
        email,
        username: uniqueUsername,
        name,
        password: hashedPassword,
        role: role as "USER" | "ADMIN",
        plan: plan as "FREE" | "PRO" | "PREMIUM",
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        plan: true,
        level: true,
        xp: true,
        streak: true,
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
