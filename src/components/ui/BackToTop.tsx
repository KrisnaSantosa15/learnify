"use client";
import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [showButton, setShowButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll position and calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 500; // Show button after scrolling 500px
      
      // Show/hide button based on scroll position
      setShowButton(scrollY > threshold);
      
      // Calculate scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / totalHeight;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top with smooth behavior
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Only render button when it should be shown
  if (!showButton) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed cursor-pointer bottom-6 right-6 z-50 bg-[#151f38]/80 backdrop-blur-lg border border-white/10 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Back to top"
    >
      {/* Progress ring */}
      <svg className="w-10 h-10" viewBox="0 0 44 44">
        {/* Background circle */}
        <circle 
          cx="22" 
          cy="22" 
          r="20" 
          fill="none" 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeWidth="2"
        />
        {/* Progress circle */}
        <circle 
          cx="22" 
          cy="22" 
          r="20" 
          fill="none" 
          stroke="#58c896" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${Math.PI * 40}`}
          strokeDashoffset={`${Math.PI * 40 * (1 - scrollProgress)}`}
          transform="rotate(-90 22 22)"
          className="transition-all duration-200"
        />
        {/* Arrow icon */}
        <g className="text-white group-hover:text-[#58c896] transition-colors duration-300">
          <path 
            d="M22 16L16 22M22 16L28 22M22 16V30" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </button>
  );
}