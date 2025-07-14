"use client";

import React, { useState, useRef, useEffect } from "react";

interface Course {
  id: string;
  name: string;
  icon: string;
  color: string;
  progress: number;
}

interface CourseSelectorProps {
  currentCourseId?: string;
  onCourseChange?: (courseId: string) => void;
}

export default function CourseSelector({
  currentCourseId = "js",
  onCourseChange,
}: CourseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCourseChange = (courseId: string) => {
    if (onCourseChange) {
      onCourseChange(courseId);
    }
  };

  // Mock data for available courses
  const courses: Course[] = [
    {
      id: "js",
      name: "JavaScript",
      icon: "JS",
      color: "#f7df1e",
      progress: 67,
    },
    {
      id: "py",
      name: "Python",
      icon: "PY",
      color: "#3776ab",
      progress: 32,
    },
    {
      id: "react",
      name: "React",
      icon: "⚛️",
      color: "#61dafb",
      progress: 15,
    },
    {
      id: "ts",
      name: "TypeScript",
      icon: "TS",
      color: "#3178c6",
      progress: 8,
    },
  ];

  const currentCourse =
    courses.find((course) => course.id === currentCourseId) || courses[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current course button - more prominent */}
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-4 rounded-xl bg-dark-300/30 hover:bg-dark-300/50 border border-white/10 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
            style={{ backgroundColor: currentCourse.color }}
          >
            {currentCourse.icon}
          </div>
          <div className="text-left">
            <span className="text-white font-semibold text-lg block">
              {currentCourse.name}
            </span>
            <span className="text-gray-400 text-sm">
              {currentCourse.progress}% complete
            </span>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Dropdown panel - cleaner */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-dark-300/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-bold text-lg">Choose Your Course</h3>
            <p className="text-gray-400 text-sm">
              Switch to a different programming language
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {courses.map((course) => (
              <button
                key={course.id}
                className={`w-full flex items-center gap-3 p-3 hover:bg-dark-200 transition-colors ${
                  course.id === currentCourseId ? "bg-dark-200" : ""
                }`}
                onClick={() => {
                  handleCourseChange(course.id);
                  setIsOpen(false);
                }}
              >
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center text-dark-300 font-bold"
                  style={{ backgroundColor: course.color }}
                >
                  {course.icon}
                </div>

                <div className="flex-1 text-left">
                  <div className="text-white font-medium">{course.name}</div>
                  <div className="flex items-center mt-1">
                    <div className="w-24 h-1.5 bg-dark-100 rounded-full overflow-hidden mr-2">
                      <div
                        className="h-full"
                        style={{
                          width: `${course.progress}%`,
                          backgroundColor: course.color,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {course.progress}%
                    </span>
                  </div>
                </div>

                {course.id === currentCourseId && (
                  <div className="h-5 w-5 rounded-full bg-[#58c896]/20 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-[#58c896]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-white/10 bg-dark-200/50">
            <button className="w-full py-2 rounded-lg bg-[#28c7f9] hover:bg-[#28c7f9]/80 text-white font-medium flex items-center justify-center text-sm">
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add New Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
