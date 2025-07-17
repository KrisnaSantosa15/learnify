import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET /api/quizzes - Get all published quizzes (or all quizzes for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const admin = searchParams.get("admin"); // Add admin parameter

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    // Only filter by isPublished if not admin
    if (!admin || admin !== "true") {
      whereClause.isPublished = true;
    }

    if (category && category !== "All") {
      whereClause.categoryId = category;
    }

    if (difficulty) {
      whereClause.difficulty = difficulty.toUpperCase();
    }

    const quizzes = await prisma.quiz.findMany({
      where: whereClause,
      include: {
        category: true,
        questions: {
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

// POST /api/quizzes - Create a new quiz (admin functionality)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const {
      title,
      description,
      difficulty,
      categoryId,
      timeLimit,
      xpReward,
      questions,
      isPublished,
      randomizeQuestions,
      showProgress,
      allowRetakes,
      showExplanations,
      instantFeedback,
      certificateEligible,
    } = await request.json();

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        difficulty: difficulty.toUpperCase(),
        categoryId,
        timeLimit,
        xpReward: xpReward || 100,
        isPublished: isPublished !== undefined ? isPublished : true,

        // Advanced settings
        randomizeQuestions: randomizeQuestions || false,
        showProgress: showProgress || true,
        allowRetakes: allowRetakes || true,
        showExplanations: showExplanations || true,
        instantFeedback: instantFeedback || false,
        certificateEligible: certificateEligible || false,
        questions: {
          create: questions.map(
            (
              q: {
                question: string;
                options: string[];
                correctAnswer: number;
                explanation?: string;
                points?: number;
              },
              index: number
            ) => ({
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              order: index + 1,
              points: q.points || 10,
            })
          ),
        },
      },
      include: {
        category: true,
        questions: true,
      },
    });

    return NextResponse.json({ quiz }, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}
