import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addQuizData() {
  console.log("🧠 Adding quiz data...");

  try {
    // Check if categories exist, if not create them
    let categories = await prisma.category.findMany();

    if (categories.length === 0) {
      console.log("Creating categories...");
      categories = await Promise.all([
        prisma.category.create({
          data: {
            name: "JavaScript",
            description: "JavaScript programming fundamentals",
            icon: "🟨",
            color: "#F7DF1E",
          },
        }),
        prisma.category.create({
          data: {
            name: "React",
            description: "React library and concepts",
            icon: "⚛️",
            color: "#61DAFB",
          },
        }),
        prisma.category.create({
          data: {
            name: "General Programming",
            description: "General programming concepts",
            icon: "💻",
            color: "#8E5FF5",
          },
        }),
      ]);
      console.log("✅ Created categories:", categories.length);
    }

    // Get JavaScript category
    const jsCategory =
      categories.find((c) => c.name === "JavaScript") || categories[0];

    // Check if quizzes exist
    const existingQuizzes = await prisma.quiz.findMany();

    if (existingQuizzes.length === 0) {
      console.log("Creating sample quizzes...");

      // Create JavaScript Basics Quiz
      const jsQuiz = await prisma.quiz.create({
        data: {
          title: "JavaScript Fundamentals",
          description:
            "Test your knowledge of JavaScript basics including variables, functions, and data types.",
          difficulty: "BEGINNER",
          categoryId: jsCategory.id,
          timeLimit: 15,
          xpReward: 100,
          isPublished: true,
          randomizeQuestions: false,
          showProgress: true,
          allowRetakes: true,
          showExplanations: true,
          instantFeedback: false,
          questions: {
            create: [
              {
                question:
                  "What is the output of console.log(typeof null) in JavaScript?",
                options: ["null", "undefined", "object", "boolean"],
                correctAnswer: 2,
                explanation:
                  "This is a known quirk in JavaScript. typeof null returns 'object' due to legacy reasons.",
                order: 1,
                points: 10,
              },
              {
                question:
                  "Which of the following is NOT a primitive data type in JavaScript?",
                options: ["string", "number", "array", "boolean"],
                correctAnswer: 2,
                explanation:
                  "Array is an object type, not a primitive. The primitive types are string, number, boolean, null, undefined, symbol, and bigint.",
                order: 2,
                points: 10,
              },
              {
                question:
                  "What does the 'use strict' directive do in JavaScript?",
                options: [
                  "Makes code run faster",
                  "Enables strict mode which catches common errors",
                  "Compresses the code",
                  "Enables ES6 features",
                ],
                correctAnswer: 1,
                explanation:
                  "'use strict' enables strict mode, which helps catch common coding errors and prevents certain unsafe actions.",
                order: 3,
                points: 10,
              },
              {
                question:
                  "Which method is used to add an element to the end of an array in JavaScript?",
                options: ["append()", "push()", "add()", "insert()"],
                correctAnswer: 1,
                explanation:
                  "The push() method adds one or more elements to the end of an array and returns the new length.",
                order: 4,
                points: 10,
              },
              {
                question:
                  "What is the difference between '==' and '===' in JavaScript?",
                options: [
                  "No difference",
                  "'==' checks type and value, '===' checks only value",
                  "'==' checks only value, '===' checks type and value",
                  "Both are deprecated",
                ],
                correctAnswer: 2,
                explanation:
                  "'==' performs type coercion and compares values, while '===' compares both type and value without coercion.",
                order: 5,
                points: 15,
              },
            ],
          },
        },
      });

      // Create React Quiz
      const reactCategory =
        categories.find((c) => c.name === "React") || categories[0];
      const reactQuiz = await prisma.quiz.create({
        data: {
          title: "React Basics",
          description:
            "Learn the fundamentals of React including components, props, and state.",
          difficulty: "INTERMEDIATE",
          categoryId: reactCategory.id,
          timeLimit: 20,
          xpReward: 150,
          isPublished: true,
          randomizeQuestions: false,
          showProgress: true,
          allowRetakes: true,
          showExplanations: true,
          instantFeedback: true,
          questions: {
            create: [
              {
                question: "What is JSX in React?",
                options: [
                  "A JavaScript framework",
                  "A syntax extension for JavaScript",
                  "A CSS preprocessor",
                  "A testing library",
                ],
                correctAnswer: 1,
                explanation:
                  "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.",
                order: 1,
                points: 15,
              },
              {
                question:
                  "Which hook is used to manage state in functional components?",
                options: ["useEffect", "useState", "useContext", "useReducer"],
                correctAnswer: 1,
                explanation:
                  "useState is the hook used to add state to functional components in React.",
                order: 2,
                points: 15,
              },
              {
                question: "What is the purpose of the key prop in React lists?",
                options: [
                  "To style list items",
                  "To help React identify which items have changed",
                  "To set the order of items",
                  "To make items clickable",
                ],
                correctAnswer: 1,
                explanation:
                  "The key prop helps React identify which items have changed, are added, or are removed, enabling efficient re-rendering.",
                order: 3,
                points: 20,
              },
            ],
          },
        },
      });

      // Create Programming Concepts Quiz
      const generalCategory =
        categories.find((c) => c.name === "General Programming") ||
        categories[0];
      const conceptsQuiz = await prisma.quiz.create({
        data: {
          title: "Programming Concepts",
          description:
            "Test your understanding of general programming concepts and best practices.",
          difficulty: "ADVANCED",
          categoryId: generalCategory.id,
          timeLimit: 25,
          xpReward: 200,
          isPublished: true,
          randomizeQuestions: true,
          showProgress: true,
          allowRetakes: false,
          showExplanations: true,
          instantFeedback: false,
          questions: {
            create: [
              {
                question: "What is the time complexity of binary search?",
                options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                correctAnswer: 1,
                explanation:
                  "Binary search has O(log n) time complexity because it eliminates half of the search space in each iteration.",
                order: 1,
                points: 25,
              },
              {
                question:
                  "Which design pattern ensures a class has only one instance?",
                options: ["Factory", "Observer", "Singleton", "Strategy"],
                correctAnswer: 2,
                explanation:
                  "The Singleton pattern ensures that a class has only one instance and provides a global point of access to it.",
                order: 2,
                points: 25,
              },
              {
                question: "What does MVC stand for in software architecture?",
                options: [
                  "Model View Controller",
                  "Multiple View Component",
                  "Main Visual Container",
                  "Managed Version Control",
                ],
                correctAnswer: 0,
                explanation:
                  "MVC stands for Model-View-Controller, a software architectural pattern that separates an application into three interconnected components.",
                order: 3,
                points: 20,
              },
            ],
          },
        },
      });

      console.log("✅ Created quizzes:", [
        jsQuiz.id,
        reactQuiz.id,
        conceptsQuiz.id,
      ]);
    } else {
      console.log("✅ Quizzes already exist:", existingQuizzes.length);
    }

    console.log("🎉 Quiz data setup complete!");
  } catch (error) {
    console.error("❌ Error adding quiz data:", error);
    throw error;
  }
}

addQuizData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
