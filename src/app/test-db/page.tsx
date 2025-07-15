import { prisma } from "@/lib/prisma";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  email: string;
  level: number;
  xp: number;
  streak: number;
  plan: string;
};

type Challenge = {
  id: string;
  title: string;
  difficulty: string;
  technology: string;
  xpReward: number;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
};

export default async function DatabaseTestPage() {
  const users = await prisma.user.findMany({
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      level: true,
      xp: true,
      streak: true,
      plan: true,
    },
  });

  const challenges = await prisma.challenge.findMany({
    take: 5,
    select: {
      id: true,
      title: true,
      difficulty: true,
      technology: true,
      xpReward: true,
    },
  });

  const achievements = await prisma.achievement.findMany({
    take: 5,
    select: {
      id: true,
      title: true,
      description: true,
      icon: true,
      rarity: true,
    },
  });

  return (
    <div className="min-h-screen bg-[#0a0d1c] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-[#8e5ff5] hover:text-[#a679ff] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center">
          🗄️ Database Integration Test
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Users Section */}
          <div className="bg-[#151f38]/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#28c7f9]">👥 Users</h2>
            <div className="space-y-3">
              {users.map((user: User) => (
                <div key={user.id} className="bg-white/5 p-3 rounded-lg">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span>Level {user.level}</span>
                    <span>{user.xp} XP</span>
                    <span>{user.streak}🔥</span>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                      user.plan === "FREE"
                        ? "bg-gray-600"
                        : user.plan === "PRO"
                        ? "bg-[#8e5ff5]"
                        : "bg-[#ff5e7d]"
                    }`}
                  >
                    {user.plan}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges Section */}
          <div className="bg-[#151f38]/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#58c896]">
              🧩 Challenges
            </h2>
            <div className="space-y-3">
              {challenges.map((challenge: Challenge) => (
                <div key={challenge.id} className="bg-white/5 p-3 rounded-lg">
                  <h3 className="font-medium">{challenge.title}</h3>
                  <div className="flex justify-between mt-2 text-xs">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        challenge.difficulty === "BEGINNER"
                          ? "bg-green-600"
                          : challenge.difficulty === "INTERMEDIATE"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="bg-blue-600 px-2 py-1 rounded-full">
                      {challenge.technology}
                    </span>
                  </div>
                  <p className="text-sm text-[#fab72b] mt-2">
                    +{challenge.xpReward} XP
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-[#151f38]/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#ff5e7d]">
              🏆 Achievements
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement: Achievement) => (
                <div key={achievement.id} className="bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <h3 className="font-medium">{achievement.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    {achievement.description}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                      achievement.rarity === "COMMON"
                        ? "bg-gray-600"
                        : achievement.rarity === "UNCOMMON"
                        ? "bg-green-600"
                        : achievement.rarity === "RARE"
                        ? "bg-blue-600"
                        : achievement.rarity === "EPIC"
                        ? "bg-purple-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {achievement.rarity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Database Stats */}
        <div className="mt-8 bg-[#151f38]/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            📊 Database Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-[#28c7f9]">
                {users.length}
              </p>
              <p className="text-sm text-gray-400">Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#58c896]">
                {challenges.length}
              </p>
              <p className="text-sm text-gray-400">Challenges</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#ff5e7d]">
                {achievements.length}
              </p>
              <p className="text-sm text-gray-400">Achievements</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#fab72b]">✅</p>
              <p className="text-sm text-gray-400">Connected</p>
            </div>
          </div>
        </div>

        {/* API Test Links */}
        <div className="mt-8 bg-[#151f38]/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            🔌 API Endpoints
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/api/users"
              className="block p-4 bg-[#28c7f9]/20 hover:bg-[#28c7f9]/30 border border-[#28c7f9]/30 rounded-lg text-center transition-colors"
            >
              <p className="font-medium">GET /api/users</p>
              <p className="text-sm text-gray-400">View all users</p>
            </Link>
            <Link
              href="/api/challenges"
              className="block p-4 bg-[#58c896]/20 hover:bg-[#58c896]/30 border border-[#58c896]/30 rounded-lg text-center transition-colors"
            >
              <p className="font-medium">GET /api/challenges</p>
              <p className="text-sm text-gray-400">View all challenges</p>
            </Link>
            <Link
              href="/api/submissions"
              className="block p-4 bg-[#ff5e7d]/20 hover:bg-[#ff5e7d]/30 border border-[#ff5e7d]/30 rounded-lg text-center transition-colors"
            >
              <p className="font-medium">GET /api/submissions</p>
              <p className="text-sm text-gray-400">View submissions</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
