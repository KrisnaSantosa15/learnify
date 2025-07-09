"use client";

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation variants for the content
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: custom * 0.1, 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

// Learning path skills for the 2D content
const learningPathSkills = [
  {
    category: "HTML",
    color: "#e44d26", // HTML orange color
    skills: [
      { name: "HTML Basics & Document Structure", completed: true, xp: 100 },
      { name: "HTML5 Semantic Elements", completed: true, xp: 150 },
      { name: "Forms & Input Validation", active: true, progress: 65, xp: 200 },
      { name: "Multimedia & Embedding", locked: false, progress: 25, xp: 150 },
      { name: "Accessibility Best Practices", locked: true, xp: 250 }
    ]
  },
  {
    category: "CSS",
    color: "#264de4", // CSS blue color
    skills: [
      { name: "CSS Selectors & Styling", completed: true, xp: 150 },
      { name: "Box Model & Layout", completed: true, xp: 150 },
      { name: "Flexbox & Grid", active: true, progress: 50, xp: 250 },
      { name: "Responsive Design", locked: false, progress: 10, xp: 200 },
      { name: "CSS Animations & Transitions", locked: true, xp: 300 }
    ]
  },
  {
    category: "JavaScript",
    color: "#f7df1e", // JavaScript yellow color
    skills: [
      { name: "JavaScript Fundamentals", completed: true, xp: 200 },
      { name: "DOM Manipulation", completed: true, xp: 250 },
      { name: "Events & Event Handling", active: true, progress: 40, xp: 200 },
      { name: "ES6+ Features", locked: false, xp: 300 },
      { name: "Asynchronous JavaScript", locked: true, xp: 350 }
    ]
  },
  {
    category: "Python",
    color: "#3776ab", // Python blue color
    skills: [
      { name: "Python Basics", locked: false, progress: 15, xp: 150 },
      { name: "Data Types & Structures", locked: true, xp: 200 },
      { name: "Control Flow & Functions", locked: true, xp: 250 },
      { name: "Object-Oriented Programming", locked: true, xp: 300 },
      { name: "Python Libraries & Modules", locked: true, xp: 350 }
    ]
  }
];

// Main Learning Path component with simplified view
export default function LearningPath() {
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

  return (
    <section 
      id="learning-path" 
      ref={sectionRef}
      className="py-24 relative bg-gradient-to-b from-[#0a0d1c] to-[#0f1629]"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute h-96 w-96 rounded-full bg-[#8e5ff5]/30 blur-3xl -top-20 -left-20"></div>
        <div className="absolute h-96 w-96 rounded-full bg-[#28c7f9]/20 blur-3xl bottom-20 right-20"></div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        {/* Section header */}
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          custom={0}
        >
          <div className="inline-block mb-3">
            <div className="h-1.5 w-20 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] mx-auto rounded-full mb-6"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-white">Your </span>
            <span className="text-[#28c7f9]">Learning Path</span>
            <span className="text-white"> to Mastery</span>
          </h2>
          <p className="text-lg text-[#a8b1c2]">
            Track your progress, unlock new skills, and see the roadmap to becoming an expert.
            Our structured learning paths guide you through each stage of your development journey.
          </p>
        </motion.div>
        
        {/* Simplified Skill View */}
        <motion.div 
          className="bg-[#151f38]/60 border border-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="p-8">
            <h3 className="text-xl font-bold text-white mb-6">Skill Tree Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
              {/* HTML Skills */}
              <div className="p-4 border border-[#e44d26]/20 rounded-lg">
                <h4 className="font-bold mb-2" style={{ color: "#e44d26" }}>HTML</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-[#58c896]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">Basic Structure</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-[#58c896]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">Semantic Tags</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: "rgba(228, 77, 38, 0.3)" }}></div>
                    <span className="text-white">Forms & Validation</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <svg className="w-4 h-4 mr-2 text-[#a8b1c2]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#a8b1c2]">Accessibility</span>
                  </li>
                </ul>
              </div>
              
              {/* CSS Skills */}
              <div className="p-4 border border-[#264de4]/20 rounded-lg">
                <h4 className="font-bold mb-2" style={{ color: "#264de4" }}>CSS</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-[#58c896]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">Selectors</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-[#58c896]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">Box Model</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: "rgba(38, 77, 228, 0.3)" }}></div>
                    <span className="text-white">Flexbox & Grid</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <svg className="w-4 h-4 mr-2 text-[#a8b1c2]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#a8b1c2]">Animations</span>
                  </li>
                </ul>
              </div>
              
              {/* JavaScript Skills */}
              <div className="p-4 border border-[#f7df1e]/20 rounded-lg">
                <h4 className="font-bold mb-2" style={{ color: "#f7df1e" }}>JavaScript</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-[#58c896]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">Fundamentals</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-[#58c896]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">DOM Manipulation</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: "rgba(247, 223, 30, 0.3)" }}></div>
                    <span className="text-white">Events</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <svg className="w-4 h-4 mr-2 text-[#a8b1c2]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#a8b1c2]">Async JS</span>
                  </li>
                </ul>
              </div>
              
              {/* Python Skills */}
              <div className="p-4 border border-[#3776ab]/20 rounded-lg">
                <h4 className="font-bold mb-2" style={{ color: "#3776ab" }}>Python</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: "rgba(55, 118, 171, 0.3)" }}></div>
                    <span className="text-white">Python Basics</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <svg className="w-4 h-4 mr-2 text-[#a8b1c2]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#a8b1c2]">Data Structures</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <svg className="w-4 h-4 mr-2 text-[#a8b1c2]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#a8b1c2]">OOP</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <svg className="w-4 h-4 mr-2 text-[#a8b1c2]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#a8b1c2]">Libraries</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Learning Path Table - Detailed View */}
        <motion.div 
          className="mb-16"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.h3 
            variants={fadeIn} 
            custom={1}
            className="text-2xl font-bold text-white mb-8 text-center"
          >
            Your Development Roadmap
          </motion.h3>
          
          <div className="space-y-8">
            {learningPathSkills.map((category, categoryIndex) => (
              <motion.div 
                key={`category-${categoryIndex}`}
                variants={fadeIn}
                custom={categoryIndex + 1}
              >
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-lg mr-3 flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                    <svg className="w-6 h-6" style={{ color: category.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {categoryIndex === 0 ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      ) : categoryIndex === 1 ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      )}
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-white">{category.category}</h4>
                </div>
                
                <div className="bg-[#151f38]/60 border border-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left bg-[#131d33]">
                          <th className="py-4 px-6 text-[#a8b1c2] font-medium">Skill</th>
                          <th className="py-4 px-6 text-[#a8b1c2] font-medium">Status</th>
                          <th className="py-4 px-6 text-[#a8b1c2] font-medium">XP Reward</th>
                          <th className="py-4 px-6 text-[#a8b1c2] font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.skills.map((skill, skillIndex) => (
                          <tr 
                            key={`skill-${categoryIndex}-${skillIndex}`}
                            className={`border-t border-white/5 ${
                              skill.locked ? 'opacity-50' : ''
                            }`}
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <div className="mr-3">
                                  {skill.locked ? (
                                    <div className="h-8 w-8 rounded-full bg-[#1c2841] flex items-center justify-center">
                                      <svg className="w-3.5 h-3.5 text-[#6a7a95]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  ) : skill.completed ? (
                                    <div className="h-8 w-8 rounded-full bg-[#58c896]/20 flex items-center justify-center">
                                      <svg className="w-4 h-4 text-[#58c896]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="h-8 w-8 rounded-full" style={{ backgroundColor: `${category.color}20` }}>
                                      <div className="h-full w-full rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4" style={{ color: category.color }} viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="text-white font-medium">{skill.name}</div>
                                  {skill.active && !skill.locked && (
                                    <div className="mt-1 w-full bg-[#1c2841] h-1.5 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full rounded-full" 
                                        style={{ 
                                          width: `${skill.progress}%`, 
                                          backgroundColor: category.color 
                                        }}
                                      ></div>
                                      <div className="text-xs text-[#6a7a95] mt-1">{skill.progress}% Complete</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {skill.locked ? (
                                <span className="px-2 py-1 rounded-full bg-[#1c2841] text-[#6a7a95] text-xs">Locked</span>
                              ) : skill.completed ? (
                                <span className="px-2 py-1 rounded-full bg-[#58c896]/20 text-[#58c896] text-xs">Completed</span>
                              ) : (
                                <span className="px-2 py-1 rounded-full bg-[#8e5ff5]/20 text-[#8e5ff5] text-xs">In Progress</span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-medium" style={{ color: category.color }}>{skill.xp} XP</span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              {skill.locked ? (
                                <button disabled className="px-3 py-1.5 bg-[#1c2841] text-[#6a7a95] rounded-lg text-sm opacity-50 cursor-not-allowed">
                                  Unlock Requirements
                                </button>
                              ) : skill.completed ? (
                                <Link 
                                  href={`/skills/${skill.name.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors"
                                >
                                  Review
                                </Link>
                              ) : (
                                <Link 
                                  href={`/skills/${skill.name.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="px-3 py-1.5 rounded-lg text-sm" 
                                  style={{ 
                                    backgroundColor: `${category.color}20`, 
                                    color: category.color 
                                  }}
                                >
                                  Continue
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Career Path */}
        <motion.div 
          className="bg-[#151f38]/60 border border-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 max-w-4xl mx-auto mb-12"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          custom={4}
        >
          <div className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Career Path Progress</h3>
            
            <div className="relative pb-12">
              {/* Progress line */}
              <div className="absolute top-0 bottom-0 left-20 w-0.5 bg-[#1c2841]"></div>
              
              {/* Current highlight line */}
              <div className="absolute top-0 left-20 w-0.5 bg-[#8e5ff5] h-[40%]"></div>
              
              {/* Mile markers */}
              <div className="space-y-16">
                <div className="relative">
                  <div className="flex items-center">
                    <div className="absolute left-20 -ml-3 h-6 w-6 rounded-full bg-[#8e5ff5] border-4 border-[#0f1629]"></div>
                    <div className="pl-24">
                      <h4 className="text-xl font-bold text-white flex items-center">
                        Front-End Beginner
                        <span className="ml-3 px-2.5 py-0.5 rounded-full bg-[#58c896]/20 text-[#58c896] text-sm font-medium">Completed</span>
                      </h4>
                      <p className="text-[#a8b1c2] mt-2">
                        Master the core foundations of web development with HTML, CSS, and basic JavaScript.
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="text-[#8e5ff5] text-sm font-medium mr-2">1,000 XP earned</span>
                        <span className="h-1 w-1 rounded-full bg-[#a8b1c2]"></span>
                        <span className="text-[#a8b1c2] text-sm ml-2">3 badges unlocked</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center">
                    <div className="absolute left-20 -ml-3 h-6 w-6 rounded-full bg-[#8e5ff5] border-4 border-[#0f1629]"></div>
                    <div className="pl-24">
                      <h4 className="text-xl font-bold text-white flex items-center">
                        Front-End Developer
                        <span className="ml-3 px-2.5 py-0.5 rounded-full bg-[#8e5ff5]/20 text-[#8e5ff5] text-sm font-medium">In Progress</span>
                      </h4>
                      <p className="text-[#a8b1c2] mt-2">
                        Develop interactive web applications with modern JavaScript frameworks and state management.
                      </p>
                      <div className="mt-4 w-full bg-[#1c2841] h-2 rounded-full">
                        <div className="h-full rounded-full bg-[#8e5ff5] w-[65%]"></div>
                      </div>
                      <div className="mt-2 flex items-center">
                        <span className="text-[#8e5ff5] text-sm font-medium mr-2">1,850 / 3,000 XP</span>
                        <span className="h-1 w-1 rounded-full bg-[#a8b1c2]"></span>
                        <span className="text-[#a8b1c2] text-sm ml-2">2/5 badges unlocked</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative opacity-50">
                  <div className="flex items-center">
                    <div className="absolute left-20 -ml-3 h-6 w-6 rounded-full bg-[#1c2841] border-4 border-[#0f1629]"></div>
                    <div className="pl-24">
                      <h4 className="text-xl font-bold text-white flex items-center">
                        Full-Stack Developer
                        <span className="ml-3 px-2.5 py-0.5 rounded-full bg-[#1c2841] text-[#6a7a95] text-sm font-medium">Locked</span>
                      </h4>
                      <p className="text-[#a8b1c2] mt-2">
                        Build complete web applications with back-end technologies, APIs, and databases.
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="text-[#6a7a95] text-sm font-medium">Requires Front-End Developer completion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div 
          className="text-center max-w-2xl mx-auto"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          custom={5}
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Continue Your Journey?</h3>
          <p className="text-[#a8b1c2] mb-8">
            Pick up where you left off or explore new skills to add to your developer toolkit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/signup" 
              className="px-5 py-3 bg-gradient-to-r from-[#28c7f9] to-[#1055b6] rounded-full text-white font-medium relative group overflow-hidden"
            >
              <span className="relative z-10">Continue Learning</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#1055b6] to-[#28c7f9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            
            <Link 
              href="/skills" 
              className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-white font-medium transition-colors"
            >
              Browse All Skills
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}