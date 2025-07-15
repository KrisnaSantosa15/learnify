import Link from "next/link";

export default function LoginTestPage() {
  return (
    <div className="min-h-screen bg-[#0a0d1c] text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <Link
            href="/"
            className="text-[#8e5ff5] hover:text-[#a679ff] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-[#151f38]/60 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">🔑 Test Login</h1>

          <div className="space-y-6">
            {/* Test with existing user */}
            <div className="bg-white/5 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-2 text-[#28c7f9]">
                Demo User
              </h2>
              <p className="text-sm text-gray-400 mb-3">
                Login with our seeded demo user from the database
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-400">Email:</span>{" "}
                  demo@learnifycode.com
                </p>
                <p>
                  <span className="text-gray-400">Password:</span> password123
                </p>
              </div>
            </div>

            {/* Test navigation links */}
            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="block w-full py-3 bg-[#8e5ff5] hover:bg-[#a679ff] rounded-lg text-center font-medium transition-colors"
              >
                Go to Login Page
              </Link>

              <Link
                href="/auth/register"
                className="block w-full py-3 bg-[#28c7f9] hover:bg-[#3dd8ff] rounded-lg text-center font-medium transition-colors"
              >
                Go to Register Page
              </Link>

              <Link
                href="/dashboard"
                className="block w-full py-3 bg-[#58c896] hover:bg-[#6de8a8] rounded-lg text-center font-medium transition-colors"
              >
                Go to Dashboard (Test Auth)
              </Link>
            </div>

            {/* API Test */}
            <div className="bg-white/5 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-2 text-[#fab72b]">
                API Tests
              </h2>
              <div className="space-y-2">
                <Link
                  href="/api/users/me"
                  target="_blank"
                  className="block text-sm text-[#fab72b] hover:text-[#ffc947] transition-colors"
                >
                  Test /api/users/me →
                </Link>
                <Link
                  href="/api/users"
                  target="_blank"
                  className="block text-sm text-[#fab72b] hover:text-[#ffc947] transition-colors"
                >
                  Test /api/users →
                </Link>
                <Link
                  href="/test-db"
                  className="block text-sm text-[#fab72b] hover:text-[#ffc947] transition-colors"
                >
                  Test Database Page →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
