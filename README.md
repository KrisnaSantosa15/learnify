# 🎮 Lernify - Modern Gamified Educational Platform

![Lernify Banner](https://img.shields.io/badge/Lernify-Educational%20Platform-brightgreen?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-blue?style=for-the-badge&logo=tailwindcss)

A modern, interactive, and futuristic educational platform that transforms learning into an engaging gaming experience. Lernify combines cutting-edge web technologies with gamification mechanics to create an immersive learning environment inspired by platforms like Duolingo.

## 🌟 Features

### 🎯 **Core Learning Features**
- **Interactive Programming Quizzes** - Real-time coding challenges with immediate feedback
- **Skill Tree Visualization** - Visual learning paths with interconnected skills
- **Progress Tracking** - Comprehensive analytics and learning insights
- **Daily Study Goals** - Customizable learning targets with streak tracking
- **AI-Powered Hints** - Intelligent assistance for challenging problems

### 🎮 **Gamification System**
- **Achievement Badges** - Earn rewards for completing milestones
- **XP & Level System** - Progress through levels with experience points
- **Streak Tracking** - Maintain learning streaks for bonus rewards
- **Leaderboards** - Compete with other learners globally
- **Hearts System** - Lives-based learning with regeneration
- **Daily Quests** - Special challenges for extra rewards

### 🎨 **Modern UI/UX**
- **Glassmorphism Design** - Beautiful frosted glass effects
- **Neon Accents** - Vibrant color scheme with glowing elements
- **Smooth Animations** - Framer Motion & GSAP powered interactions
- **3D Visualizations** - Three.js skill trees and interactive elements
- **Responsive Design** - Optimized for all devices and screen sizes

### 📱 **Dashboard Features**
- **Course Management** - Switch between programming languages
- **Real-time Statistics** - Track XP, hearts, streaks, and achievements
- **Neural Enhancer** - AI tutor simulation for personalized learning
- **Social Features** - Connect with other learners and share progress

## 🚀 Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Component animations
- **GSAP** - Advanced scroll animations
- **Three.js** - 3D visualizations
- **Lottie React** - Lightweight animations

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📋 Project Structure

```
lernify/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Landing page
│   │   ├── dashboard/          # Dashboard application
│   │   │   └── page.tsx        # Learning dashboard
│   │   └── globals.css         # Global styles & variables
│   │
│   └── components/
│       ├── ui/                 # Landing page components
│       │   ├── Nav.tsx         # Navigation with scroll tracking
│       │   ├── Hero.tsx        # Hero section with animations
│       │   ├── Features.tsx    # Feature showcase (Bento grid)
│       │   ├── Gamification.tsx # Achievement system demo
│       │   ├── LearningPath.tsx # Interactive skill tree
│       │   ├── InteractiveDemo.tsx # Functional quiz demo
│       │   ├── Testimonials.tsx # User testimonials
│       │   ├── Pricing.tsx     # Subscription plans
│       │   └── Footer.tsx      # Footer component
│       │
│       └── dashboard/          # Dashboard components
│           ├── DashboardHeader.tsx # Header with user stats
│           ├── DashboardSidebar.tsx # Navigation sidebar
│           ├── CourseProgress.tsx # Course tracking
│           ├── ProgrammingQuiz.tsx # Interactive quiz
│           ├── AchievementSection.tsx # Achievement display
│           ├── Leaderboard.tsx # Competitive rankings
│           ├── Streaks.tsx     # Streak tracking
│           └── NeuralEnhancer.tsx # AI tutor simulation
│
├── public/                     # Static assets
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
├── next.config.ts             # Next.js configuration
└── tsconfig.json             # TypeScript configuration
```

## 🛠️ Getting Started

### **Prerequisites**
- Node.js 20.x or later
- npm 11.x or later

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/KrisnaSantosa15/learnify.git
cd lernify
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### **Available Scripts**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎮 How to Use

### **Landing Page**
- **Hero Section** - Introduction to the platform with animated elements
- **Features** - Interactive showcase of platform capabilities
- **Learning Path** - Visual skill tree demonstration
- **Gamification** - Achievement badges and leaderboard preview
- **Interactive Demo** - Try the quiz system
- **Testimonials** - User success stories
- **Pricing** - Subscription options

### **Dashboard**
- **Course Selection** - Choose from JavaScript, Python, HTML/CSS, React
- **Daily Goals** - Set and track study time objectives
- **Quiz System** - Interactive programming challenges
- **Progress Tracking** - Visual progress bars and statistics
- **Achievement System** - Unlock badges and earn XP
- **Leaderboards** - Compete with other learners
- **Streaks** - Maintain daily learning habits

## 🎨 Design System

### **Color Palette**
- **Dark Themes**: `#0a0a0a`, `#121212`, `#1a1a1a`, `#232323`
- **Neon Accents**: Blue (`#00f0ff`), Purple (`#9e00ff`), Pink (`#ff00f5`), Green (`#00ff66`)
- **Glassmorphism**: Semi-transparent backgrounds with backdrop blur

### **Typography**
- **Primary**: Geist Sans (variable weight)
- **Monospace**: Geist Mono (for code)

### **Animations**
- **Scroll Animations**: GSAP-powered reveal effects
- **Micro-interactions**: Hover and click feedback
- **3D Elements**: Three.js skill tree visualizations

## 📚 Documentation

Comprehensive documentation is available in the `/guides` directory:

- **[Main Documentation](./guides/DOCUMENTATION.md)** - Technical overview
- **[Gamification Guide](./guides/GAMIFICATION_GUIDE.md)** - Achievement system details
- **[User Guide](./guides/USER_GUIDE.md)** - End-user instructions
- **[Implementation Guide](./guides/implementation-guide.md)** - Development guidelines
- **[Content Strategy](./guides/content_strategy.md)** - Learning content approach
- **[Responsive Design](./guides/responsive_design_specs.md)** - Mobile-first design specs

## 🌐 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

## 🔧 Performance Optimizations

- **Code Splitting** - Dynamic imports for faster loading
- **Image Optimization** - Next.js Image component
- **Lazy Loading** - Intersection Observer for components
- **Animation Optimization** - GPU-accelerated animations
- **Bundle Analysis** - Optimized dependencies

## ♿ Accessibility

- **WCAG 2.1 AA Compliant** - Accessible to all users
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - Proper ARIA labels
- **Color Contrast** - Meets accessibility standards
- **Reduced Motion** - Respects user preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Next.js Team](https://nextjs.org/)** - Amazing React framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[Duolingo](https://www.duolingo.com/)** - Inspiration for gamification
- **[Vercel](https://vercel.com/)** - Font and deployment platform

---

<div align="center">
  <p>Built with ❤️ by Krisna Santosa</p>
  <p>Transform your learning journey into an adventure!</p>
</div>
