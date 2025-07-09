"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'pink' | 'green' | 'yellow';
  delay: number;
  className?: string;
}

function FeatureCard({ title, description, icon, color, delay, className = '' }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  const colorMap = {
    blue: {
      bg: '#0b1d48',
      text: '#28c7f9',
      border: 'border-[#28c7f9]/30',
      hover: 'hover:border-[#28c7f9]/50 hover:bg-[#28c7f9]/5'
    },
    purple: {
      bg: '#1d0b3d',
      text: '#8e5ff5',
      border: 'border-[#8e5ff5]/30',
      hover: 'hover:border-[#8e5ff5]/50 hover:bg-[#8e5ff5]/5'
    },
    pink: {
      bg: '#2d0b1e',
      text: '#ff5e7d',
      border: 'border-[#ff5e7d]/30',
      hover: 'hover:border-[#ff5e7d]/50 hover:bg-[#ff5e7d]/5'
    },
    green: {
      bg: '#0b2d1a',
      text: '#58c896',
      border: 'border-[#58c896]/30',
      hover: 'hover:border-[#58c896]/50 hover:bg-[#58c896]/5'
    },
    yellow: {
      bg: '#2d2207',
      text: '#fab72b',
      border: 'border-[#fab72b]/30',
      hover: 'hover:border-[#fab72b]/50 hover:bg-[#fab72b]/5'
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-500 ${colorMap[color].hover} ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: colorMap[color].bg }}
      >
        <div className="text-2xl" style={{ color: colorMap[color].text }}>
          {icon}
        </div>
      </div>
      <h3 className="text-white text-xl font-semibold mb-3">{title}</h3>
      <p className="text-[#a8b1c2]">{description}</p>
    </div>
  );
}

export default function Features() {
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
      id="features" 
      className="py-24 relative"
      style={{
        background: 'linear-gradient(135deg, #0c1625 0%, #101418 100%)',
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
        {/* Animated particles */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-4 h-4 rounded-full"
            style={{
              top: '15%',
              left: '8%',
              background: 'radial-gradient(circle at center, #58c896 0%, transparent 70%)',
              boxShadow: '0 0 15px 5px rgba(88, 200, 150, 0.2)',
              opacity: 0.6,
              animation: 'float 8s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-6 h-6 rounded-full"
            style={{
              top: '60%',
              left: '20%',
              background: 'radial-gradient(circle at center, #8e5ff5 0%, transparent 70%)',
              boxShadow: '0 0 15px 5px rgba(142, 95, 245, 0.2)',
              opacity: 0.5,
              animation: 'float 12s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-5 h-5 rounded-full"
            style={{
              top: '25%',
              right: '10%',
              background: 'radial-gradient(circle at center, #28c7f9 0%, transparent 70%)',
              boxShadow: '0 0 15px 5px rgba(40, 199, 249, 0.2)',
              opacity: 0.6,
              animation: 'float 10s ease-in-out infinite'
            }}
          />
          <style jsx global>{`
            @keyframes float {
              0% { transform: translateY(0px) translateX(0px); }
              50% { transform: translateY(15px) translateX(10px); }
              100% { transform: translateY(0px) translateX(0px); }
            }
          `}</style>
        </div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-10 relative z-10" ref={sectionRef}>
        {/* Section header */}
        <div 
          className="max-w-2xl mx-auto text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
            transition: 'all 1000ms',
          }}
        >
          <div className="inline-block mb-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#28c7f9] to-[#58c896] font-medium">
              POWERFUL LEARNING TOOLS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Programming Features Built </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#28c7f9] to-[#58c896]">For Modern Developers</span>
          </h2>
          <p className="text-lg text-[#a8b1c2] mb-8">
            Our platform offers interactive tools and challenges that transform how you learn to code,
            with real-time feedback and engaging experiences designed for today's developers.
          </p>
          
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <div className="text-xl sm:text-2xl text-[#28c7f9] font-bold mb-1">150+</div>
              <div className="text-xs text-[#a8b1c2]">Challenges</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <div className="text-xl sm:text-2xl text-[#58c896] font-bold mb-1">12</div>
              <div className="text-xs text-[#a8b1c2]">Languages</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <div className="text-xl sm:text-2xl text-[#8e5ff5] font-bold mb-1">98%</div>
              <div className="text-xs text-[#a8b1c2]">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Featured card */}
        <div 
          className="mb-16 rounded-2xl overflow-hidden border border-white/10 bg-[#151f38]/70 backdrop-blur-lg shadow-xl shadow-[#28c7f9]/10"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
            transition: 'all 1000ms 200ms',
          }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 lg:p-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#28c7f9]/10 border border-[#28c7f9]/20 text-[#28c7f9] text-xs font-medium mb-6">
                <span className="mr-2">●</span>
                <span>FEATURED</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Interactive Code Editor</h3>
              <p className="text-lg text-[#a8b1c2] mb-6">
                Write, run, and debug code directly in your browser with real-time feedback. 
                Our intelligent code editor provides hints, error checking, and auto-completion 
                to accelerate your learning.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Syntax highlighting for all popular languages',
                  'AI-powered code suggestions and hints',
                  'Real-time compilation and execution',
                  'Integrated debugging tools'
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-[#a8b1c2] group">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#28c7f9]/20 text-[#28c7f9] mr-3 group-hover:bg-[#28c7f9]/40 transition-colors">
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/editor" className="px-6 py-3 bg-[#28c7f9] rounded-full text-white font-medium transition-all duration-300 flex items-center w-fit relative overflow-hidden group">
                <span className="relative z-10">Try The Editor</span>
                <svg className="w-5 h-5 ml-2 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#28c7f9] to-[#58c896] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute inset-0 w-full h-full group-hover:shadow-[0_0_15px_rgba(40,199,249,0.5)] transition-all duration-300"></span>
              </Link>
            </div>
            <div className="relative p-6 flex items-center justify-center bg-[#131d33]">
              {/* Code editor mockup */}
              <div className="w-full">
                <div className="bg-[#0d1525] rounded-t-lg p-3 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                  </div>
                  <div className="mx-auto text-xs text-[#8b949e]">learning-challenge.js</div>
                </div>
                <div className="bg-[#0d1525] p-4 font-mono text-sm text-left overflow-hidden rounded-b-lg">
                  <div className="flex">
                    <div className="text-[#636e7b] select-none mr-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                        <div key={num}>{num}</div>
                      ))}
                    </div>
                    <div className="flex-1 text-[#e6edf3]">
                      <div><span className="text-[#ff7b72]">function</span> <span className="text-[#d2a8ff]">solveChallenge</span>(userInput) {'{'}</div>
                      <div>  <span className="text-[#ff7b72]">const</span> parsed = <span className="text-[#79c0ff]">JSON</span>.<span className="text-[#d2a8ff]">parse</span>(userInput);</div>
                      <div>  <span className="text-[#ff7b72]">const</span> result = [];</div>
                      <div></div>
                      <div className="relative">
                        <div className="absolute left-0 right-0 h-6 bg-[#28c7f9]/10 border-l-2 border-[#28c7f9]"></div>
                        <span className="text-[#ff7b72] relative">  for</span><span className="relative"> (</span><span className="text-[#ff7b72] relative">const</span><span className="relative"> item </span><span className="text-[#ff7b72] relative">of</span><span className="relative"> parsed) {'{'}</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-0 right-0 h-6 bg-[#28c7f9]/10 border-l-2 border-[#28c7f9]"></div>
                        <span className="relative">    </span><span className="text-[#ff7b72] relative">if</span><span className="relative"> (item.score > </span><span className="text-[#79c0ff] relative">80</span><span className="relative">) {'{'}</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-0 right-0 h-6 bg-[#28c7f9]/10 border-l-2 border-[#28c7f9]"></div>
                        <span className="relative">      result.</span><span className="text-[#d2a8ff] relative">push</span><span className="relative">(item);</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-0 right-0 h-6 bg-[#28c7f9]/10 border-l-2 border-[#28c7f9]"></div>
                        <span className="relative">    {'}'}</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-0 right-0 h-6 bg-[#28c7f9]/10 border-l-2 border-[#28c7f9]"></div>
                        <span className="relative">  {'}'}</span>
                      </div>
                      <div></div>
                      <div>  <span className="text-[#ff7b72]">return</span> result;</div>
                      <div>{'}'}</div>
                    </div>
                  </div>
                </div>
                {/* Terminal area */}
                <div className="bg-[#0d1525] mt-2 p-3 rounded-lg border-t border-[#30363d]">
                  <div className="text-[#8b949e] text-xs mb-1">Console output</div>
                  <div className="text-[#e6edf3] text-xs font-mono">
                    <div><span className="text-[#58c896]">✓</span> Tests passed: <span className="text-[#58c896]">5/7</span></div>
                    <div className="text-[#ff5e7d]">⚠ Challenge not yet complete</div>
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-[#131d33]/90 backdrop-blur-sm p-3 rounded-lg border border-[#28c7f9]/30 shadow-lg shadow-[#28c7f9]/10 transform rotate-3">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="h-5 w-5 text-[#28c7f9]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414 7.293 11H12z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium">Real-time feedback</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* HTML */}
          <FeatureCard
            title="HTML"
            description="Master the foundation of web development with semantic HTML5 elements, forms, and accessibility best practices."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                <path d="M5.5 8.5l4 4 2-2L16 15" />
              </svg>
            }
            color="blue"
            delay={200}
            className=""
          />

          {/* CSS */}
          <FeatureCard
            title="CSS"
            description="Create beautiful, responsive layouts with modern CSS techniques including Flexbox, Grid, and animations."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 7 4 4 20 4 20 7" />
                <line x1="9" y1="20" x2="15" y2="20" />
                <line x1="12" y1="4" x2="12" y2="20" />
                <path d="M8 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4" />
              </svg>
            }
            color="purple"
            delay={300}
            className=""
          />

          {/* JavaScript */}
          <FeatureCard
            title="JavaScript"
            description="Build interactive web applications with core JavaScript, DOM manipulation, events, and modern ES6+ features."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M9 9v10" />
                <path d="M9 14c0-1 .6-2 2.5-2C13.5 12 15 13 15 14" />
                <path d="M15 16.5c0 1-1.5 2-2.5 2s-2.5-1-2.5-2" />
              </svg>
            }
            color="yellow"
            delay={400}
            className=""
          />

          {/* Python */}
          <FeatureCard
            title="Python"
            description="Learn Python programming from basics to advanced concepts like OOP, data structures, and working with libraries."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 18s4-4 4-8c0-2.4-1.8-4-4-4s-4 1.6-4 4c0 4 4 8 4 8"></path>
                <path d="M7 6h.01M17 6h.01"></path>
              </svg>
            }
            color="green"
            delay={500}
            className=""
          />
        </div>

        {/* Additional feature cards grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Interactive Learning */}
          <FeatureCard
            title="Interactive Code Challenges"
            description="Real-world programming challenges that test your skills and reinforce your knowledge with immediate feedback."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            color="pink"
            delay={600}
            className=""
          />

          {/* Achievement System */}
          <FeatureCard
            title="Achievement System"
            description="Earn badges and unlock achievements as you master programming concepts and complete coding milestones."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
            color="yellow"
            delay={700}
            className=""
          />

          {/* Developer Skill Tree */}
          <FeatureCard
            title="Developer Skill Tree"
            description="Visualize your learning path and chart your progression from novice to expert with personalized skill trees."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            }
            color="blue"
            delay={800}
            className=""
          />
        </div>

        {/* CTA */}
        <div 
          className="text-center mt-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
            transition: 'all 1000ms 900ms',
          }}
        >
          <Link 
            href="/features" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#28c7f9]/20 to-[#58c896]/20 backdrop-blur-md border border-white/10 rounded-full text-white font-medium transition-all hover:from-[#28c7f9]/30 hover:to-[#58c896]/30 hover:shadow-lg hover:shadow-[#58c896]/10"
          >
            Explore All Learning Features
            <svg className="w-5 h-5 ml-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}