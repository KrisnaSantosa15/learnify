import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const quizId = id;
    const body = await request.json();
    const { question, options, correctAnswer, explanation, points = 10 } = body;

    // Validate required fields
    if (!question || !options || correctAnswer === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Get the next order number
    const nextOrder = quiz.questions.length + 1;

    // Create the new question
    const newQuestion = await prisma.quizQuestion.create({
      data: {
        quizId,
        question,
        options,
        correctAnswer,
        explanation: explanation || "",
        points,
        order: nextOrder,
      },
    });

    return NextResponse.json(newQuestion);
  } catch (error) {
    console.error("Error adding question to quiz:", error);
    return NextResponse.json(
      { error: "Failed to add question to quiz" },
      { status: 500 }
    );
  }
}
