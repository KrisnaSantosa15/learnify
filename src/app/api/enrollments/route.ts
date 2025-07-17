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
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: parseInt(userId),
          courseId: parseInt(courseId),
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 409 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        enrolledAt: new Date(),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
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

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  include: {
                    progress: {
                      where: { userId: parseInt(userId) },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    // Calculate progress for each enrollment
    const enrollmentsWithProgress = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.modules.reduce(
        (total: number, module: { lessons: unknown[] }) =>
          total + module.lessons.length,
        0
      );

      const completedLessons = enrollment.course.modules.reduce(
        (
          total: number,
          module: { lessons: { progress: { isCompleted: boolean }[] }[] }
        ) => {
          return (
            total +
            module.lessons.filter(
              (lesson: { progress: { isCompleted: boolean }[] }) =>
                lesson.progress &&
                lesson.progress.length > 0 &&
                lesson.progress[0].isCompleted
            ).length
          );
        },
        0
      );

      const progressPercentage =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      return {
        ...enrollment,
        progressPercentage,
        totalLessons,
        completedLessons,
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
