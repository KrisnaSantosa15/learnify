"use client";

import React, { useState } from "react";

export default function ProgrammingQuiz() {
  const [activeLanguage, setActiveLanguage] = useState("javascript");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");

  const quizzes = {
    html: {
      question: "Which HTML tag is used to create a hyperlink?",
      code: `<!-- Select the correct tag to create a link to https://example.com -->
<??? href="https://example.com">Visit Example</???>`,
      answers: ["<link>", "<a>", "<href>", "<url>"],
      correctAnswer: 1,
      explanation:
        "The <a> (anchor) tag is used to create hyperlinks in HTML. The href attribute specifies the URL the link goes to.",
    },
    css: {
      question: "How do you select an element with the class 'header' in CSS?",
      code: `/* Select an element with the class 'header' */
??? {
  color: blue;
  font-size: 24px;
}`,
      answers: ["#header", ".header", "*header", "header"],
      correctAnswer: 1,
      explanation:
        "In CSS, a class selector starts with a dot (.), so '.header' is the correct way to select elements with the class 'header'.",
    },
    javascript: {
      question:
        "Which method adds an element to the end of an array in JavaScript?",
      code: `const fruits = ['apple', 'banana', 'orange'];
// Add 'grape' to the end of the array
fruits.???('grape');
console.log(fruits); // Output: ['apple', 'banana', 'orange', 'grape']`,
      answers: ["push()", "append()", "add()", "insert()"],
      correctAnswer: 0,
      explanation:
        "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
    },
    python: {
      question: "How do you create a function in Python?",
      code: `# Define a function that adds two numbers
??? add_numbers(a, b):
    return a + b
    
result = add_numbers(5, 3)
print(result)  # Output: 8`,
      answers: ["function", "def", "func", "define"],
      correctAnswer: 1,
      explanation:
        "In Python, you define a function using the 'def' keyword followed by the function name and parameters.",
    },
  };

  const currentQuiz = quizzes[activeLanguage as keyof typeof quizzes];

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === currentQuiz.correctAnswer) {
      setFeedback("Correct! Great job!");
    } else {
      setFeedback(`Incorrect. ${currentQuiz.explanation}`);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback("");
  };

  const handleLanguageChange = (language: string) => {
    setActiveLanguage(language);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback("");
  };

  return (
    <div className="bg-dark-300/50 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white">Interactive Quiz</h2>
          <div className="text-sm bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full">
            Daily Challenge
          </div>
        </div>

        {/* Language tabs */}
        <div className="flex space-x-1 mb-5 bg-dark-200/80 rounded-lg p-1">
          {Object.keys(quizzes).map((lang) => (
            <button
              key={lang}
              className={`flex-1 py-2 px-3 text-sm rounded-md ${
                activeLanguage === lang
                  ? "bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
              onClick={() => handleLanguageChange(lang)}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>

        {/* Quiz question */}
        <div className="mb-5">
          <h3 className="text-white font-medium mb-2">
            {currentQuiz.question}
          </h3>
          <div className="bg-gray-900 rounded-md p-4 font-mono text-sm text-gray-300 mb-4 overflow-x-auto">
            <pre>{currentQuiz.code}</pre>
          </div>
        </div>

        {/* Quiz answers */}
        <div className="space-y-3 mb-5">
          {currentQuiz.answers.map((answer, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg cursor-pointer border transition-all ${
                selectedAnswer === index
                  ? selectedAnswer === currentQuiz.correctAnswer
                    ? "bg-green-500/20 border-green-500/50 text-green-200"
                    : "bg-red-500/20 border-red-500/50 text-red-200"
                  : "bg-dark-200/80 border-gray-700 text-gray-200 hover:border-gray-500"
              }`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="flex items-center">
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs ${
                    selectedAnswer === index
                      ? selectedAnswer === currentQuiz.correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{answer}</span>

                {isAnswered && index === currentQuiz.correctAnswer && (
                  <svg
                    className="w-5 h-5 text-green-400 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}

                {isAnswered &&
                  selectedAnswer === index &&
                  selectedAnswer !== currentQuiz.correctAnswer && (
                    <svg
                      className="w-5 h-5 text-red-400 ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback section */}
        {isAnswered && (
          <div
            className={`p-4 mb-5 rounded-lg ${
              selectedAnswer === currentQuiz.correctAnswer
                ? "bg-green-500/20 border border-green-500/30"
                : "bg-orange-500/20 border border-orange-500/30"
            }`}
          >
            <p className="text-white text-sm">{feedback}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <div className="text-sm text-gray-400">
            <span className="text-indigo-400 font-medium">Pro tip:</span>{" "}
            Practice daily to build your skills
          </div>

          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
