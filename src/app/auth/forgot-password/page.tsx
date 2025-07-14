"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual password reset logic
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div>
        <AuthHeader />
        <div className="min-h-screen bg-[#0a111f] flex items-center justify-center relative overflow-hidden pt-20">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-[#28c7f9]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8e5ff5]/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#58c896]/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 w-full max-w-md mx-auto p-6">
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-[#58c896] to-[#28c7f9] items-center justify-center shadow-lg shadow-[#58c896]/20 mb-6">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Check your email
              </h1>
              <p className="text-gray-400">
                We&apos;ve sent a password reset link to <br />
                <span className="text-[#28c7f9]">{email}</span>
              </p>
            </div>

            <div className="bg-dark-300/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl text-center">
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Didn&apos;t receive the email? Check your spam folder or try
                  again.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-[#28c7f9] hover:text-[#58c896] font-medium transition-colors"
                >
                  Try different email
                </button>
              </div>

              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-[#28c7f9] to-[#58c896] text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-200"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AuthHeader />
      <div className="min-h-screen bg-[#0a111f] flex items-center justify-center relative overflow-hidden pt-20">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#28c7f9]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8e5ff5]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#58c896]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto p-6">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-[#28c7f9] to-[#58c896] items-center justify-center shadow-lg shadow-[#58c896]/20 mb-6">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-400">
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </p>
          </div>

          {/* Reset Form */}
          <div className="bg-dark-300/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-dark-200 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28c7f9] focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#28c7f9] to-[#58c896] text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#28c7f9] focus:ring-offset-2 focus:ring-offset-dark-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending reset link...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-gray-400 hover:text-[#28c7f9] transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
