import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/submissions - Submit code for a challenge
export async function POST(request: NextRequest) {
  try {
    const { userId, challengeId, code, language, timeSpent, hints } =
      await request.json();

    // Here you would typically run the code against test cases
    // For now, we'll simulate the evaluation
    const isCorrect = Math.random() > 0.3; // 70% success rate for demo
    const score = isCorrect
      ? Math.floor(Math.random() * 30) + 70
      : Math.floor(Math.random() * 50);

    const submission = await prisma.codeSubmission.create({
      data: {
        userId,
        challengeId,
        code,
        language,
        status: isCorrect ? "PASSED" : "FAILED",
        score,
        timeSpent,
        hints: hints || 0,
        passedTests: isCorrect ? 10 : Math.floor(Math.random() * 8),
        totalTests: 10,
        feedback: isCorrect
          ? "Great job! All tests passed."
          : "Some tests failed. Review your logic and try again.",
      },
    });

    // If successful, award XP to user
    if (isCorrect) {
      const challenge = await prisma.challenge.findUnique({
        where: { id: challengeId },
        select: { xpReward: true },
      });

      if (challenge) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: {
              increment: challenge.xpReward,
            },
          },
        });
      }
    }

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error("Error submitting code:", error);
    return NextResponse.json(
      { error: "Failed to submit code" },
      { status: 500 }
    );
  }
}

// GET /api/submissions - Get user submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const challengeId = searchParams.get("challengeId");

    const whereClause: { userId?: string; challengeId?: string } = {};
    if (userId) whereClause.userId = userId;
    if (challengeId) whereClause.challengeId = challengeId;

    const submissions = await prisma.codeSubmission.findMany({
      where: whereClause,
      include: {
        challenge: {
          select: {
            title: true,
            difficulty: true,
            technology: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
