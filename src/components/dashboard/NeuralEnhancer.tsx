"use client";

import React, { useState } from "react";

export default function NeuralEnhancer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-b from-[#152438] to-[#0c1827] border border-white/5 rounded-xl overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10,30 L30,10 M40,20 L20,40 M50,10 L10,50 M60,20 L20,60 M70,30 L30,70 M80,40 L40,80 M90,50 L50,90 M90,30 L30,90 M80,20 L20,80 M70,10 L10,70"
            stroke="#8e5ff5"
            strokeWidth="0.5"
          />
          <path
            d="M90,70 L70,90 M80,60 L60,80 M70,50 L50,70 M60,40 L40,60 M50,30 L30,50 M40,20 L20,40"
            stroke="#28c7f9"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <div className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-[#8e5ff5] to-[#28c7f9] flex items-center justify-center mr-2">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="font-bold text-white">Code Accelerator</h2>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#28c7f9] hover:text-white transition-colors"
          >
            {expanded ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Basic content always visible */}
        <div className="text-white text-sm mb-3">
          Unlock advanced programming tools and accelerate your coding skills.
        </div>

        {/* Expandable content */}
        {expanded && (
          <div className="space-y-4 mt-4 animate-fadeIn">
            <div className="space-y-2">
              {/* Feature list */}
              {[
                {
                  icon: "👩‍💻",
                  title: "AI Code Reviews",
                  description: "Get instant feedback on your coding exercises",
                },
                {
                  icon: "🔍",
                  title: "Advanced Projects",
                  description: "Access to 200+ premium project tutorials",
                },
                {
                  icon: "📊",
                  title: "Performance Analytics",
                  description: "Track your progress with detailed metrics",
                },
                {
                  icon: "🏆",
                  title: "Interview Prep",
                  description: "Specialized tracks for technical interviews",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center mr-3">
                    <span className="text-lg">{feature.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <div className="text-white">
                  <span className="font-bold text-xl">$9.99</span>
                  <span className="text-xs text-gray-400 ml-1">/month</span>
                </div>
                <div className="bg-[#28c7f9]/20 text-[#28c7f9] text-xs font-medium px-2 py-1 rounded">
                  7-day free trial
                </div>
              </div>
              <button className="w-full py-2 bg-gradient-to-r from-[#8e5ff5] to-[#28c7f9] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                Activate Code Accelerator
              </button>
            </div>
          </div>
        )}

        {/* Teaser for collapsed state */}
        {!expanded && (
          <div className="mt-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#8e5ff5]"></div>
              <div className="w-2 h-2 rounded-full bg-[#28c7f9]"></div>
              <div className="w-2 h-2 rounded-full bg-[#fab72b]"></div>
              <span className="text-xs text-gray-400 ml-1">
                Click to see all features
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
