"use client";

import React from 'react';

interface Activity {
  id: string;
  type: 'lesson' | 'quiz' | 'achievement' | 'certificate' | 'streak';
  title: string;
  description: string;
  timestamp: string;
  xpGained?: number;
}

export default function RecentActivities() {
  // Mock activities data
  const activities: Activity[] = [
    {
      id: '1',
      type: 'lesson',
      title: 'JavaScript Fundamentals',
      description: 'Completed Lesson 4: Functions & Scope',
      timestamp: '2 hours ago',
      xpGained: 25
    },
    {
      id: '2',
      type: 'quiz',
      title: 'CSS Mastery Quiz',
      description: 'Scored 90% on the quiz',
      timestamp: '5 hours ago',
      xpGained: 30
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Code Streak',
      description: 'Achieved a 7-day learning streak',
      timestamp: 'Yesterday',
      xpGained: 50
    },
    {
      id: '4',
      type: 'certificate',
      title: 'HTML Basics',
      description: 'Earned course completion certificate',
      timestamp: '3 days ago',
      xpGained: 100
    },
    {
      id: '5',
      type: 'streak',
      title: 'Daily Goal Completed',
      description: 'Reached your daily learning goal',
      timestamp: '3 days ago',
      xpGained: 15
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return (
          <svg className="w-5 h-5 text-[#28c7f9]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        );
      case 'quiz':
        return (
          <svg className="w-5 h-5 text-[#8e5ff5]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        );
      case 'achievement':
        return (
          <svg className="w-5 h-5 text-[#58c896]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        );
      case 'certificate':
        return (
          <svg className="w-5 h-5 text-[#fab72b]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="14" x="3" y="4" rx="2" />
            <line x1="8" x2="16" y1="14" y2="14" />
            <line x1="8" x2="16" y1="10" y2="10" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
        );
      case 'streak':
        return (
          <svg className="w-5 h-5 text-[#ff5e7d]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-[#28c7f9]/20';
      case 'quiz': return 'bg-[#8e5ff5]/20';
      case 'achievement': return 'bg-[#58c896]/20';
      case 'certificate': return 'bg-[#fab72b]/20';
      case 'streak': return 'bg-[#ff5e7d]/20';
      default: return 'bg-gray-500/20';
    }
  };

  return (
    <div className="bg-dark-300/30 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-[#28c7f9]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          Recent Activity
        </h2>
        <button className="text-sm text-[#28c7f9] hover:text-white transition-colors">
          View All
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="relative">
          {/* Timeline track */}
          <div className="absolute left-[17px] top-1 bottom-1 w-0.5 bg-dark-200"></div>
          
          {/* Activities */}
          <div className="space-y-5">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative flex gap-3">
                {/* Activity icon */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Activity content */}
                <div className="flex-1 bg-dark-200/50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{activity.title}</h3>
                      <p className="text-gray-400 text-xs">{activity.description}</p>
                    </div>
                    {activity.xpGained && (
                      <div className="bg-dark-300 rounded-full px-2 py-0.5 text-xs text-[#28c7f9] font-medium">
                        +{activity.xpGained} XP
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-2">
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs">
        <button className="text-[#28c7f9] hover:text-white flex items-center transition-colors">
          <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          Export Activity Data
        </button>
        <span className="text-gray-400">This week: 12 activities</span>
      </div>
    </div>
  );
}