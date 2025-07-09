"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  xpReward: number;
}

// Sample quiz data
const quizQuestions: Question[] = [
  {
    id: 1,
    text: "Which of the following is a valid way to declare a variable in Python?",
    options: [
      "var name = 'John'",
      "let name = 'John'",
      "name = 'John'",
      "const name = 'John'"
    ],
    correctAnswer: 2,
    explanation: "In Python, variables are declared by simply assigning a value to a name, without keywords like var, let, or const that are used in languages like JavaScript.",
    xpReward: 25
  },
  {
    id: 2,
    text: "What does the following Python code return? [1, 2, 3] + [4, 5, 6]",
    options: [
      "[1, 2, 3, 4, 5, 6]",
      "[5, 7, 9]",
      "Error",
      "None of the above"
    ],
    correctAnswer: 0,
    explanation: "In Python, the + operator when used with lists performs concatenation, joining the two lists together.",
    xpReward: 35
  },
  {
    id: 3,
    text: "Which data structure in Python uses key-value pairs?",
    options: [
      "List",
      "Tuple",
      "Set",
      "Dictionary"
    ],
    correctAnswer: 3,
    explanation: "Dictionaries in Python store data as key-value pairs, allowing you to access values by their keys instead of indices.",
    xpReward: 30
  }
];

export default function InteractiveDemo() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

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

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent changing answer after submission
    setSelectedOption(optionIndex);
    
    const question = quizQuestions[currentQuestion];
    const correct = optionIndex === question.correctAnswer;
    setIsCorrect(correct);
    
    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQuizQuestion = quizQuestions[currentQuestion];

  return (
    <section 
      id="interactive-demo" 
      className="py-20 relative"
      ref={sectionRef}
      style={{
        background: 'linear-gradient(135deg, #120b34 0%, #0c0c29 100%)',
      }}
    >
      {/* Animated background */}
      <div ref={canvasRef} className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        {/* Glowing grid lines */}
        <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        
        {/* Glowing dots */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-4 h-4 rounded-full"
            style={{
              top: '15%',
              right: '20%',
              background: 'radial-gradient(circle at center, #ff5e7d 0%, transparent 70%)',
              boxShadow: '0 0 15px 5px rgba(255, 94, 125, 0.3)',
              opacity: 0.6,
            }}
          />
          <div 
            className="absolute w-6 h-6 rounded-full"
            style={{
              bottom: '25%',
              left: '15%',
              background: 'radial-gradient(circle at center, #58c896 0%, transparent 70%)',
              boxShadow: '0 0 15px 5px rgba(88, 200, 150, 0.3)',
              opacity: 0.5,
            }}
          />
        </div>
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
            <div className="h-8 w-8 rounded-lg bg-[#1c2841] flex items-center justify-center mr-2">
              <svg className="h-4 w-4 text-[#ff5e7d]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 19l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <span className="text-gray-300 text-sm font-medium">INTERACTIVE LEARNING</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Learn by </span>
            <span className="text-[#ff5e7d]">doing</span>
            <span className="text-white"> with </span>
            <span className="text-[#fab72b]">challenges</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#a8b1c2] text-lg">
            Experience our engaging quiz system with immediate feedback and rewards. 
            Practice real programming concepts in an interactive environment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Left sidebar with stats */}

          {/* Main quiz container */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div 
              className="bg-[#151f38] rounded-2xl border border-white/10 shadow-2xl shadow-blue-500/10 overflow-hidden"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(3rem)',
                transition: 'all 1000ms',
                transitionDelay: '100ms',
              }}
            >
              {/* Quiz header with progress */}
              <div className="bg-[#131d33] p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#282f45] flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Python Basics Quiz</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#a8b1c2]">Question</span>
                  <span className="bg-[#28c7f9] text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                    {currentQuestion + 1}
                  </span>
                  <span className="text-[#a8b1c2]">of</span>
                  <span className="bg-[#1c2841] text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                    {quizQuestions.length}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-[#1c2841] w-full">
                <div 
                  className="h-full bg-gradient-to-r from-[#28c7f9] to-[#58c896] transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Quiz content */}
              <div className="p-6">
                {/* Question */}
                <h3 className="text-xl font-medium text-white mb-6">{currentQuizQuestion.text}</h3>
                
                <div className="space-y-4 mb-6">
                  {currentQuizQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 flex justify-between items-center ${
                        selectedOption === index 
                          ? isCorrect 
                            ? 'bg-[#58c896]/20 border border-[#58c896]'
                            : 'bg-[#ff5e7d]/20 border border-[#ff5e7d]'
                          : 'bg-[#1c2841] hover:bg-[#222f52] border border-transparent'
                      }`}
                      onClick={() => handleOptionSelect(index)}
                      disabled={selectedOption !== null}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center border ${
                          selectedOption === index 
                            ? isCorrect 
                              ? 'border-[#58c896]' 
                              : 'border-[#ff5e7d]'
                            : 'border-white/30'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-white">{option}</span>
                      </div>
                      
                      {selectedOption === index && (
                        isCorrect ? (
                          <svg className="h-6 w-6 text-[#58c896]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6 text-[#ff5e7d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )
                      )}
                    </button>
                  ))}
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <div 
                    className={`p-4 mb-6 rounded-xl ${
                      isCorrect 
                        ? 'bg-[#58c896]/10 border border-[#58c896]/30'
                        : 'bg-[#ff5e7d]/10 border border-[#ff5e7d]/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <div className="bg-[#58c896]/20 p-1 rounded-full mt-1">
                          <svg className="h-4 w-4 text-[#58c896]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="bg-[#ff5e7d]/20 p-1 rounded-full mt-1">
                          <svg className="h-4 w-4 text-[#ff5e7d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      
                      <div>
                        <p className={`font-medium mb-1 ${isCorrect ? 'text-[#58c896]' : 'text-[#ff5e7d]'}`}>
                          {isCorrect ? 'Correct answer!' : 'Incorrect answer'}
                        </p>
                        <p className="text-[#a8b1c2]">{currentQuizQuestion.explanation}</p>
                        
                        {isCorrect && (
                          <div className="mt-2 flex items-center">
                            <svg className="h-4 w-4 text-[#fab72b] mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[#fab72b] font-medium">+{currentQuizQuestion.xpReward} XP earned!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between">
                  {showExplanation ? (
                    <>
                      {currentQuestion < quizQuestions.length - 1 ? (
                        <button 
                          className="px-6 py-3 bg-gradient-to-r from-[#28c7f9] to-[#58c896] rounded-full text-white font-medium transition-transform hover:scale-105 flex items-center"
                          onClick={handleNextQuestion}
                        >
                          <span>Next Question</span>
                          <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ) : (
                        <div className="flex gap-4">
                          <button 
                            className="px-6 py-3 border border-white/30 rounded-full text-white font-medium transition-all hover:bg-white/10"
                            onClick={handleRestart}
                          >
                            Restart Quiz
                          </button>
                          <Link 
                            href="/courses" 
                            className="px-6 py-3 bg-gradient-to-r from-[#28c7f9] to-[#58c896] rounded-full text-white font-medium transition-transform hover:scale-105 flex items-center"
                          >
                            Explore More Quizzes
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white/50 font-medium cursor-not-allowed">
                      Select an answer
                    </button>
                  )}
                  
                  <button 
                    className="flex items-center text-[#a8b1c2] hover:text-white transition-colors"
                    onClick={() => alert('Need a hint? Try reading the question carefully and think about how Python handles data types.')}
                  >
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Get Hint</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar with code preview */}
          <div className="lg:col-span-1 order-3">
            <div 
              className="flex flex-col gap-4"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(3rem)',
                transition: 'all 1000ms',
                transitionDelay: '300ms',
              }}
            >

              {/* Resources card */}
              <div className="bg-[#131d33] p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-medium mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/courses/python/basics" className="flex items-center text-[#28c7f9] hover:underline">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c-1.255 0-2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      Python Variables Tutorial
                    </Link>
                  </li>
                  <li>
                    <Link href="/courses/python/data-structures" className="flex items-center text-[#28c7f9] hover:underline">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c-1.255 0-2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      Python Data Structures
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className="mt-16 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(3rem)',
            transition: 'all 1000ms',
            transitionDelay: '400ms',
          }}
        >
          <p className="text-[#a8b1c2] mb-6 max-w-2xl mx-auto">
            Ready to unlock your full learning potential? Join Learnify to access hundreds of interactive coding challenges,
            track your progress, and compete with friends.
          </p>
          <Link 
              href="/signup" 
              className="inline-block px-8 py-3 bg-[#ff4b8b] rounded-full text-white font-medium transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Start Coding Now</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#ff4b8b] to-[#f5204a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute inset-0 w-full h-full group-hover:shadow-[0_0_15px_rgba(142,95,245,0.5)] transition-all duration-300"></span>
            </Link>
        </div>
      </div>
    </section>
  );
}