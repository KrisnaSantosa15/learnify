import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/courses - Get all courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");

    const whereClause: { isPublished: boolean; category?: string } = {
      isPublished: true,
    };

    if (category && category !== "all") {
      whereClause.category = category;
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        modules: {
          include: {
            lessons: {
              include: userId
                ? {
                    progress: {
                      where: { userId: parseInt(userId) },
                    },
                  }
                : false,
            },
          },
        },
        enrollments: userId
          ? {
              where: { userId: parseInt(userId) },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate progress for each course if userId is provided
    const coursesWithProgress = courses.map((course: any) => {
      if (!userId) return course;

      const totalLessons = course.modules.reduce(
        (total: number, module: any) => total + module.lessons.length,
        0
      );
      const completedLessons = course.modules.reduce(
        (total: number, module: any) => {
          return (
            total +
            module.lessons.filter(
              (lesson: any) =>
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
        ...course,
        progressPercentage,
        totalLessons,
        completedLessons,
        isEnrolled: course.enrollments && course.enrollments.length > 0,
      };
    });

    return NextResponse.json({ courses: coursesWithProgress });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course (admin only)
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      price,
      imageUrl,
      tags,
      modules,
    } = await request.json();

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        difficulty: difficulty || "BEGINNER",
        duration: duration || 0,
        price: price || 0,
        imageUrl,
        tags: tags || [],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create modules if provided
    if (modules && modules.length > 0) {
      for (const moduleData of modules) {
        await prisma.module.create({
          data: {
            title: moduleData.title,
            description: moduleData.description,
            orderIndex: moduleData.orderIndex || 0,
            courseId: course.id,
          },
        });
      }
    }

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
