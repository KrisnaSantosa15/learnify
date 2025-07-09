"use client";

import React, { useState } from "react";

interface CourseHeaderProps {
  dimension?: number;
  node?: number;
  title?: string;
}

export default function CourseHeader({
  dimension = 2,
  node = 3,
  title = "Control Flow Paradigms",
}: CourseHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Generate a complex, abstract pattern for the background
  const generatePatternPoints = () => {
    const points = [];
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      points.push(`${x}% ${y}%`);
    }
    return points.join(", ");
  };

  return (
    <div className="relative mb-6 group">
      {/* Unconventional background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2c1654] to-[#1f3450] rounded-xl overflow-hidden z-0">
        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white"
              style={{
                width: `${Math.random() * 30 + 10}%`,
                height: `${Math.random() * 30 + 10}%`,
                top: `${Math.random() * 70}%`,
                left: `${Math.random() * 70}%`,
                opacity: Math.random() * 0.1 + 0.05,
                borderRadius: `${generatePatternPoints()}`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        {/* Dynamic "waveform" elements */}
        <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 bg-white w-1.5"
              style={{
                left: `${i * 5}%`,
                height: `${(Math.sin(i / 3) + 1) * 20 + 10}%`,
                opacity: 0.5 + Math.sin(i / 5) * 0.5,
                animationDuration: `${2 + Math.random() * 2}s`,
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-5 overflow-hidden">
        <div className="flex justify-between items-start">
          {/* Left: Anti-mainstream navigation */}
          <div className="flex items-center">
            <button
              onClick={() => {}}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white mr-4"
            >
              <svg
                className="w-5 h-5 transform rotate-45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>

            <div>
              <div className="flex items-center text-[#a6c6df] text-xs mb-1 font-mono">
                <span className="inline-block w-3 h-3 rounded-full bg-[#9583e6] mr-2"></span>
                DIMENSION {dimension}.{node}
              </div>
              <h1 className="text-white text-xl font-bold">{title}</h1>
            </div>
          </div>

          {/* Right: Glossary button with pop-out menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`
                flex items-center px-4 py-2 rounded-full 
                ${
                  menuOpen
                    ? "bg-white text-[#2c1654]"
                    : "bg-white/10 text-white hover:bg-white/20"
                } 
                transition-all duration-300
              `}
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              NEURAL MAP
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-20">
                <div className="bg-gradient-to-r from-[#2c1654] to-[#1f3450] text-white p-3">
                  <h3 className="font-bold">Cognitive Framework</h3>
                  <p className="text-xs text-white/80">
                    Access conceptual nodes and patterns
                  </p>
                </div>

                <div className="p-2">
                  {[
                    "Variables",
                    "Functions",
                    "Control Flow",
                    "Objects",
                    "Arrays",
                  ].map((item, i) => (
                    <button
                      key={i}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm flex items-center"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#9583e6] mr-2"></span>
                      {item}
                    </button>
                  ))}
                </div>

                <div className="bg-gray-50 p-2 border-t border-gray-200">
                  <button className="w-full p-2 text-sm text-center text-[#2c1654] font-medium">
                    Expand Full Architecture
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress indicators - abstract representation */}
        <div className="mt-5 flex items-center">
          <div className="flex-grow h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#9583e6] to-[#6fb8e6] w-3/5"></div>
          </div>

          {/* Unconventional node markers */}
          <div className="flex gap-1 ml-3">
            {[...Array(5)].map((_, i) => {
              // Different shapes for different nodes
              let nodeShape = "";
              if (i === 0) nodeShape = "rounded-full";
              else if (i === 1) nodeShape = "rounded-sm";
              else if (i === 2) nodeShape = "transform rotate-45";
              else if (i === 3) nodeShape = "clip-path-triangle";
              else nodeShape = "rounded-full";

              const isActive = i < 3;
              const isCurrent = i === 2;

              return (
                <div
                  key={i}
                  className={`
                    w-2 h-2 ${nodeShape} 
                    ${
                      isActive
                        ? isCurrent
                          ? "bg-white"
                          : "bg-[#9583e6]"
                        : "bg-white/20"
                    }
                    ${isCurrent ? "ring-2 ring-white/30" : ""}
                  `}
                ></div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unconventional decorative element */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#2c1654] rotate-45 z-10"></div>

      <style jsx>{`
        .clip-path-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
}
