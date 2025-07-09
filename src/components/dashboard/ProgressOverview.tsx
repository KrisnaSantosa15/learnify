"use client";

import React from 'react';

export default function ProgressOverview() {
  // Mock data for progress statistics
  const stats = {
    totalXP: 40567.04,
    percentComplete: 67,
    level: 11.76,
    streakDays: 11.8,
    coursesInProgress: 3,
    quizzesCompleted: 8,
  };

  const renderStatCard = (title: string, value: string | number, icon: React.ReactNode, color: string) => (
    <div className="bg-dark-300/50 backdrop-blur-sm border border-white/5 rounded-xl p-4">
      <div className="flex items-center space-x-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-${color}/20`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-gray-400 text-sm">{title}</div>
          <div className="text-white text-lg font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-dark-300/30 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
      {/* Header with XP counter */}
      <div className="p-5 border-b border-white/5">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#28c7f9]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Total XP
            </h2>
            <div className="text-2xl font-bold text-[#28c7f9]">{stats.totalXP.toLocaleString()}</div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center bg-dark-200 rounded-lg overflow-hidden border border-white/10">
              <button className="px-3 py-1.5 text-sm bg-[#28c7f9] text-dark-300 font-medium">Day</button>
              <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white">Week</button>
              <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white">Month</button>
              <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white">All</button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bars section */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left column - overall progress */}
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#58c896]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                    <circle cx="17" cy="7" r="5" />
                  </svg>
                  Overall Progress
                </div>
                <div className="text-[#58c896] font-medium">{stats.percentComplete}%</div>
              </div>
              <div className="h-2 w-full bg-dark-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#58c896] to-[#28c7f9] rounded-full"
                  style={{ width: `${stats.percentComplete}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {renderStatCard(
                "Current Level", 
                stats.level.toString(), 
                <svg className="w-6 h-6 text-[#28c7f9]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>,
                "blue"
              )}
              
              {renderStatCard(
                "Day Streak", 
                stats.streakDays.toString(), 
                <svg className="w-6 h-6 text-[#ff5e7d]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>,
                "pink"
              )}
            </div>
          </div>
          
          {/* Right column - learning stats */}
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#8e5ff5]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                  </svg>
                  Learning Activity
                </div>
                <button className="text-sm text-[#8e5ff5]">View Details</button>
              </div>
              
              {/* Learning activity chart */}
              <div className="h-28 flex items-end justify-between gap-1">
                {[40, 65, 50, 80, 60, 75, 45].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-[#8e5ff5]/40 hover:bg-[#8e5ff5]/60 rounded-t-sm transition-all"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {renderStatCard(
                "Courses in Progress", 
                stats.coursesInProgress.toString(), 
                <svg className="w-6 h-6 text-[#58c896]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>,
                "green"
              )}
              
              {renderStatCard(
                "Quizzes Completed", 
                stats.quizzesCompleted.toString(), 
                <svg className="w-6 h-6 text-[#8e5ff5]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>,
                "purple"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}