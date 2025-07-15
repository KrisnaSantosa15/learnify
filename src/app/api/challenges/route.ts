import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/challenges - Get all challenges
export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        technology: true,
        type: true,
        prompt: true,
        starterCode: true,
        solution: true,
        testCases: true,
        hints: true,
        xpReward: true,
        timeLimit: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}

// POST /api/challenges - Create a new challenge
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      difficulty,
      technology,
      type,
      prompt,
      starterCode,
      solution,
      testCases,
      hints,
      xpReward,
      timeLimit,
    } = await request.json();

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        difficulty,
        technology,
        type,
        prompt,
        starterCode,
        solution,
        testCases,
        hints,
        xpReward: xpReward || 50,
        timeLimit,
        isPublished: true,
      },
    });

    return NextResponse.json({ challenge }, { status: 201 });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: "Failed to create challenge" },
      { status: 500 }
    );
  }
}
