"use client";
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);
  const targetCount = 5000; // The final number to count to
  
  // Reference for animated canvas
  const canvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsVisible(true);
    
    // Animate the counter
    const duration = 2000; // ms
    const interval = 20; // ms
    const steps = duration / interval;
    const increment = targetCount / steps;
    
    let currentCount = 0;
    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetCount) {
        clearInterval(timer);
        setAnimatedCount(targetCount);
      } else {
        setAnimatedCount(Math.floor(currentCount));
      }
    }, interval);
    
    // Add parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const elements = canvasRef.current.querySelectorAll('.parallax-element');
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;
      
      elements.forEach((element, i) => {
        const htmlElement = element as HTMLElement;
        const speed = Number(htmlElement.dataset.speed || 1);
        const depth = i * 0.1 + 0.2;
        const moveX = deltaX * speed * 20;
        const moveY = deltaY * speed * 20;
        htmlElement.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + depth * 0.1})`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center pt-16 pb-24 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0c1625 0%, #0d1a18 100%)',
      }}
    >
      {/* Animated background */}
      <div ref={canvasRef} className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        {/* Glowing grid lines */}
        <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
        
        {/* Glowing dots and particles */}
        <div className="absolute inset-0">
          <div 
            className="absolute parallax-element w-6 h-6 rounded-full"
            data-speed="1.2"
            style={{
              top: '20%',
              left: '10%',
              background: 'radial-gradient(circle at center, #28c7f9 0%, transparent 70%)',
              boxShadow: '0 0 20px 8px rgba(40, 199, 249, 0.3)',
              opacity: 0.7,
            }}
          />
          <div 
            className="absolute parallax-element w-4 h-4 rounded-full"
            data-speed="2.1"
            style={{
              top: '30%',
              left: '25%',
              background: 'radial-gradient(circle at center, #58c896 0%, transparent 70%)',
              boxShadow: '0 0 20px 8px rgba(88, 200, 150, 0.3)',
              opacity: 0.6,
            }}
          />
          <div 
            className="absolute parallax-element w-8 h-8 rounded-full"
            data-speed="1.5"
            style={{
              top: '70%',
              left: '18%',
              background: 'radial-gradient(circle at center, #8e5ff5 0%, transparent 70%)',
              boxShadow: '0 0 20px 8px rgba(142, 95, 245, 0.3)',
              opacity: 0.6,
            }}
          />
          <div 
            className="absolute parallax-element w-5 h-5 rounded-full"
            data-speed="1.7"
            style={{
              top: '40%',
              right: '15%',
              background: 'radial-gradient(circle at center, #28c7f9 0%, transparent 70%)',
              boxShadow: '0 0 20px 8px rgba(40, 199, 249, 0.3)',
              opacity: 0.7,
            }}
          />
          <div 
            className="absolute parallax-element w-7 h-7 rounded-full"
            data-speed="1.3"
            style={{
              bottom: '25%',
              right: '25%',
              background: 'radial-gradient(circle at center, #ff5e7d 0%, transparent 70%)',
              boxShadow: '0 0 20px 8px rgba(255, 94, 125, 0.3)',
              opacity: 0.6,
            }}
          />
        </div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div 
            className="max-w-xl transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(3rem)',
            }}
          >
            {/* Logo */}
            <div className="mb-6 flex items-center">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#28c7f9] to-[#58c896] flex items-center justify-center mr-3 shadow-lg shadow-[#58c896]/20">
                <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">Learnify</span>
            </div>
            
            {/* Main headline with colored text */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Learn </span>
              <span className="text-[#58c896]">Programming</span>
              <span className="text-white"> the </span>
              <span className="text-[#28c7f9]">Modern Way</span>
            </h1>
            
            {/* Subheadline */}
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#58c896] to-[#28c7f9]">
                Gamified coding education that makes learning fun
              </span>
            </h2>
            
            {/* Descriptive paragraph */}
            <p className="text-[#a8b1c2] text-lg mb-8 leading-relaxed">
              Master programming skills through interactive challenges, earn achievements 
              as you progress, and join a community of learners in a dynamic, 
              engaging environment designed for both beginners and experienced coders.
            </p>
            
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl text-[#28c7f9] font-bold mb-1">{animatedCount.toLocaleString()}+</div>
                <div className="text-xs text-[#a8b1c2]">Learners</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl text-[#58c896] font-bold mb-1">150+</div>
                <div className="text-xs text-[#a8b1c2]">Challenges</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl text-[#8e5ff5] font-bold mb-1">12</div>
                <div className="text-xs text-[#a8b1c2]">Languages</div>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link 
                href="/signup" 
                className="px-8 py-3 bg-[#58c896] rounded-full text-white font-medium transition-all duration-300 relative overflow-hidden group flex items-center"
              >
                <span className="relative z-10">Start Learning</span>
                <svg className="w-5 h-5 ml-2 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#58c896] to-[#28c7f9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute inset-0 w-full h-full group-hover:shadow-[0_0_15px_rgba(88,200,150,0.5)] transition-all duration-300"></span>
              </Link>
              <Link 
                href="/tour" 
                className="px-8 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium transition-all hover:bg-white/10"
              >
                Take a Tour
              </Link>
            </div>
            
            {/* Feature mini-cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all hover:border-[#28c7f9]/50 hover:bg-[#28c7f9]/5">
                <div className="bg-[#0b1d48] p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#28c7f9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-white font-medium">Interactive Coding</h3>
                <p className="text-[#a8b1c2] text-sm">Hands-on practice with instant feedback</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all hover:border-[#58c896]/50 hover:bg-[#58c896]/5">
                <div className="bg-[#0b2d1a] p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#58c896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15V3m0 12l-4-4m4 4l4-4" />
                    <circle cx="12" cy="17" r="1" />
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-medium">Learning Paths</h3>
                <p className="text-[#a8b1c2] text-sm">Tailored curriculum for your goals</p>
              </div>
            </div>
          </div>
          
          {/* Right column - App Interface Preview */}
          <div 
            className="relative"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(3rem)',
              transitionDelay: '200ms',
              transition: 'all 1000ms',
            }}
          >
            {/* Main application window mockup */}
            <div className="relative mx-auto max-w-md">
              <div className="bg-[#151f38]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#28c7f9]/10">
                {/* App header with window controls */}
                <div className="bg-[#131d33] p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center bg-[#1c2841] rounded-md px-3 py-1.5">
                    <svg className="w-4 h-4 text-[#717d96] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#717d96] text-xs">learning-challenge.js</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full bg-[#1c2841] flex items-center justify-center">
                      <svg className="w-2 h-2 text-[#717d96]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* App content - Code editor */}
                <div className="grid grid-cols-6 gap-0 text-sm">
                  {/* Code editor sidebar - line numbers */}
                  <div className="col-span-1 bg-[#131d33] text-[#6a7a95] py-4 text-right pr-3">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                    <div>7</div>
                    <div>8</div>
                    <div>9</div>
                    <div>10</div>
                    <div>11</div>
                    <div>12</div>
                    <div>13</div>
                  </div>
                  
                  {/* Code editor content */}
                  <div className="col-span-5 bg-[#151f38] py-4 pl-2 pr-4 text-left font-mono text-sm overflow-hidden">
                    <div><span className="text-[#8e5ff5]">function</span> <span className="text-[#28c7f9]">calculateFactorial</span>(<span className="text-[#ff5e7d]">n</span>) {'{'}</div>
                    <div className="pl-4"><span className="text-[#8e5ff5]">if</span> (n <span className="text-[#58c896]">&lt;=</span> <span className="text-[#fab72b]">1</span>) {'{'}</div>
                    <div className="pl-8"><span className="text-[#8e5ff5]">return</span> <span className="text-[#fab72b]">1</span>;</div>
                    <div className="pl-4">{'}'}</div>
                    <div className="pl-4"><span className="text-[#8e5ff5]">return</span> n <span className="text-[#58c896]">*</span> <span className="text-[#28c7f9]">calculateFactorial</span>(n <span className="text-[#58c896]">-</span> <span className="text-[#fab72b]">1</span>);</div>
                    <div>{'}'}</div>
                    <div></div>
                    <div><span className="text-[#6a7a95]">// TODO: Implement the Fibonacci function</span></div>
                    <div><span className="text-[#8e5ff5]">function</span> <span className="text-[#28c7f9]">fibonacci</span>(<span className="text-[#ff5e7d]">n</span>) {'{'}</div>
                    <div className="pl-4 relative">
                      <div className="absolute -left-1 h-full w-1 bg-[#58c896]"></div>
                      <span className="text-[#8e5ff5]">if</span> (n <span className="text-[#58c896]">&lt;=</span> <span className="text-[#fab72b]">1</span>) {'{'}</div>
                    <div className="pl-8 relative">
                      <div className="absolute -left-1 h-full w-1 bg-[#58c896]"></div>
                      <span className="text-[#8e5ff5]">return</span> n;</div>
                    <div className="pl-4 relative">
                      <div className="absolute -left-1 h-full w-1 bg-[#58c896]"></div>
                      {'}'}</div>
                  </div>
                </div>
                
                {/* Terminal output */}
                <div className="bg-[#131d33] p-4">
                  <div className="bg-[#0c1625] p-3 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[#6a7a95] text-xs">Terminal</div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs bg-[#0b2d1a] text-[#58c896] px-2 py-0.5 rounded-md">PASS</div>
                        <div className="text-xs bg-[#1c2841] text-[#28c7f9] px-2 py-0.5 rounded-md">Run</div>
                      </div>
                    </div>
                    <div className="text-[#a8b1c2] text-xs">
                      <div>$ node factorial.test.js</div>
                      <div className="text-[#58c896]">✓ calculateFactorial(5) returned 120</div>
                      <div className="text-[#58c896]">✓ calculateFactorial(0) returned 1</div>
                      <div className="text-[#ff5e7d]">✗ fibonacci test not implemented</div>
                      <div className="text-white mt-1">2 passing, 1 failing</div>
                    </div>
                  </div>
                </div>
                
                {/* Learning progress */}
                <div className="bg-[#151f38] p-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-[#a8b1c2]">JavaScript Recursion Challenge</span>
                    <span className="text-[#28c7f9]">1/2 Complete</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1c2841] rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-[#58c896] to-[#28c7f9]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating badges and elements */}
            <div className="absolute -bottom-4 -left-12 bg-[#131d33] p-3 rounded-lg border border-white/10 shadow-xl shadow-[#58c896]/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-[#0b2d1a] h-7 w-7 flex items-center justify-center rounded-lg">
                  <svg className="w-4 h-4 text-[#58c896]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white text-sm font-medium">+42 XP</p>
              </div>
              <p className="text-[#6a7a95] text-xs">Recursion Level</p>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-[#131d33] p-3 rounded-lg border border-white/10 shadow-xl shadow-[#8e5ff5]/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-[#1d0b3d] h-7 w-7 flex items-center justify-center rounded-lg">
                  <svg className="w-4 h-4 text-[#8e5ff5]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-white text-sm font-medium">Level 5</p>
              </div>
              <p className="text-[#6a7a95] text-xs">JavaScript</p>
            </div>
            
            <div className="absolute top-1/3 right-0 transform translate-x-1/2 bg-[#1d0b3d] p-1 rounded-full h-16 w-16 flex items-center justify-center border-4 border-[#131d33]">
              <div className="text-[#8e5ff5] font-bold">JS</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}