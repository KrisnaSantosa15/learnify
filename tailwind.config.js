/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-100": "var(--dark-100)",
        "dark-200": "var(--dark-200)",
        "dark-300": "var(--dark-300)",
        "dark-400": "var(--dark-400)",
        "neon-blue": "var(--neon-blue)",
        "neon-purple": "var(--neon-purple)",
        "neon-pink": "var(--neon-pink)",
        "neon-green": "var(--neon-green)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        "neon-blue": "0 0 15px rgba(0, 240, 255, 0.7)",
        "neon-purple": "0 0 15px rgba(158, 0, 255, 0.7)",
        "neon-pink": "0 0 15px rgba(255, 0, 245, 0.7)",
        "neon-green": "0 0 15px rgba(0, 255, 102, 0.7)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-neon":
          "linear-gradient(90deg, var(--neon-blue), var(--neon-purple))",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(0, 240, 255, 0.7)",
            borderColor: "rgba(0, 240, 255, 0.7)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(0, 240, 255, 0.9)",
            borderColor: "rgba(0, 240, 255, 0.9)",
          },
        },
      },
      animation: {
        "pulse-slow": "pulse 3s infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
