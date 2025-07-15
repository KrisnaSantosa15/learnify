"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  progressPercentage: number;
  totalLessons: number;
  completedLessons: number;
  isEnrolled: boolean;
  icon?: string;
  color?: string;
  lastAccessed?: string;
  nextLesson?: string;
  relatedAchievements?: string[];
}

export default function CourseProgress() {
  const { user } = useAuth();
  const [dailyGoal] = useState(60); // in minutes
  const [dailyProgress] = useState(45); // in minutes
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's enrolled courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/courses?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        // Filter only enrolled courses
        const enrolledCourses = data.courses.filter(
          (course: Course) => course.isEnrolled
        );
        setCourses(enrolledCourses);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Mock data for courses in progress (fallback)
  const fallbackCourses = [
    {
      id: 1,
      title: "Python Mastery",
      progressPercentage: 82,
      category: "Programming",
      icon: "🐍",
      color: "blue",
      lastAccessed: "Today",
      nextLesson: "Advanced Data Structures",
      relatedAchievements: ["Quick Learner", "Code Streak"],
      description: "Master Python programming",
      difficulty: "Intermediate",
      totalLessons: 30,
      completedLessons: 25,
      isEnrolled: true,
    },
    {
      id: 2,
      title: "React Fundamentals",
      progressPercentage: 45,
      category: "Web Development",
      icon: "⚛️",
      color: "purple",
      lastAccessed: "Yesterday",
      nextLesson: "State Management",
      relatedAchievements: ["Weekend Warrior"],
      description: "Learn React basics",
      difficulty: "Beginner",
      totalLessons: 20,
      completedLessons: 9,
      isEnrolled: true,
    },
    {
      id: 3,
      title: "Machine Learning",
      progressPercentage: 67,
      category: "Data Science",
      icon: "🤖",
      color: "green",
      lastAccessed: "2 days ago",
      nextLesson: "Neural Networks",
      relatedAchievements: ["Quiz Master"],
      description: "Introduction to ML",
      difficulty: "Advanced",
      totalLessons: 40,
      completedLessons: 27,
      isEnrolled: true,
    },
  ];

  // Use database courses or fallback
  const displayCourses = courses.length > 0 ? courses : fallbackCourses;

  // Course recommendations based on current progress
  const recommendations = [
    {
      id: 4,
      title: "TypeScript Essentials",
      category: "Programming",
      icon: "📘",
      color: "blue",
      match: "98% match based on your React progress",
    },
    {
      id: 5,
      title: "Data Visualization",
      category: "Data Science",
      icon: "📊",
      color: "green",
      match: "95% match based on your ML course",
    },
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case "green":
        return {
          bg: "bg-[#58c896]",
          bgLight: "bg-[#58c896]/20",
          text: "text-[#58c896]",
        };
      case "purple":
        return {
          bg: "bg-[#8e5ff5]",
          bgLight: "bg-[#8e5ff5]/20",
          text: "text-[#8e5ff5]",
        };
      case "blue":
        return {
          bg: "bg-[#28c7f9]",
          bgLight: "bg-[#28c7f9]/20",
          text: "text-[#28c7f9]",
        };
      default:
        return {
          bg: "bg-[#58c896]",
          bgLight: "bg-[#58c896]/20",
          text: "text-[#58c896]",
        };
    }
  };

  return (
    <div className="bg-dark-300/30 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-[#58c896]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          Course Progress
        </h2>
        <button className="text-sm text-[#58c896]">See All</button>
      </div>

      {/* Daily Goal Progress */}
      <div className="p-4 border-b border-white/5 bg-dark-200/30">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-white font-medium text-sm">Daily Study Goal</h3>
            <p className="text-xs text-gray-400">
              {dailyProgress} of {dailyGoal} minutes completed
            </p>
          </div>
          <div className="text-white font-medium text-xl">
            {Math.round((dailyProgress / dailyGoal) * 100)}%
          </div>
        </div>
        <div className="h-2 w-full bg-dark-300 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#58c896]"
            style={{ width: `${(dailyProgress / dailyGoal) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 flex justify-between text-xs">
          <button className="text-[#58c896]">Adjust Goal</button>
          <button className="text-[#58c896]">Add Study Time</button>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {displayCourses.map((course) => {
            const colorClasses = getColorClass(course.color || "blue");
            return (
              <div
                key={course.id}
                className="bg-dark-200/50 rounded-lg p-4 hover:bg-dark-200 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`h-10 w-10 rounded-lg ${colorClasses.bgLight} flex items-center justify-center text-xl`}
                  >
                    {course.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{course.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-xs">{course.category}</p>
                      <p className="text-gray-500 text-xs">
                        Last accessed: {course.lastAccessed}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">{`Progress: ${course.progressPercentage}%`}</span>
                  <span className={colorClasses.text + " text-xs"}>
                    {course.progressPercentage < 30
                      ? "Just Started"
                      : course.progressPercentage < 70
                      ? "In Progress"
                      : "Almost Complete"}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-dark-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colorClasses.bg}`}
                    style={{ width: `${course.progressPercentage}%` }}
                  ></div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    Next:{" "}
                    <span className="text-white">{course.nextLesson}</span>
                  </div>
                  <button
                    className={`px-3 py-1 rounded text-xs ${colorClasses.bg} text-white`}
                  >
                    Continue
                  </button>
                </div>

                {course.relatedAchievements &&
                  course.relatedAchievements.length > 0 && (
                    <div className="mt-3 border-t border-white/5 pt-2">
                      <p className="text-xs text-gray-400 mb-1.5">
                        Related achievements:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {course.relatedAchievements.map(
                          (achievement, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-dark-300/50 rounded text-xs text-gray-300"
                            >
                              {achievement}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            );
          })}

          {/* Recommended Courses */}
          <div className="mt-2 pt-2 border-t border-white/10">
            <h3 className="text-white font-medium mb-3">Recommended for you</h3>
            {recommendations.map((course) => {
              const colorClasses = getColorClass(course.color);
              return (
                <div
                  key={course.id}
                  className="bg-dark-200/30 rounded-lg p-3 mb-3 hover:bg-dark-200/70 transition-colors flex items-center gap-3"
                >
                  <div
                    className={`h-9 w-9 rounded-lg ${colorClasses.bgLight} flex items-center justify-center text-lg`}
                  >
                    {course.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium">
                      {course.title}
                    </h4>
                    <p className="text-gray-400 text-xs">{course.match}</p>
                  </div>
                  <button className="px-2 py-1 rounded bg-dark-100 hover:bg-dark-50 text-xs text-white">
                    Preview
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <button className="w-full mt-4 py-3 rounded-lg bg-dark-200 hover:bg-dark-100 text-white font-medium flex items-center justify-center">
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
          Explore New Courses
        </button>
      </div>
    </div>
  );
}
