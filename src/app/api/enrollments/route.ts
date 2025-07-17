import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/enrollments - Enroll in a course
export async function POST(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 409 }
      );
    }

    // Create enrollment (course progress record)
    const enrollment = await prisma.courseProgress.create({
      data: {
        userId: userId,
        courseId: courseId,
        progress: 0.0,
        timeSpent: 0,
        isCompleted: false,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            technology: true,
            difficulty: true,
          },
        },
      },
    });

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
}

// GET /api/enrollments - Get user's enrollments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const enrollments = await prisma.courseProgress.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate progress for each enrollment
    const enrollmentsWithProgress = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.modules.reduce(
        (total: number, module: { lessons: unknown[] }) =>
          total + module.lessons.length,
        0
      );

      // Use the existing progress percentage from the CourseProgress model
      const progressPercentage = Math.round(enrollment.progress);

      return {
        ...enrollment,
        progressPercentage,
        totalLessons,
        completedLessons: Math.round(
          (totalLessons * enrollment.progress) / 100
        ),
      };
    });

    return NextResponse.json({ enrollments: enrollmentsWithProgress });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}
