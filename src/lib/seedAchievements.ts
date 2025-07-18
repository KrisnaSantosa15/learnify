import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAchievements() {
  console.log("🏆 Seeding achievements...");

  const achievements = [
    // Beginner Achievements
    {
      title: "First Steps",
      description: "Complete your first quiz",
      icon: "🎯",
      rarity: "COMMON" as const,
      category: "Getting Started",
      criteria: { quizzes_completed: 1 },
      xpReward: 50,
    },
    {
      title: "Quick Learner",
      description: "Complete 5 quizzes",
      icon: "📚",
      rarity: "COMMON" as const,
      category: "Quiz Master",
      criteria: { quizzes_completed: 5 },
      xpReward: 100,
    },
    {
      title: "Knowledge Seeker",
      description: "Complete 10 quizzes",
      icon: "🔍",
      rarity: "UNCOMMON" as const,
      category: "Quiz Master",
      criteria: { quizzes_completed: 10 },
      xpReward: 200,
    },
    {
      title: "Quiz Enthusiast",
      description: "Complete 25 quizzes",
      icon: "🎓",
      rarity: "RARE" as const,
      category: "Quiz Master",
      criteria: { quizzes_completed: 25 },
      xpReward: 500,
    },
    {
      title: "Quiz Master",
      description: "Complete 50 quizzes",
      icon: "👑",
      rarity: "EPIC" as const,
      category: "Quiz Master",
      criteria: { quizzes_completed: 50 },
      xpReward: 1000,
    },

    // Accuracy Achievements
    {
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: "⭐",
      rarity: "UNCOMMON" as const,
      category: "Accuracy",
      criteria: { perfect_scores: 1 },
      xpReward: 150,
    },
    {
      title: "Perfectionist",
      description: "Get 100% on 5 quizzes",
      icon: "💎",
      rarity: "RARE" as const,
      category: "Accuracy",
      criteria: { perfect_scores: 5 },
      xpReward: 400,
    },
    {
      title: "Accuracy Expert",
      description: "Maintain 90% average accuracy across 10 quizzes",
      icon: "🎯",
      rarity: "EPIC" as const,
      category: "Accuracy",
      criteria: { accuracy_90_percent: 10 },
      xpReward: 750,
    },

    // Streak Achievements
    {
      title: "Daily Habit",
      description: "Complete quizzes for 3 consecutive days",
      icon: "🔥",
      rarity: "COMMON" as const,
      category: "Consistency",
      criteria: { daily_streak: 3 },
      xpReward: 100,
    },
    {
      title: "Week Warrior",
      description: "Complete quizzes for 7 consecutive days",
      icon: "💪",
      rarity: "UNCOMMON" as const,
      category: "Consistency",
      criteria: { daily_streak: 7 },
      xpReward: 250,
    },
    {
      title: "Dedication",
      description: "Complete quizzes for 14 consecutive days",
      icon: "🌟",
      rarity: "RARE" as const,
      category: "Consistency",
      criteria: { daily_streak: 14 },
      xpReward: 500,
    },
    {
      title: "Unstoppable",
      description: "Complete quizzes for 30 consecutive days",
      icon: "🚀",
      rarity: "EPIC" as const,
      category: "Consistency",
      criteria: { daily_streak: 30 },
      xpReward: 1000,
    },
    {
      title: "Legend",
      description: "Complete quizzes for 100 consecutive days",
      icon: "👑",
      rarity: "LEGENDARY" as const,
      category: "Consistency",
      criteria: { daily_streak: 100 },
      xpReward: 2500,
    },

    // Speed Achievements
    {
      title: "Speed Demon",
      description: "Complete a quiz in under 2 minutes",
      icon: "⚡",
      rarity: "UNCOMMON" as const,
      category: "Speed",
      criteria: { fast_completion: 120 }, // 120 seconds
      xpReward: 200,
    },
    {
      title: "Lightning Fast",
      description: "Complete 5 quizzes in under 2 minutes each",
      icon: "🏃‍♂️",
      rarity: "RARE" as const,
      category: "Speed",
      criteria: { fast_completions: 5 },
      xpReward: 400,
    },

    // Category Achievements
    {
      title: "JavaScript Novice",
      description: "Complete 5 JavaScript quizzes",
      icon: "🟨",
      rarity: "COMMON" as const,
      category: "JavaScript",
      criteria: { category_quizzes: { category: "JavaScript", count: 5 } },
      xpReward: 150,
    },
    {
      title: "Python Explorer",
      description: "Complete 5 Python quizzes",
      icon: "🐍",
      rarity: "COMMON" as const,
      category: "Python",
      criteria: { category_quizzes: { category: "Python", count: 5 } },
      xpReward: 150,
    },
    {
      title: "Data Structures Expert",
      description: "Complete 10 Data Structures quizzes",
      icon: "🗂️",
      rarity: "UNCOMMON" as const,
      category: "Data Structures",
      criteria: {
        category_quizzes: { category: "Data Structures", count: 10 },
      },
      xpReward: 300,
    },

    // XP Achievements
    {
      title: "Rising Star",
      description: "Earn 1,000 XP",
      icon: "⭐",
      rarity: "COMMON" as const,
      category: "Experience",
      criteria: { total_xp: 1000 },
      xpReward: 100,
    },
    {
      title: "Knowledge Accumulator",
      description: "Earn 5,000 XP",
      icon: "📈",
      rarity: "UNCOMMON" as const,
      category: "Experience",
      criteria: { total_xp: 5000 },
      xpReward: 250,
    },
    {
      title: "XP Master",
      description: "Earn 10,000 XP",
      icon: "💫",
      rarity: "RARE" as const,
      category: "Experience",
      criteria: { total_xp: 10000 },
      xpReward: 500,
    },
    {
      title: "Elite Learner",
      description: "Earn 25,000 XP",
      icon: "🏆",
      rarity: "EPIC" as const,
      category: "Experience",
      criteria: { total_xp: 25000 },
      xpReward: 1000,
    },
    {
      title: "Legendary Scholar",
      description: "Earn 50,000 XP",
      icon: "👑",
      rarity: "LEGENDARY" as const,
      category: "Experience",
      criteria: { total_xp: 50000 },
      xpReward: 2000,
    },
  ];

  for (const achievement of achievements) {
    // Check if achievement already exists by title
    const existing = await prisma.achievement.findFirst({
      where: { title: achievement.title },
    });

    if (!existing) {
      await prisma.achievement.create({
        data: achievement,
      });
    }
  }

  console.log(`✅ Created ${achievements.length} achievements`);
}

// Run if called directly
if (require.main === module) {
  seedAchievements()
    .catch((e) => {
      console.error("❌ Error seeding achievements:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedAchievements;
