import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import seedAchievements from "../src/lib/seedAchievements";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample users with hashed passwords
  const hashedPassword = await bcrypt.hash("password123", 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "demo@learnifycode.com",
        username: "demo_user",
        name: "Demo User",
        password: hashedPassword,
        level: 5,
        xp: 1250,
        streak: 7,
        plan: "PRO",
      },
    }),
    prisma.user.create({
      data: {
        email: "beginner@learnifycode.com",
        username: "code_newbie",
        name: "Code Newbie",
        password: hashedPassword,
        level: 1,
        xp: 150,
        streak: 3,
        plan: "FREE",
      },
    }),
  ]);

  console.log("✅ Created users:", users.length);

  // Create default categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Programming Languages",
        description: "Learn various programming languages",
        icon: "💻",
        color: "#3B82F6",
      },
    }),
    prisma.category.create({
      data: {
        name: "Web Development",
        description: "Frontend and backend web development",
        icon: "🌐",
        color: "#10B981",
      },
    }),
    prisma.category.create({
      data: {
        name: "Data Structures",
        description: "Algorithms and data structures",
        icon: "📊",
        color: "#8B5CF6",
      },
    }),
    prisma.category.create({
      data: {
        name: "Database",
        description: "Database design and SQL",
        icon: "🗄️",
        color: "#F59E0B",
      },
    }),
    prisma.category.create({
      data: {
        name: "DevOps",
        description: "Development operations and deployment",
        icon: "⚙️",
        color: "#EF4444",
      },
    }),
    prisma.category.create({
      data: {
        name: "Mobile Development",
        description: "iOS and Android app development",
        icon: "📱",
        color: "#06B6D4",
      },
    }),
  ]);

  console.log("✅ Created categories:", categories.length);

  // Create sample courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: "JavaScript Fundamentals",
        description: "Learn the basics of JavaScript programming",
        difficulty: "BEGINNER",
        technology: "JavaScript",
        isPublished: true,
        order: 1,
      },
    }),
    prisma.course.create({
      data: {
        title: "React Development",
        description: "Build modern web applications with React",
        difficulty: "INTERMEDIATE",
        technology: "React",
        isPublished: true,
        order: 2,
      },
    }),
  ]);

  console.log("✅ Created courses:", courses.length);

  // Create sample challenges
  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        title: "FizzBuzz Challenge",
        description:
          'Write a program that prints numbers 1 to 100, but replace multiples of 3 with "Fizz" and multiples of 5 with "Buzz"',
        difficulty: "BEGINNER",
        technology: "JavaScript",
        type: "ALGORITHM",
        prompt: "Create a function that solves the classic FizzBuzz problem.",
        starterCode: `function fizzBuzz(n) {
  // Your code here
}`,
        solution: `function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}`,
        testCases: {
          tests: [
            { input: [15], expected: "FizzBuzz for 15" },
            { input: [3], expected: "Fizz for 3" },
            { input: [5], expected: "Buzz for 5" },
          ],
        },
        hints: [
          "Use the modulo operator (%) to check divisibility",
          "Check for multiples of 15 first, then 3, then 5",
          "Use console.log to output the results",
        ],
        xpReward: 100,
        timeLimit: 30,
        isPublished: true,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Array Sum",
        description: "Calculate the sum of all numbers in an array",
        difficulty: "BEGINNER",
        technology: "JavaScript",
        type: "ALGORITHM",
        prompt:
          "Write a function that takes an array of numbers and returns their sum.",
        starterCode: `function arraySum(numbers) {
  // Your code here
}`,
        solution: `function arraySum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}`,
        testCases: {
          tests: [
            { input: [[1, 2, 3, 4, 5]], expected: 15 },
            { input: [[-1, -2, -3]], expected: -6 },
            { input: [[]], expected: 0 },
          ],
        },
        hints: [
          "You can use a for loop to iterate through the array",
          "Consider using the reduce() method",
          "Don't forget to handle empty arrays",
        ],
        xpReward: 75,
        timeLimit: 15,
        isPublished: true,
      },
    }),
  ]);

  console.log("✅ Created challenges:", challenges.length);

  // Create sample achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        title: "First Steps",
        description: "Complete your first coding challenge",
        icon: "🚀",
        rarity: "COMMON",
        category: "Beginner",
        criteria: { type: "challenges_completed", count: 1 },
        xpReward: 50,
      },
    }),
    prisma.achievement.create({
      data: {
        title: "Code Warrior",
        description: "Complete 10 coding challenges",
        icon: "⚔️",
        rarity: "UNCOMMON",
        category: "Progress",
        criteria: { type: "challenges_completed", count: 10 },
        xpReward: 200,
      },
    }),
    prisma.achievement.create({
      data: {
        title: "Speed Demon",
        description: "Complete a challenge in under 5 minutes",
        icon: "⚡",
        rarity: "RARE",
        category: "Speed",
        criteria: { type: "fast_completion", time: 300 },
        xpReward: 150,
      },
    }),
  ]);

  console.log("✅ Created achievements:", achievements.length);

  // Get category references for quizzes
  const programmingCategory = categories.find(
    (c) => c.name === "Programming Languages"
  );
  const webDevCategory = categories.find((c) => c.name === "Web Development");
  const dataStructuresCategory = categories.find(
    (c) => c.name === "Data Structures"
  );

  // Create sample quizzes with better categorization
  await prisma.quiz.create({
    data: {
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics and core concepts",
      difficulty: "BEGINNER",
      categoryId: programmingCategory!.id,
      timeLimit: 15,
      xpReward: 120,
      isPublished: true,
      questions: {
        create: [
          {
            question: "Which method adds an element to the end of an array?",
            options: ["push()", "pop()", "shift()", "unshift()"],
            correctAnswer: 0,
            explanation:
              "The push() method adds one or more elements to the end of an array and returns the new length.",
            order: 1,
            points: 15,
          },
          {
            question: 'What does "const" declare in JavaScript?',
            options: [
              "A variable that can be reassigned",
              "A constant that cannot be reassigned",
              "A function",
              "A class",
            ],
            correctAnswer: 1,
            explanation:
              "The const keyword declares a constant variable that cannot be reassigned after initialization.",
            order: 2,
            points: 15,
          },
          {
            question:
              "What is the output of console.log(typeof null) in JavaScript?",
            options: ["null", "undefined", "object", "boolean"],
            correctAnswer: 2,
            explanation:
              "In JavaScript, typeof null returns 'object'. This is a well-known quirk/bug that's kept for backward compatibility.",
            order: 3,
            points: 20,
          },
          {
            question: "Which of these is NOT a JavaScript data type?",
            options: ["string", "boolean", "float", "undefined"],
            correctAnswer: 2,
            explanation:
              "JavaScript doesn't have a 'float' data type. Numbers in JavaScript are all of type 'number'.",
            order: 4,
            points: 15,
          },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      title: "JavaScript Advanced Concepts",
      description:
        "Advanced JavaScript topics including closures, promises, and async/await",
      difficulty: "ADVANCED",
      categoryId: programmingCategory!.id,
      timeLimit: 25,
      xpReward: 200,
      isPublished: true,
      questions: {
        create: [
          {
            question: "What is a closure in JavaScript?",
            options: [
              "A way to close a function",
              "A function with access to variables in its outer scope",
              "A method to stop execution",
              "A type of loop",
            ],
            correctAnswer: 1,
            explanation:
              "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.",
            order: 1,
            points: 25,
          },
          {
            question: "What does async/await do?",
            options: [
              "Creates synchronous code",
              "Makes code run faster",
              "Provides a cleaner way to handle promises",
              "Prevents errors",
            ],
            correctAnswer: 2,
            explanation:
              "async/await provides a more readable and cleaner syntax for handling asynchronous operations with promises.",
            order: 2,
            points: 25,
          },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      title: "CSS Layout Fundamentals",
      description:
        "Test your understanding of CSS layout techniques and properties",
      difficulty: "INTERMEDIATE",
      categoryId: webDevCategory!.id,
      timeLimit: 12,
      xpReward: 100,
      isPublished: true,
      questions: {
        create: [
          {
            question: "Which CSS property is used to change the text color?",
            options: ["color", "text-color", "font-color", "text-style"],
            correctAnswer: 0,
            explanation:
              "The 'color' property is used to set the color of text content in CSS.",
            order: 1,
            points: 10,
          },
          {
            question: "What does 'display: flex' create?",
            options: [
              "A block element",
              "A flex container",
              "An inline element",
              "A grid container",
            ],
            correctAnswer: 1,
            explanation:
              "display: flex creates a flex container, enabling flexbox layout for its children.",
            order: 2,
            points: 15,
          },
          {
            question: "Which property controls the space between flex items?",
            options: ["margin", "padding", "gap", "spacing"],
            correctAnswer: 2,
            explanation:
              "The 'gap' property controls the space between flex items in a flex container.",
            order: 3,
            points: 15,
          },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      title: "React Hooks Deep Dive",
      description: "Master React hooks and their use cases",
      difficulty: "INTERMEDIATE",
      categoryId: webDevCategory!.id,
      timeLimit: 20,
      xpReward: 150,
      isPublished: true,
      questions: {
        create: [
          {
            question: "Which hook is used for managing component state?",
            options: ["useEffect", "useState", "useContext", "useMemo"],
            correctAnswer: 1,
            explanation:
              "useState is the primary hook for managing local component state in functional components.",
            order: 1,
            points: 15,
          },
          {
            question: "When does useEffect run by default?",
            options: [
              "Only on mount",
              "Only on unmount",
              "After every render",
              "Only when state changes",
            ],
            correctAnswer: 2,
            explanation:
              "By default, useEffect runs after every completed render, including the first render.",
            order: 2,
            points: 20,
          },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      title: "Python Data Structures",
      description:
        "Explore Python's built-in data structures and their methods",
      difficulty: "BEGINNER",
      categoryId: programmingCategory!.id,
      timeLimit: 18,
      xpReward: 110,
      isPublished: true,
      questions: {
        create: [
          {
            question: "Which data structure is ordered and mutable in Python?",
            options: ["tuple", "list", "set", "dictionary"],
            correctAnswer: 1,
            explanation:
              "Lists in Python are ordered collections that are mutable (can be changed after creation).",
            order: 1,
            points: 10,
          },
          {
            question: "How do you access the last element of a list?",
            options: ["list[last]", "list[-1]", "list[end]", "list.last()"],
            correctAnswer: 1,
            explanation:
              "In Python, you can use negative indexing where -1 refers to the last element.",
            order: 2,
            points: 15,
          },
        ],
      },
    },
  });

  console.log("✅ Created quizzes with questions");

  // Assign some achievements to demo user for testing
  const demoUser = users[0]; // demo@learnifycode.com
  await Promise.all([
    prisma.userAchievement.create({
      data: {
        userId: demoUser.id,
        achievementId: achievements[0].id, // First Steps
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    }),
    prisma.userAchievement.create({
      data: {
        userId: demoUser.id,
        achievementId: achievements[1].id, // Code Warrior
        unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    }),
  ]);

  console.log("✅ Created user achievements for demo user");

  // Seed achievements
  await seedAchievements();

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
