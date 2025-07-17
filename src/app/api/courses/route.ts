import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/courses - Get all courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");

    const whereClause: { isPublished: boolean; technology?: string } = {
      isPublished: true,
    };

    if (category && category !== "all") {
      whereClause.technology = category;
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        progress: userId
          ? {
              where: { userId: userId },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate progress for each course if userId is provided
    const coursesWithProgress = courses.map((course: unknown) => {
      const courseData = course as {
        modules: Array<{
          lessons: Array<{ id: string }>;
        }>;
        progress: Array<{ progress: number; isCompleted: boolean }>;
        [key: string]: unknown;
      };

      if (!userId) return courseData;

      const totalLessons = courseData.modules.reduce(
        (total: number, module) => total + module.lessons.length,
        0
      );

      // Get progress from the CourseProgress model
      const courseProgress =
        courseData.progress.length > 0 ? courseData.progress[0] : null;
      const progressPercentage = courseProgress
        ? Math.round(courseProgress.progress)
        : 0;
      const completedLessons = courseProgress
        ? Math.round((totalLessons * courseProgress.progress) / 100)
        : 0;

      return {
        ...courseData,
        progressPercentage,
        totalLessons,
        completedLessons,
        isEnrolled: courseData.progress && courseData.progress.length > 0,
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
    const { title, description, category, difficulty, imageUrl, modules } =
      await request.json();

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
        technology: category, // Using technology field instead of category
        difficulty: difficulty || "BEGINNER",
        thumbnail: imageUrl,
        order: 0, // Default order
        isPublished: true,
      },
    });

    // Create modules if provided
    if (modules && modules.length > 0) {
      for (const moduleData of modules) {
        await prisma.module.create({
          data: {
            title: moduleData.title,
            description: moduleData.description,
            content: moduleData.content || {},
            order: moduleData.order || 0,
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
