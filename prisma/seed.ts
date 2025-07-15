import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "demo@learnifycode.com",
        username: "demo_user",
        name: "Demo User",
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
        level: 1,
        xp: 150,
        streak: 3,
        plan: "FREE",
      },
    }),
  ]);

  console.log("✅ Created users:", users.length);

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

  // Create sample quiz
  await prisma.quiz.create({
    data: {
      title: "JavaScript Basics Quiz",
      description: "Test your knowledge of JavaScript fundamentals",
      difficulty: "BEGINNER",
      category: "JavaScript",
      timeLimit: 10,
      xpReward: 100,
      isPublished: true,
      questions: {
        create: [
          {
            question: "Which method adds an element to the end of an array?",
            options: ["push()", "pop()", "shift()", "unshift()"],
            correctAnswer: 0,
            explanation:
              "The push() method adds one or more elements to the end of an array.",
            order: 1,
            points: 10,
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
              "The const keyword declares a constant variable that cannot be reassigned.",
            order: 2,
            points: 10,
          },
        ],
      },
    },
  });

  console.log("✅ Created quiz with questions");

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
