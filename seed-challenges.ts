import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedChallenges() {
  console.log("🌱 Seeding challenges...");

  // Delete existing challenges first
  await prisma.challenge.deleteMany();

  // Create sample challenges
  const challenges = await Promise.all([
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
  
}

// Test your function
console.log(arraySum([1, 2, 3, 4, 5])); // Should output: 15
console.log(arraySum([10, -5, 3])); // Should output: 8`,
        solution: `function arraySum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}`,
        testCases: {
          tests: [
            { input: [[1, 2, 3, 4, 5]], expected: 15 },
            { input: [[10, -5, 3]], expected: 8 },
            { input: [[]], expected: 0 },
          ],
        },
        hints: [
          "You can use a for loop to iterate through the array",
          "Consider using the reduce() method",
          "Don't forget to handle empty arrays",
        ],
        xpReward: 100,
        timeLimit: 300,
        isPublished: true,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Find Maximum Number",
        description: "Find the largest number in an array",
        difficulty: "BEGINNER",
        technology: "JavaScript",
        type: "ALGORITHM",
        prompt:
          "Write a function that finds and returns the largest number in an array.",
        starterCode: `function findMax(numbers) {
  // Your code here
  
}

// Test your function
console.log(findMax([1, 5, 3, 9, 2])); // Should output: 9
console.log(findMax([-1, -5, -3])); // Should output: -1`,
        solution: `function findMax(numbers) {
  return Math.max(...numbers);
}`,
        testCases: {
          tests: [
            { input: [[1, 5, 3, 9, 2]], expected: 9 },
            { input: [[-1, -5, -3]], expected: -1 },
            { input: [[42]], expected: 42 },
          ],
        },
        hints: [
          "You can use Math.max() with the spread operator",
          "Or use a for loop to compare each element",
          "Remember to handle arrays with negative numbers correctly",
        ],
        xpReward: 120,
        timeLimit: 300,
        isPublished: true,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Reverse String",
        description: "Reverse a string without using built-in reverse method",
        difficulty: "BEGINNER",
        technology: "JavaScript",
        type: "ALGORITHM",
        prompt:
          "Write a function that reverses a string without using the built-in reverse() method.",
        starterCode: `function reverseString(str) {
  // Your code here
  
}

// Test your function
console.log(reverseString("hello")); // Should output: "olleh"
console.log(reverseString("JavaScript")); // Should output: "tpircSavaJ"`,
        solution: `function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}`,
        testCases: {
          tests: [
            { input: ["hello"], expected: "olleh" },
            { input: ["JavaScript"], expected: "tpircSavaJ" },
            { input: ["a"], expected: "a" },
            { input: [""], expected: "" },
          ],
        },
        hints: [
          "You can use a for loop starting from the last character",
          "Try building the reversed string character by character",
          "Another approach is to use recursion",
        ],
        xpReward: 110,
        timeLimit: 300,
        isPublished: true,
      },
    }),
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
  
}

// Test your function
fizzBuzz(15); // Should print numbers 1-15 with Fizz/Buzz replacements`,
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
        xpReward: 150,
        timeLimit: 600,
        isPublished: true,
      },
    }),
  ]);

  console.log("✅ Created challenges:", challenges.length);
}

seedChallenges()
  .then(() => {
    console.log("🎉 Challenge seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error seeding challenges:", error);
    process.exit(1);
  });
