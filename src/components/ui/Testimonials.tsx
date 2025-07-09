"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  company?: string;
  image: string;
  rating: 1 | 2 | 3 | 4 | 5;
  color: 'blue' | 'purple' | 'pink' | 'green';
}

const testimonials: TestimonialProps[] = [
  {
    quote: "Learnify completely changed how I approach learning programming. The gamification elements kept me motivated, and I've achieved certifications I never thought possible.",
    name: "Sarah Johnson",
    role: "Software Developer",
    company: "TechInnovate",
    image: "/testimonials/avatar1.png", // You'll need to add these images or use placeholders
    rating: 5,
    color: "blue"
  },
  {
    quote: "As someone who always struggled with traditional learning methods, Learnify's interactive approach made learning coding actually enjoyable. The achievement system is addictive!",
    name: "Alex Rodriguez",
    role: "UX Designer",
    company: "DesignHub",
    image: "/testimonials/avatar2.png",
    rating: 5,
    color: "purple"
  },
  {
    quote: "The skill trees and learning paths gave me a clear roadmap to advance my career. In just 6 months, I went from junior to senior developer with the skills I gained.",
    name: "Jamie Chen",
    role: "Frontend Engineer",
    company: "WebFlux",
    image: "/testimonials/avatar3.png",
    rating: 5,
    color: "pink"
  },
  {
    quote: "I've tried many learning platforms, but Learnify's competitive elements and progress tracking kept me consistently engaged. The community is also incredibly supportive.",
    name: "Taylor Williams",
    role: "Data Scientist",
    company: "AnalyticsMind",
    image: "/testimonials/avatar4.png",
    rating: 4,
    color: "green"
  }
];

function TestimonialCard({ quote, name, role, company, image, rating, color }: TestimonialProps) {
  // Map color names to hex values
  const colorMap = {
    blue: "#28c7f9",
    purple: "#8e5ff5",
    pink: "#ff5e7d",
    green: "#58c896"
  };
  const colorHex = colorMap[color];
  
  return (
    <div className="bg-[#151f38] rounded-xl border border-white/10 p-6 relative h-full flex flex-col">
      {/* Glowing accent */}
      <div className="absolute -top-3 -left-3 w-12 h-12 rounded-lg" style={{
        background: `radial-gradient(circle at center, ${colorHex}40, transparent)`,
        boxShadow: `0 0 15px 5px ${colorHex}30`,
      }}></div>

      {/* Quote icon */}
      <div className="relative z-10 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" style={{ color: colorHex }}>
          <path fill="currentColor" d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
        </svg>
      </div>

      {/* Quote */}
      <div className="text-[#a8b1c2] mb-6 flex-1 text-lg leading-relaxed">{quote}</div>

      {/* Rating */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className="w-5 h-5 mr-1"
            style={{ color: i < rating ? colorHex : '#2a3a5a' }}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* User info */}
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center" style={{ borderColor: colorHex }}>
          <Image 
            src={image} 
            alt={`${name}'s avatar`} 
            width={48} 
            height={48} 
            className="w-full h-full object-cover"
            style={{ borderRadius: '50%' }}
          />
          {/* <div className="w-full h-full bg-[#131d33] flex items-center justify-center text-xl font-medium" style={{ color: colorHex }}>
            {name.charAt(0)}
          </div> */}
        </div>
        <div className="ml-3">
          <div className="font-bold text-white">{name}</div>
          <div className="text-sm text-[#6a7a95]">
            {role}{company ? `, ${company}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const numTestimonials = testimonials.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % numTestimonials);
    }, 5000);

    return () => clearInterval(interval);
  }, [numTestimonials]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section 
      id="testimonials" 
      className="py-20 relative" 
      ref={sectionRef}
      style={{
        background: 'linear-gradient(135deg, #0b1d48 0%, #131b36 100%)',
      }}
    >
      {/* Animated background */}
      <div ref={canvasRef} className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        {/* Glowing grid lines */}
        <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        
        {/* Glowing circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20" 
          style={{ 
            background: 'radial-gradient(circle at center, #8e5ff5 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        ></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20" 
          style={{ 
            background: 'radial-gradient(circle at center, #28c7f9 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div 
          className="text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(3rem)',
            transition: 'all 1000ms',
          }}
        >
          <div className="inline-flex items-center justify-center mb-3">
            <div className="h-8 w-8 rounded-lg bg-[#282f45] flex items-center justify-center mr-2">
              <svg className="h-4 w-4 text-[#8e5ff5]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
              </svg>
            </div>
            <span className="text-gray-300 text-sm font-medium">TESTIMONIALS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">What our </span>
            <span className="text-[#8e5ff5]">learners </span>
            <span className="text-white">say about us</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#a8b1c2] text-lg">
            Thousands of developers have transformed their learning journey with our 
            platform. Here&apos;s what they&apos;re saying about Learnify.
          </p>
        </div>

        {/* Desktop Testimonials Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(3rem)',
                transition: 'all 1000ms',
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>

        {/* Mobile Testimonial Carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="min-w-full px-4"
                >
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center mt-6 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    currentIndex === index 
                      ? 'bg-[#8e5ff5]' 
                      : 'bg-[#2a3a5a]'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial Stats */}
        <div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(3rem)',
            transition: 'all 1000ms',
            transitionDelay: '600ms',
          }}
        >
          <div className="bg-[#151f38] rounded-xl border border-white/10 p-6 text-center relative overflow-hidden group hover:border-[#28c7f9]/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-[#28c7f9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-10 w-10 bg-[#28c7f9]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="h-5 w-5 text-[#28c7f9]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#28c7f9] mb-1">98%</div>
            <div className="text-sm text-[#a8b1c2]">Satisfaction Rate</div>
          </div>
          
          <div className="bg-[#151f38] rounded-xl border border-white/10 p-6 text-center relative overflow-hidden group hover:border-[#8e5ff5]/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-[#8e5ff5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-10 w-10 bg-[#8e5ff5]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="h-5 w-5 text-[#8e5ff5]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#8e5ff5] mb-1">12K+</div>
            <div className="text-sm text-[#a8b1c2]">Active Learners</div>
          </div>
          
          <div className="bg-[#151f38] rounded-xl border border-white/10 p-6 text-center relative overflow-hidden group hover:border-[#ff5e7d]/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-[#ff5e7d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-10 w-10 bg-[#ff5e7d]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="h-5 w-5 text-[#ff5e7d]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#ff5e7d] mb-1">4.9</div>
            <div className="text-sm text-[#a8b1c2]">Average Rating</div>
          </div>
          
          <div className="bg-[#151f38] rounded-xl border border-white/10 p-6 text-center relative overflow-hidden group hover:border-[#58c896]/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-[#58c896]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-10 w-10 bg-[#58c896]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="h-5 w-5 text-[#58c896]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#58c896] mb-1">89%</div>
            <div className="text-sm text-[#a8b1c2]">Career Advancement</div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div 
          className="mt-16 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(3rem)',
            transition: 'all 1000ms',
            transitionDelay: '800ms',
          }}
        >
          <p className="text-[#a8b1c2] mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied learners and start your programming journey today.
            Get access to our full learning platform and community.
          </p>
          <a 
            href="/signup" 
            className="px-8 py-4 bg-[#8e5ff5] rounded-full text-white font-medium text-lg transition-all duration-300 inline-flex items-center relative overflow-hidden group"
          >
            <span className="relative z-10">Start Your Learning Journey</span>
            <svg className="w-5 h-5 ml-2 relative z-10" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#8e5ff5] to-[#5930e5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute inset-0 w-full h-full group-hover:shadow-[0_0_15px_rgba(142,95,245,0.5)] transition-all duration-300"></span>
          </a>
        </div>
      </div>
    </section>
  );
}