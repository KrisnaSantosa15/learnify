"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: 'Home', href: '#hero' },
  { name: 'Features', href: '#features' },
  { name: 'Learning Path', href: '#learning-path' },
  { name: 'Gamification', href: '#gamification' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Pricing', href: '#pricing' },
];

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Handle scroll event to change nav appearance and track active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Find active section based on scroll position
      const sections = navLinks.map(link => link.href.substring(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      style={{ zIndex: 50 }}
      className={`fixed top-0 left-0 w-full transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-[rgba(10,10,10,0.8)] backdrop-blur-md' 
          : 'py-5'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-[#28c7f9]">
                Lernify
              </span>
              <span className="text-white">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`transition-all duration-300 relative ${
                  activeSection === link.href.substring(1)
                    ? 'text-[#28c7f9] font-medium' 
                    : 'text-white hover:text-[#28c7f9]'
                }`}
              >
                {link.name}
                {activeSection === link.href.substring(1) && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#28c7f9] to-transparent"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-[#28c7f9] border border-[#28c7f9]/30 px-4 py-1.5 rounded-full hover:bg-[#28c7f9]/10 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Log In</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#28c7f9]/10 to-[#28c7f9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link 
              href="/signup" 
              className="text-white bg-[#28c7f9] border border-[#28c7f9]/50 px-5 py-1.5 rounded-full transition-all duration-300 hover:bg-[#28c7f9]/90 hover:shadow-[0_0_15px_rgba(40,199,249,0.4)] relative overflow-hidden group"
            >
              <span className="relative z-10">Sign Up Free</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#28c7f9] to-[#58c896] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white hover:text-[#28c7f9] transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 animate-fadeIn">
            <div className="bg-[rgba(10,10,10,0.95)] backdrop-blur-lg rounded-xl p-6 shadow-lg border border-[#28c7f9]/10">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`transition-all duration-300 ${
                      activeSection === link.href.substring(1)
                        ? 'text-[#28c7f9] font-medium pl-3 border-l-2 border-[#28c7f9]'
                        : 'text-white hover:text-[#28c7f9] hover:pl-2'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t border-[#28c7f9]/10 flex flex-col space-y-4">
                  <Link 
                    href="/login" 
                    className="text-[#28c7f9] border border-[#28c7f9]/30 px-4 py-2 rounded-full hover:bg-[#28c7f9]/10 transition-all duration-300 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="text-white bg-[#28c7f9] border border-[#28c7f9]/50 px-5 py-2 rounded-full transition-all duration-300 hover:bg-[#28c7f9]/90 hover:shadow-[0_0_15px_rgba(40,199,249,0.4)] text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up Free
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Gradient bottom border when scrolled */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#28c7f9]/30 to-transparent"></div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  );
}