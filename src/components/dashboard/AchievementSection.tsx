"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  completedAt?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'course' | 'activity' | 'social' | 'special';
  isNew?: boolean;
}

export default function AchievementSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showUnlocked, setShowUnlocked] = useState<boolean>(true);
  const [showLocked, setShowLocked] = useState<boolean>(true);
  
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "Quick Learner",
      description: "Complete your first course in record time",
      icon: "🚀",
      progress: 100,
      maxProgress: 100,
      completedAt: "2025-04-02",
      rarity: 'uncommon',
      category: 'course',
      isNew: true
    },
    {
      id: 2,
      title: "Code Streak",
      description: "Complete coding exercises for 7 consecutive days",
      icon: "🔥",
      progress: 7,
      maxProgress: 7,
      completedAt: "2025-04-03",
      rarity: 'rare',
      category: 'activity'
    },
    {
      id: 3,
      title: "Knowledge Explorer",
      description: "Access content from 5 different subject areas",
      icon: "🧭",
      progress: 3,
      maxProgress: 5,
      rarity: 'common',
      category: 'course'
    },
    {
      id: 4,
      title: "Weekend Warrior",
      description: "Study for more than 4 hours during a weekend",
      icon: "⚔️",
      progress: 4.5,
      maxProgress: 4,
      completedAt: "2025-03-23",
      rarity: 'uncommon',
      category: 'activity'
    },
    {
      id: 5,
      title: "Collaboration King",
      description: "Help 10 other students solve problems",
      icon: "👑",
      progress: 4,
      maxProgress: 10,
      rarity: 'epic',
      category: 'social'
    },
    {
      id: 6,
      title: "Quiz Master",
      description: "Get 100% on 3 consecutive quizzes",
      icon: "🧠",
      progress: 2,
      maxProgress: 3,
      rarity: 'rare',
      category: 'activity'
    },
    {
      id: 7,
      title: "Early Adopter",
      description: "Join Learnify during beta phase",
      icon: "🔍",
      progress: 1,
      maxProgress: 1,
      completedAt: "2025-01-15",
      rarity: 'legendary',
      category: 'special'
    }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const isCompleted = achievement.progress >= achievement.maxProgress;
    if (!showUnlocked && isCompleted) return false;
    if (!showLocked && !isCompleted) return false;
    if (selectedFilter !== 'all' && achievement.category !== selectedFilter) return false;
    return true;
  });

  const getRarityStyle = (rarity: string) => {
    switch(rarity) {
      case 'common':
        return {
          bgGradient: 'from-gray-200 to-gray-400',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-400',
          glowColor: 'shadow-gray-300/20'
        };
      case 'uncommon':
        return {
          bgGradient: 'from-green-300 to-green-500',
          textColor: 'text-green-600',
          borderColor: 'border-green-500',
          glowColor: 'shadow-green-400/30'
        };
      case 'rare':
        return {
          bgGradient: 'from-blue-300 to-blue-600',
          textColor: 'text-blue-500',
          borderColor: 'border-blue-500',
          glowColor: 'shadow-blue-400/40'
        };
      case 'epic':
        return {
          bgGradient: 'from-purple-300 to-purple-600',
          textColor: 'text-purple-500',
          borderColor: 'border-purple-500',
          glowColor: 'shadow-purple-400/40'
        };
      case 'legendary':
        return {
          bgGradient: 'from-orange-300 to-orange-500',
          textColor: 'text-orange-500',
          borderColor: 'border-orange-500',
          glowColor: 'shadow-orange-400/50'
        };
      default:
        return {
          bgGradient: 'from-gray-200 to-gray-400',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-400',
          glowColor: 'shadow-gray-300/20'
        };
    }
  };

  const getProgressColor = (progress: number, max: number) => {
    const percentage = (progress / max) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Calculate achievement stats
  const totalAchievements = achievements.length;
  const completedAchievements = achievements.filter(a => a.progress >= a.maxProgress).length;
  const completionRate = Math.round((completedAchievements / totalAchievements) * 100);
  
  return (
    <div className="bg-dark-300/30 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-white/5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-[#8e5ff5]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
            Achievements
          </h2>
          <div className="flex items-center">
            <div className="text-xs text-gray-400 mr-3">
              <span className="text-white font-medium">{completedAchievements}</span>/{totalAchievements} Unlocked
            </div>
            <button className="text-sm text-[#8e5ff5]">View All</button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-sm text-gray-400">Overall completion</p>
            <p className="text-sm font-medium text-white">{completionRate}%</p>
          </div>
          <div className="h-2 w-full bg-dark-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-[#8e5ff5]"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedFilter === 'all' 
                ? 'bg-[#8e5ff5]/20 text-[#8e5ff5]' 
                : 'bg-dark-200 text-gray-400 hover:bg-dark-100'}`}
            >
              All
            </button>
            <button 
              onClick={() => setSelectedFilter('course')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedFilter === 'course' 
                ? 'bg-[#8e5ff5]/20 text-[#8e5ff5]' 
                : 'bg-dark-200 text-gray-400 hover:bg-dark-100'}`}
            >
              Course
            </button>
            <button 
              onClick={() => setSelectedFilter('activity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedFilter === 'activity' 
                ? 'bg-[#8e5ff5]/20 text-[#8e5ff5]' 
                : 'bg-dark-200 text-gray-400 hover:bg-dark-100'}`}
            >
              Activity
            </button>
            <button 
              onClick={() => setSelectedFilter('social')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedFilter === 'social' 
                ? 'bg-[#8e5ff5]/20 text-[#8e5ff5]' 
                : 'bg-dark-200 text-gray-400 hover:bg-dark-100'}`}
            >
              Social
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUnlocked(!showUnlocked)} 
              className={`p-1.5 rounded-lg ${showUnlocked ? 'bg-[#8e5ff5]/20 text-[#8e5ff5]' : 'bg-dark-200 text-gray-400'}`}
              title={showUnlocked ? "Hide Unlocked" : "Show Unlocked"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </button>
            <button
              onClick={() => setShowLocked(!showLocked)}
              className={`p-1.5 rounded-lg ${showLocked ? 'bg-[#8e5ff5]/20 text-[#8e5ff5]' : 'bg-dark-200 text-gray-400'}`}
              title={showLocked ? "Hide Locked" : "Show Locked"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement) => {
            const isCompleted = achievement.progress >= achievement.maxProgress;
            const rarityStyle = getRarityStyle(achievement.rarity);
            const progressColor = getProgressColor(achievement.progress, achievement.maxProgress);
            const progressPercentage = Math.min(100, (achievement.progress / achievement.maxProgress) * 100);
            
            return (
              <div 
                key={achievement.id} 
                className={`relative group rounded-xl p-4 transition-all duration-300 border ${
                  isCompleted 
                    ? `${rarityStyle.borderColor} bg-gradient-to-b ${rarityStyle.bgGradient}/5 hover:${rarityStyle.bgGradient}/10` 
                    : 'border-white/5 bg-dark-200/50 hover:bg-dark-200'
                } ${
                  isCompleted ? `shadow-lg ${rarityStyle.glowColor}` : ''
                } overflow-hidden`}
              >
                {achievement.isNew && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                    NEW
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <div className={`relative h-12 w-12 rounded-xl flex items-center justify-center text-2xl
                    ${isCompleted 
                      ? `bg-gradient-to-br ${rarityStyle.bgGradient}` 
                      : 'bg-dark-300 text-gray-500'
                    }`}
                  >
                    {achievement.icon}
                    {isCompleted && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                        <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className={`font-bold ${
                        isCompleted ? rarityStyle.textColor : 'text-white'
                      }`}>
                        {achievement.title}
                      </h3>
                      <span className="text-xs px-1.5 py-0.5 rounded uppercase font-medium bg-dark-300/50 text-gray-400">
                        {achievement.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {achievement.description}
                    </p>
                    
                    <div className="mt-2">
                      {!isCompleted ? (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-400">
                              Progress: {achievement.progress} / {achievement.maxProgress}
                            </span>
                            <span className="text-xs font-medium text-white">
                              {Math.round(progressPercentage)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-dark-300 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${progressColor} transition-all duration-500`}
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {achievement.completedAt ? `Completed: ${new Date(achievement.completedAt).toLocaleDateString()}` : 'Completed'}
                          </span>
                          <button className="text-xs bg-dark-300/50 hover:bg-dark-300 px-2 py-1 rounded text-white">
                            Share
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Hover effects for completed achievements */}
                {isCompleted && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                      <p className="text-white text-xs">Click to view details</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {filteredAchievements.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-white font-medium mb-1">No achievements found</h3>
            <p className="text-gray-400 text-sm">Try changing your filters</p>
          </div>
        )}
      </div>
      
      {/* Next Milestone Section */}
      <div className="p-4 border-t border-white/5 bg-dark-200/30">
        <div className="flex items-center">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-white">Next milestone</h4>
            <p className="text-xs text-gray-400">Complete 10 achievements to level up</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#8e5ff5]/20 flex items-center justify-center">
            <span className="text-[#8e5ff5] font-medium text-sm">{completedAchievements}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}