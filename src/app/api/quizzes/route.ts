import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/quizzes - Get all published quizzes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    const whereClause: {
      isPublished: boolean;
      category?: string;
      difficulty?: string;
    } = {
      isPublished: true,
    };

    if (category && category !== "All") {
      whereClause.category = category;
    }

    if (difficulty) {
      whereClause.difficulty = difficulty.toUpperCase();
    }

    const quizzes = await prisma.quiz.findMany({
      where: whereClause,
      include: {
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

    return NextResponse.json({ quizzes });
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
    const {
      title,
      description,
      difficulty,
      category,
      timeLimit,
      xpReward,
      questions,
    } = await request.json();

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        difficulty: difficulty.toUpperCase(),
        category,
        timeLimit,
        xpReward: xpReward || 100,
        isPublished: true,
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
