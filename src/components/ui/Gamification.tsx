"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  earned?: boolean;
  xpReward: number;
}

function AchievementBadge({
  title,
  description,
  icon,
  rarity,
  earned = false,
  xpReward,
}: AchievementBadgeProps) {
  const rarityMap = {
    common: {
      bg: "#0b1d48",
      text: "#28c7f9",
      border: "border-[#28c7f9]/30",
      shadow: "shadow-[#28c7f9]/20",
      badgeBg: "bg-[#28c7f9]/20",
      badgeText: "text-[#28c7f9]",
    },
    uncommon: {
      bg: "#0b2d1a",
      text: "#58c896",
      border: "border-[#58c896]/30",
      shadow: "shadow-[#58c896]/20",
      badgeBg: "bg-[#58c896]/20",
      badgeText: "text-[#58c896]",
    },
    rare: {
      bg: "#1d0b3d",
      text: "#8e5ff5",
      border: "border-[#8e5ff5]/30",
      shadow: "shadow-[#8e5ff5]/20",
      badgeBg: "bg-[#8e5ff5]/20",
      badgeText: "text-[#8e5ff5]",
    },
    epic: {
      bg: "#2d0b1e",
      text: "#ff5e7d",
      border: "border-[#ff5e7d]/30",
      shadow: "shadow-[#ff5e7d]/20",
      badgeBg: "bg-[#ff5e7d]/20",
      badgeText: "text-[#ff5e7d]",
    },
    legendary: {
      bg: "#2d2207",
      text: "#fab72b",
      border: "border-[#fab72b]/30",
      shadow: "shadow-[#fab72b]/20",
      badgeBg: "bg-[#fab72b]/20",
      badgeText: "text-[#fab72b]",
    },
  };

  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 relative overflow-hidden transition-all duration-300 ${
        earned
          ? `hover:border-${rarityMap[rarity].text}/50 hover:shadow-lg hover:${rarityMap[rarity].shadow}`
          : "grayscale-[70%] opacity-70"
      }`}
    >
      {/* Rarity indicator */}
      <div
        className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium uppercase rounded-full ${rarityMap[rarity].badgeBg} ${rarityMap[rarity].badgeText}`}
      >
        {rarity}
      </div>

      <div className="text-center">
        <div
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3`}
          style={{ backgroundColor: earned ? rarityMap[rarity].bg : "#1a1a1a" }}
        >
          <div
            className={`text-3xl ${
              earned ? `text-[${rarityMap[rarity].text}]` : "text-gray-500"
            }`}
          >
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-[#a8b1c2] text-sm mb-3">{description}</p>
        <div
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${rarityMap[rarity].badgeBg} ${rarityMap[rarity].badgeText}`}
        >
          +{xpReward} XP
        </div>
      </div>
    </div>
  );
}

interface LeaderboardEntryProps {
  rank: number;
  avatar: string;
  name: string;
  points: number;
  isUser?: boolean;
}

function LeaderboardEntry({
  rank,
  avatar,
  name,
  points,
  isUser = false,
}: LeaderboardEntryProps) {
  return (
    <div
      className={`flex items-center p-3 rounded-lg transition-all ${
        isUser
          ? "bg-[#8e5ff5]/10 border border-[#8e5ff5]/30"
          : "hover:bg-white/5"
      }`}
    >
      <div className="text-lg font-medium w-6 text-center text-white">
        {rank}
      </div>

      <div
        className={`ml-3 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? "bg-[#8e5ff5]/20 text-[#8e5ff5]" : "bg-[#131d33] text-white"
        }`}
      >
        {avatar}
      </div>

      <div className="ml-4 flex-1">
        <div
          className={`font-medium ${isUser ? "text-[#8e5ff5]" : "text-white"}`}
        >
          {name}{" "}
          {isUser && <span className="text-xs ml-1 opacity-70">(you)</span>}
        </div>
      </div>

      <div
        className={`font-bold ${isUser ? "text-[#8e5ff5]" : "text-[#a8b1c2]"}`}
      >
        {points.toLocaleString()} XP
      </div>
    </div>
  );
}

function ProgressBar({
  value,
  color = "blue",
  height = "h-2",
  label,
  showPercentage = false,
}: {
  value: number;
  color?: "blue" | "purple" | "pink" | "green" | "yellow";
  height?: string;
  label?: string;
  showPercentage?: boolean;
}) {
  const colorMap = {
    blue: {
      bg: "bg-gradient-to-r from-[#28c7f9] to-[#1055b6]",
      text: "text-[#28c7f9]",
    },
    purple: {
      bg: "bg-gradient-to-r from-[#8e5ff5] to-[#5534b1]",
      text: "text-[#8e5ff5]",
    },
    pink: {
      bg: "bg-gradient-to-r from-[#ff5e7d] to-[#bc3654]",
      text: "text-[#ff5e7d]",
    },
    green: {
      bg: "bg-gradient-to-r from-[#58c896] to-[#2a9c6a]",
      text: "text-[#58c896]",
    },
    yellow: {
      bg: "bg-gradient-to-r from-[#fab72b] to-[#f59d0e]",
      text: "text-[#fab72b]",
    },
  };

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-[#a8b1c2] text-sm">{label}</span>}
          {showPercentage && (
            <span className={`${colorMap[color].text} text-sm font-medium`}>
              {value}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${height} bg-[#1c2841] rounded-full overflow-hidden`}
      >
        <div
          className={`h-full ${colorMap[color].bg} rounded-full`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function Gamification() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Sample achievements data
  const achievements = [
    {
      title: "First Code Challenge",
      description: "Complete your first programming challenge",
      icon: "🚀",
      rarity: "common",
      earned: true,
      xpReward: 100,
    },
    {
      title: "Bug Destroyer",
      description: "Fix 10 bugs in your code",
      icon: "🐛",
      rarity: "uncommon",
      earned: true,
      xpReward: 250,
    },
    {
      title: "Algorithm Master",
      description: "Complete the advanced algorithms course",
      icon: "🧠",
      rarity: "rare",
      earned: false,
      xpReward: 500,
    },
  ] as const;

  // Sample leaderboard data
  const leaderboard = [
    { rank: 1, avatar: "👑", name: "Alex M.", points: 12750 },
    { rank: 2, avatar: "👾", name: "Sarah K.", points: 10580 },
    { rank: 3, avatar: "🏆", name: "Jamie T.", points: 9340 },
    { rank: 4, avatar: "🚀", name: "You", points: 8125, isUser: true },
    { rank: 5, avatar: "🧠", name: "Chris D.", points: 7890 },
  ];

  return (
    <section
      id="gamification"
      className="py-24 relative"
      ref={sectionRef}
      style={{
        background: "linear-gradient(135deg, #120b34 0%, #220a20 100%)",
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
        {/* Large circle */}
        <div
          className="absolute top-20 -right-20 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle at center, rgba(142, 95, 245, 0.8), transparent 70%)",
          }}
        ></div>
        {/* Small circles */}
        <div
          className="absolute bottom-40 left-10 w-32 h-32 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255, 94, 125, 0.8), transparent 70%)",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        {/* Section header */}
        <div
          className="max-w-2xl mx-auto text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(2rem)",
            transition: "all 1000ms",
          }}
        >
          <div className="inline-block mb-3">
            <div className="h-1.5 w-20 bg-gradient-to-r from-[#8e5ff5] to-[#ff5e7d] mx-auto rounded-full mb-6"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-white">Gamify Your </span>
            <span className="text-[#8e5ff5]">Coding Journey</span>
          </h2>
          <p className="text-lg text-[#a8b1c2]">
            Stay motivated with coding challenges, achievements, and
            competition. Turn learning to code into an addictive game that
            levels up your real skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left column: Game Stats Dashboard */}
          <div
            className="bg-[#151f38]/60 border border-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(2rem)",
              transition: "all 1000ms 200ms",
            }}
          >
            <div className="p-6 bg-[#131d33]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-[#1d0b3d] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[#8e5ff5]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium">
                    Your Coding Stats
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-[#8e5ff5]/20 text-[#8e5ff5] text-xs rounded-full">
                    Level 8 Coder
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Experience Bar */}
              <div className="p-4 bg-[#131d33]/80 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">Developer XP</span>
                  <span className="text-[#8e5ff5]">8,125 / 10,000 XP</span>
                </div>
                <ProgressBar value={81} color="purple" height="h-3" />
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-[#a8b1c2]">Level 8</span>
                  <span className="text-[#a8b1c2]">1,875 XP to Level 9</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl text-[#ff5e7d] mb-1">42</div>
                  <div className="text-xs text-[#a8b1c2]">Days Streak</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl text-[#fab72b] mb-1">86</div>
                  <div className="text-xs text-[#a8b1c2]">Challenges</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl text-[#58c896] mb-1">12</div>
                  <div className="text-xs text-[#a8b1c2]">Badges</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl text-[#28c7f9] mb-1">4</div>
                  <div className="text-xs text-[#a8b1c2]">Rank</div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4 mb-6">
                <h3 className="text-white font-medium mb-4">Coding Skills</h3>
                <ProgressBar
                  value={85}
                  color="blue"
                  label="HTML"
                  showPercentage={true}
                />

                <ProgressBar
                  value={62}
                  color="purple"
                  label="CSS"
                  showPercentage={true}
                />

                <ProgressBar
                  value={45}
                  color="pink"
                  label="Javascript"
                  showPercentage={true}
                />

                <ProgressBar
                  value={28}
                  color="green"
                  label="Python"
                  showPercentage={true}
                />
              </div>

              {/* Learning Streak Calendar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-medium">Learning Streak</h3>
                  <span className="text-[#fab72b] text-sm font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      />
                    </svg>
                    42 day streak
                  </span>
                </div>

                <div className="bg-[#131d33]/80 rounded-lg p-4">
                  <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                      <div key={i} className="text-xs text-[#6a7a95]">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(28)].map((_, i) => {
                      // Today is May 3, 2025 (index 24)
                      const isToday = i === 24;

                      // Calculate if day is active:
                      // - Before today: active (completed days)
                      // - Today: active (current day)
                      // - After today: inactive (future days)
                      const isActive = i <= 24;

                      // Calculate day number (starting from previous month)
                      // April has 30 days, so we'll start from April 6 (for a 4-week view)
                      const startDate = new Date(2025, 3, 6); // April 6, 2025
                      const currentDate = new Date(startDate);
                      currentDate.setDate(startDate.getDate() + i);
                      const dayNumber = currentDate.getDate();

                      return (
                        <div
                          key={i}
                          className={`w-full aspect-square rounded-md flex items-center justify-center text-xs
                            ${isToday ? "border border-[#e0c791]" : ""}
                            ${
                              isActive
                                ? "bg-[#fab72b] text-black"
                                : "bg-[#1c2841] text-[#6a7a95]"
                            }
                          `}
                        >
                          {dayNumber}
                          {isToday && (
                            <div className="absolute h-1.5 w-1.5 rounded-full bg-[#ff5e7d] -mt-5"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-medium">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#131d33]/80 rounded-lg p-3 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-[#28c7f9]/20 flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-[#28c7f9]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">
                        Completed JavaScript Challenge
                      </div>
                      <div className="text-xs text-[#6a7a95] flex justify-between mt-1">
                        <span>2 hours ago</span>
                        <span className="text-[#28c7f9]">+35 XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#131d33]/80 rounded-lg p-3 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-[#58c896]/20 flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-[#58c896]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">
                        Earned &quot;Bug Destroyer&quot; Badge
                      </div>
                      <div className="text-xs text-[#6a7a95] flex justify-between mt-1">
                        <span>Yesterday</span>
                        <span className="text-[#58c896]">+250 XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#131d33]/80 rounded-lg p-3 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-[#fab72b]/20 flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-[#fab72b]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">Reached Level 8</div>
                      <div className="text-xs text-[#6a7a95] flex justify-between mt-1">
                        <span>3 days ago</span>
                        <span className="text-[#fab72b]">Achievement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/profile"
                  className="text-[#8e5ff5] text-sm hover:text-[#a47afb] transition-colors flex items-center justify-center"
                >
                  <span>View Full Stats</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Right column: split into two parts - Achievements and Leaderboard */}
          <div className="space-y-6">
            {/* Achievements */}
            <div
              className="bg-[#151f38]/60 border border-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/10"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(2rem)",
                transition: "all 1000ms 400ms",
              }}
            >
              <div className="p-6 bg-[#131d33]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-[#2d0b1e] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#ff5e7d]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <span className="text-white font-medium">
                      Coding Achievements
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-[#ff5e7d]/20 text-[#ff5e7d] text-xs rounded-full">
                      12 Unlocked
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <AchievementBadge
                      key={index}
                      title={achievement.title}
                      description={achievement.description}
                      icon={achievement.icon}
                      rarity={achievement.rarity}
                      earned={achievement.earned}
                      xpReward={achievement.xpReward}
                    />
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link
                    href="/achievements"
                    className="text-[#ff5e7d] text-sm hover:text-[#ff7b8f] transition-colors flex items-center justify-center"
                  >
                    <span>View All Achievements</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div
              className="bg-[#151f38]/60 border border-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(2rem)",
                transition: "all 1000ms 600ms",
              }}
            >
              <div className="p-6 bg-[#131d33]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-[#1d0b3d] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#8e5ff5]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-white font-medium">
                      Weekly Leaderboard
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-[#8e5ff5]/20 text-[#8e5ff5] text-xs rounded-full">
                      Top 5%
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <LeaderboardEntry
                      key={index}
                      rank={entry.rank}
                      avatar={entry.avatar}
                      name={entry.name}
                      points={entry.points}
                      isUser={entry.isUser}
                    />
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link
                    href="/leaderboard"
                    className="text-[#8e5ff5] text-sm hover:text-[#a47afb] transition-colors flex items-center justify-center"
                  >
                    <span>View Full Leaderboard</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="bg-[#151f38]/60 border border-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/10 max-w-4xl mx-auto p-8 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(2rem)",
            transition: "all 1000ms 800ms",
            background:
              "linear-gradient(135deg, rgba(21, 31, 56, 0.6) 0%, rgba(45, 11, 30, 0.6) 100%)",
          }}
        >
          <div className="max-w-lg mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-white">Ready to </span>
              <span className="text-[#ff5e7d]">Level Up</span>
              <span className="text-white"> Your Coding Skills?</span>
            </h3>
            <p className="text-[#a8b1c2] mb-6">
              Join thousands of developers who are turning programming practice
              into an addictively fun game.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-3 bg-[#8e5ff5] rounded-full text-white font-medium transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Start Coding Now</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#8e5ff5] to-[#ff5e7d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute inset-0 w-full h-full group-hover:shadow-[0_0_15px_rgba(142,95,245,0.5)] transition-all duration-300"></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
