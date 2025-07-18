"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [glitchText, setGlitchText] = useState("404");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  // Fix hydration by only rendering dynamic content on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Glitch effect for 404 text
  useEffect(() => {
    if (!isClient) return;

    const glitchChars = ["4", "0", "4", "█", "▓", "▒", "░"];
    const interval = setInterval(() => {
      const randomText = Array.from(
        { length: 3 },
        () => glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join("");
      setGlitchText(randomText);

      setTimeout(() => setGlitchText("404"), 150);
    }, 2000);

    return () => clearInterval(interval);
  }, [isClient]);

  // Mouse tracking for parallax effect
  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isClient]);

  // Generate deterministic positions for floating elements to avoid hydration issues
  const getFloatingElement = (index: number) => {
    // Use index-based calculations for consistent positioning
    const left = (index * 47) % 100;
    const top = (index * 23) % 100;
    const animationType =
      index % 3 === 0 ? "slow" : index % 2 === 0 ? "fast" : "normal";
    const delay = (index * 0.5) % 5;

    return {
      left: `${left}%`,
      top: `${top}%`,
      animationType,
      delay: `${delay}s`,
    };
  };

  const floatingElements = isClient
    ? Array.from({ length: 8 }, (_, i) => {
        const element = getFloatingElement(i);
        return (
          <div
            key={i}
            className={`absolute w-4 h-4 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-full opacity-20 animate-float-${element.animationType}`}
            style={{
              left: element.left,
              top: element.top,
              animationDelay: element.delay,
              transform: `translate(${mousePosition.x * 0.02}px, ${
                mousePosition.y * 0.02
              }px)`,
            }}
          />
        );
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {isClient
              ? Array.from({ length: 144 }, (_, i) => (
                  <div
                    key={i}
                    className="border border-white/10 animate-pulse"
                    style={{ animationDelay: `${(i * 0.02) % 3}s` }}
                  />
                ))
              : // Static version for server rendering
                Array.from({ length: 144 }, (_, i) => (
                  <div key={i} className="border border-white/10" />
                ))}
          </div>
        </div>

        {/* Floating Elements */}
        {floatingElements}

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#28c7f9]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#8e5ff5]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-[#ff6b9d]/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Glitching 404 */}
          <div className="relative mb-12">
            <div className="text-[12rem] md:text-[16rem] font-black text-transparent bg-gradient-to-r from-[#28c7f9] via-[#8e5ff5] to-[#ff6b9d] bg-clip-text leading-none select-none glitch-text">
              {isClient ? glitchText : "404"}
            </div>

            {/* Glitch layers */}
            <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-red-500/30 leading-none select-none animate-glitch-1">
              404
            </div>
            <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-blue-500/30 leading-none select-none animate-glitch-2">
              404
            </div>

            {/* Static overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-scan"></div>
          </div>

          {/* Content Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-8 hover:bg-white/10 transition-all duration-500 group relative overflow-hidden">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#28c7f9]/10 to-[#8e5ff5]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              {/* Animated Icon */}
              <div className="text-8xl mb-8 animate-bounce">🌌</div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Lost in the
                <span className="block text-transparent bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] bg-clip-text">
                  Digital Void
                </span>
              </h1>

              <p className="text-gray-300 text-xl md:text-2xl mb-8 leading-relaxed max-w-2xl mx-auto">
                The page you&apos;re seeking has drifted beyond the known
                universe of our learning platform. But don&apos;t worry, every
                great explorer needs a moment to recalibrate their coordinates!
              </p>

              {/* Stats Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl mb-2">🚀</div>
                  <div className="text-2xl font-bold text-[#28c7f9] mb-1">
                    ∞
                  </div>
                  <div className="text-gray-400 text-sm">
                    Parallel Universes
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-2xl font-bold text-[#8e5ff5] mb-1">
                    0
                  </div>
                  <div className="text-gray-400 text-sm">Pages Found Here</div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-2xl font-bold text-[#ff6b9d] mb-1">
                    100%
                  </div>
                  <div className="text-gray-400 text-sm">Confusion Level</div>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/"
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] rounded-2xl text-white font-bold text-lg hover:scale-110 hover:shadow-2xl hover:shadow-[#28c7f9]/25 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center">
                    <span className="mr-3 text-2xl">🏠</span>
                    Return to Base
                    <span className="ml-3 group-hover:translate-x-2 transition-transform">
                      →
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Fun Fact */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
            <h3 className="text-white font-bold text-lg mb-3 flex items-center justify-center">
              <span className="mr-2 text-2xl">🧠</span>
              Did You Know?
            </h3>
            <p className="text-gray-300 leading-relaxed">
              The HTTP 404 status code was named after room 404 at CERN, where
              Tim Berners-Lee&apos;s office was located. When the World Wide Web
              was being developed, missing files would return a &quot;404: room
              not found&quot; error!
            </p>
          </div>
        </div>
      </div>

      {/* Scanning line effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#28c7f9] to-transparent animate-scan-line"></div>
    </div>
  );
}
