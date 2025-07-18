import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET /api/quizzes/[id] - Get a specific quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Get quiz with all related data
    const quiz = await prisma.quiz.findUnique({
      where: { id },
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
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Get user attempts if user is logged in
    let userAttempts: {
      id: string;
      score: number;
      maxScore: number;
      timeSpent: number;
      completedAt: Date | null;
    }[] = [];
    let canTakeQuiz = true;

    if (session?.user?.id) {
      userAttempts = await prisma.quizAttempt.findMany({
        where: {
          quizId: id,
          userId: session.user.id,
        },
        orderBy: {
          completedAt: "desc",
        },
        select: {
          id: true,
          score: true,
          maxScore: true,
          timeSpent: true,
          completedAt: true,
        },
      });

      // Check if retakes are allowed
      if (!quiz.allowRetakes && userAttempts.length > 0) {
        canTakeQuiz = false;
      }
    }

    // Format quiz data for the component
    const formattedQuiz = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      category: {
        id: quiz.category.id,
        name: quiz.category.name,
        icon: quiz.category.icon,
        color: quiz.category.color,
      },
      timeLimit: quiz.timeLimit,
      xpReward: quiz.xpReward,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        order: q.order,
        points: q.points,
      })),
      settings: {
        randomizeQuestions: quiz.randomizeQuestions,
        showProgress: quiz.showProgress,
        allowRetakes: quiz.allowRetakes,
        showExplanations: quiz.showExplanations,
        instantFeedback: quiz.instantFeedback,
        certificateEligible: quiz.certificateEligible || false,
      },
      stats: {
        totalAttempts: quiz._count.attempts,
        questionCount: quiz.questions.length,
        maxScore: quiz.questions.reduce((sum, q) => sum + q.points, 0),
      },
    };

    return NextResponse.json({
      quiz: formattedQuiz,
      userAttempts: userAttempts.map((attempt) => ({
        ...attempt,
        percentage: Math.round((attempt.score / attempt.maxScore) * 100),
        completedAt:
          attempt.completedAt?.toISOString() || new Date().toISOString(),
      })),
      canTakeQuiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

// PUT /api/quizzes/[id] - Update a quiz
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!existingQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // First delete existing questions
    await prisma.quizQuestion.deleteMany({
      where: { quizId: id },
    });

    // Update quiz with new data and questions
    const updatedQuiz = await prisma.quiz.update({
      where: { id },
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
        showProgress: showProgress !== undefined ? showProgress : true,
        allowRetakes: allowRetakes !== undefined ? allowRetakes : true,
        showExplanations:
          showExplanations !== undefined ? showExplanations : true,
        instantFeedback: instantFeedback || false,
        certificateEligible: certificateEligible || false,

        updatedAt: new Date(),
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
        questions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}

// DELETE /api/quizzes/[id] - Delete a quiz
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            attempts: true,
          },
        },
      },
    });

    if (!existingQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Prevent deletion if quiz has attempts
    if (existingQuiz._count.attempts > 0) {
      return NextResponse.json(
        { error: "Cannot delete quiz with existing attempts" },
        { status: 400 }
      );
    }

    // Delete quiz (questions will be deleted due to cascade)
    await prisma.quiz.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
