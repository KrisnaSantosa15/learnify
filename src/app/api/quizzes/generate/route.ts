import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      topic,
      difficulty,
      questionCount,
      includeCodeExamples,
      realWorldScenarios,
      templateType,
    } = body;

    if (!topic || !difficulty || !questionCount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create dynamic difficulty settings
    const difficultySettings = {
      BEGINNER: {
        complexity: "fundamental concepts and basic understanding",
        questionStyle: "straightforward, clear explanations",
        examples: "simple, practical examples",
        points: 10,
      },
      INTERMEDIATE: {
        complexity: "practical application and deeper understanding",
        questionStyle: "scenario-based with moderate complexity",
        examples: "real-world applications and problem-solving",
        points: 15,
      },
      ADVANCED: {
        complexity: "complex scenarios, edge cases, and expert-level concepts",
        questionStyle: "challenging, multi-layered thinking required",
        examples:
          "advanced patterns, optimization, and architectural decisions",
        points: 20,
      },
      EXPERT: {
        complexity:
          "cutting-edge concepts, advanced patterns, and expert insights",
        questionStyle: "highly sophisticated, requires deep expertise",
        examples:
          "advanced algorithms, design patterns, and performance optimization",
        points: 25,
      },
    };

    const currentDifficulty =
      difficultySettings[difficulty as keyof typeof difficultySettings] ||
      difficultySettings.BEGINNER;

    // Create template-specific instructions
    const templateInstructions = {
      "multiple-choice":
        "Create traditional multiple choice questions with clear, distinct options. Focus on testing conceptual understanding.",
      "code-completion":
        "Include code snippets with missing parts. Questions should test practical coding skills and syntax knowledge.",
      "scenario-based":
        "Create real-world scenarios that professionals encounter. Questions should test practical application and decision-making.",
      "interactive-demo":
        "Design questions that could work with interactive elements. Include visual or practical components in descriptions.",
    };

    const selectedTemplate =
      templateInstructions[templateType as keyof typeof templateInstructions] ||
      templateInstructions["multiple-choice"];

    // Create dynamic question length and style based on settings
    const questionLength = realWorldScenarios ? "detailed" : "concise";
    const explanationLength =
      difficulty === "BEGINNER" || difficulty === "INTERMEDIATE"
        ? "brief"
        : "comprehensive";

    // Create prompt for Gemini AI
    const prompt = `Create ${questionCount} ${questionLength} multiple choice quiz questions about "${topic}" for ${difficulty} level.

DIFFICULTY SPECIFICATIONS:
- Level: ${difficulty} (${currentDifficulty.complexity})
- Question Style: ${currentDifficulty.questionStyle}
- Points per question: ${currentDifficulty.points}

TEMPLATE FOCUS:
${selectedTemplate}

QUESTION FORMAT REQUIREMENTS:
- Question Length: ${
      questionLength === "detailed"
        ? "Can include context and scenarios"
        : "Keep questions concise and direct"
    }
- Each question MUST have exactly 4 options (A, B, C, D)
- Explanation Length: ${
      explanationLength === "brief"
        ? "Provide brief, clear explanations (1-2 sentences)"
        : "Provide detailed explanations with additional context"
    }
- Options should be ${
      difficulty === "BEGINNER"
        ? "clearly distinct"
        : "challenging to distinguish"
    }

CONTENT REQUIREMENTS:
${
  includeCodeExamples
    ? `- INCLUDE code examples and programming challenges
- Use proper syntax highlighting in code blocks
- Test practical coding knowledge`
    : `- Focus on conceptual understanding
- No code examples needed
- Test theoretical knowledge`
}

${
  realWorldScenarios
    ? `- INCLUDE practical scenarios and industry use cases
- Reference real work situations
- Test application of knowledge`
    : `- Keep questions focused and academic
- Test core concepts directly
- Avoid lengthy scenarios`
}

STYLE GUIDELINES:
${
  questionLength === "concise"
    ? `- Keep questions under 2 sentences when possible
- Make options brief but accurate
- Focus on testing specific knowledge points`
    : `- Can use longer contexts when needed for scenarios
- Include relevant background information
- Test deeper understanding through examples`
}

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "${
      questionLength === "concise"
        ? "Direct, focused question?"
        : "Question with context if needed?"
    }",
    "options": ["${
      questionLength === "concise"
        ? "Brief option A"
        : "Option A with details if needed"
    }", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "${
      explanationLength === "brief"
        ? "Brief explanation."
        : "Comprehensive explanation with context."
    }",
    "points": ${currentDifficulty.points}
  }
]

TOPIC: ${topic}
DIFFICULTY: ${difficulty}
TEMPLATE: ${templateType || "multiple-choice"}
QUESTION COUNT: ${questionCount}

Generate ${difficulty} level questions that are ${questionLength} and test ${topic} knowledge effectively.`;

    let questions;

    try {
      // Try using Gemini AI
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to extract JSON from the response
      const jsonText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      questions = JSON.parse(jsonText);
    } catch (aiError) {
      console.error("AI generation failed:", aiError);
      // Fallback to manual generation if AI fails
      questions = generateFallbackQuestions(topic, difficulty, questionCount);
    }

    // Validate and clean the questions
    const validatedQuestions = questions.map(
      (
        q: {
          question?: string;
          options?: string[];
          correctAnswer?: number;
          explanation?: string;
          points?: number;
        },
        index: number
      ) => ({
        question:
          q.question ||
          `${difficulty} level question ${index + 1} about ${topic}`,
        options:
          Array.isArray(q.options) && q.options.length === 4
            ? q.options
            : ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer:
          typeof q.correctAnswer === "number" &&
          q.correctAnswer >= 0 &&
          q.correctAnswer <= 3
            ? q.correctAnswer
            : 0,
        explanation:
          q.explanation ||
          `This is the correct answer for this ${difficulty} level ${topic} question.`,
        points: q.points || currentDifficulty.points,
        order: index + 1,
      })
    );

    return NextResponse.json({ questions: validatedQuestions });
  } catch (error) {
    console.error("Error generating questions:", error);

    // Final fallback
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}

function generateFallbackQuestions(
  topic: string,
  difficulty: string,
  questionCount: number
) {
  const questions = [];

  const difficultyPoints = {
    BEGINNER: 10,
    INTERMEDIATE: 15,
    ADVANCED: 20,
    EXPERT: 25,
  };

  const topicTemplates: Record<string, Record<string, string[]>> = {
    JavaScript: {
      BEGINNER: [
        "What does 'const' declare?",
        "Which method adds array elements?",
        "What is typeof null?",
        "How do you create functions?",
        "What are variables?",
      ],
      INTERMEDIATE: [
        "What is closure?",
        "Difference between == and ===?",
        "How does event delegation work?",
        "What is 'this' keyword?",
        "How do Promises work?",
      ],
      ADVANCED: [
        "How does event loop handle tasks?",
        "Explain prototype chain",
        "What are closure patterns?",
        "How to implement custom Promise?",
        "Module bundling strategies?",
      ],
      EXPERT: [
        "JavaScript performance optimization?",
        "Memory management strategies?",
        "Engine optimization implications?",
        "Scalable SPA architecture?",
        "Modern JavaScript features?",
      ],
    },
    React: {
      BEGINNER: [
        "What is JSX?",
        "Which hook manages state?",
        "What is virtual DOM?",
        "How to pass data?",
        "What are components?",
      ],
      INTERMEDIATE: [
        "What is useEffect for?",
        "How to optimize performance?",
        "Controlled vs uncontrolled?",
        "How to create custom hooks?",
        "When to use context?",
      ],
      ADVANCED: [
        "Complex state management?",
        "Performance optimization practices?",
        "Component composition patterns?",
        "React concurrent features?",
        "Reusable component libraries?",
      ],
      EXPERT: [
        "Micro-frontend architecture?",
        "SSR optimization patterns?",
        "Custom rendering strategies?",
        "State management at scale?",
        "Maximum performance design?",
      ],
    },
    // Add more topics with difficulty levels...
  };

  const currentTopicQuestions =
    topicTemplates[topic] || topicTemplates.JavaScript;
  const difficultyQuestions =
    currentTopicQuestions[difficulty] || currentTopicQuestions.BEGINNER;
  const basePoints =
    difficultyPoints[difficulty as keyof typeof difficultyPoints] || 10;

  for (let i = 0; i < questionCount; i++) {
    const questionIndex = i % difficultyQuestions.length;
    const isBasicLevel =
      difficulty === "BEGINNER" || difficulty === "INTERMEDIATE";

    questions.push({
      question: difficultyQuestions[questionIndex],
      options: [
        `Correct answer`,
        `Incorrect option A`,
        `Incorrect option B`,
        `Incorrect option C`,
      ],
      correctAnswer: 0,
      explanation: isBasicLevel
        ? `This is the correct answer for ${difficulty.toLowerCase()} level.`
        : `This demonstrates ${difficulty.toLowerCase()} understanding with proper implementation and best practices.`,
      points: basePoints,
      order: i + 1,
    });
  }

  return questions;
}
