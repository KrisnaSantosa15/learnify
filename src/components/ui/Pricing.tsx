"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// Feature list item animation
const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.05,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

// Pricing plans data
const plans = [
  {
    name: "Free",
    description: "Perfect for beginners exploring coding concepts",
    price: 0,
    features: [
      { text: "Basic skill tree access", included: true },
      { text: "Core learning path modules", included: true },
      { text: "Achievement badges (limited)", included: true },
      { text: "Community forum access", included: true },
      { text: "Weekly coding challenges", included: false },
      { text: "Advanced learning paths", included: false },
      { text: "Premium projects & exercises", included: false },
      { text: "Certificate of completion", included: false },
      { text: "Mentor code reviews", included: false },
      { text: "Job-ready skill assessments", included: false },
    ],
    cta: "Start Learning",
    popular: false,
    color: "#28c7f9",
  },
  {
    name: "Pro",
    description: "For developers serious about leveling up their skills",
    price: 12,
    features: [
      { text: "Full skill tree access", included: true },
      { text: "All learning path modules", included: true },
      { text: "Complete badge collection", included: true },
      { text: "Community forum access", included: true },
      { text: "Weekly coding challenges", included: true },
      { text: "Advanced learning paths", included: true },
      { text: "Premium projects & exercises", included: true },
      { text: "Certificate of completion", included: true },
      { text: "Mentor code reviews", included: false },
      { text: "Job-ready skill assessments", included: false },
    ],
    cta: "Go Pro",
    popular: true,
    color: "#8e5ff5",
  },
  {
    name: "Premium",
    description: "For career-focused developers seeking job opportunities",
    price: 29,
    features: [
      { text: "Everything in Pro plan", included: true },
      { text: "1-on-1 mentor sessions", included: true },
      { text: "Team collaboration projects", included: true },
      { text: "Advanced skill assessments", included: true },
      { text: "Industry expert workshops", included: true },
      { text: "Resume & portfolio review", included: true },
      { text: "Job opportunity matching", included: true },
      { text: "Interview preparation", included: true },
      { text: "Career path planning", included: true },
      { text: "LinkedIn profile optimization", included: true },
    ],
    cta: "Get Premium",
    popular: false,
    color: "#ff5e7d",
  },
];

// Feature comparison list for detailed comparison table
const featureCategories = [
  {
    name: "Learning Content",
    features: [
      { name: "Beginner Tutorials", free: true, pro: true, premium: true },
      {
        name: "Intermediate Courses",
        free: "Limited",
        pro: true,
        premium: true,
      },
      { name: "Advanced Topics", free: false, pro: true, premium: true },
      {
        name: "Industry Case Studies",
        free: false,
        pro: "Limited",
        premium: true,
      },
      {
        name: "Specialized Learning Paths",
        free: false,
        pro: true,
        premium: true,
      },
    ],
  },
  {
    name: "Gamification",
    features: [
      { name: "Achievement Badges", free: "Basic", pro: "All", premium: "All" },
      { name: "XP & Level System", free: true, pro: true, premium: true },
      {
        name: "Leaderboards",
        free: "Global",
        pro: "Global & Custom",
        premium: "Global & Custom",
      },
      {
        name: "Skill Tree Access",
        free: "Basic",
        pro: "Full",
        premium: "Full",
      },
      {
        name: "Streak Rewards",
        free: "Basic",
        pro: "Enhanced",
        premium: "Enhanced+",
      },
    ],
  },
  {
    name: "Practice & Assessment",
    features: [
      {
        name: "Coding Challenges",
        free: "Basic",
        pro: "Advanced",
        premium: "Expert",
      },
      { name: "Practice Projects", free: 5, pro: 50, premium: "Unlimited" },
      { name: "Quiz Assessments", free: true, pro: true, premium: true },
      { name: "Skill Validations", free: false, pro: true, premium: true },
      {
        name: "Performance Analytics",
        free: "Basic",
        pro: "Advanced",
        premium: "Expert",
      },
    ],
  },
  {
    name: "Support & Community",
    features: [
      {
        name: "Community Forum",
        free: "Read Only",
        pro: "Full Access",
        premium: "Full Access",
      },
      { name: "Code Reviews", free: false, pro: "Limited", premium: true },
      { name: "Mentorship Sessions", free: false, pro: false, premium: true },
      { name: "Private Discord Access", free: false, pro: true, premium: true },
      { name: "Priority Support", free: false, pro: false, premium: true },
    ],
  },
  {
    name: "Career Development",
    features: [
      {
        name: "Completion Certificates",
        free: false,
        pro: true,
        premium: true,
      },
      {
        name: "Portfolio Projects",
        free: false,
        pro: "Limited",
        premium: "Unlimited",
      },
      { name: "Resume Review", free: false, pro: false, premium: true },
      { name: "Mock Interviews", free: false, pro: false, premium: true },
      {
        name: "Job Placement Assistance",
        free: false,
        pro: false,
        premium: true,
      },
    ],
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Calculate price with yearly discount
  const calculatePrice = (monthlyPrice: number) => {
    return isYearly ? (monthlyPrice * 10).toFixed(0) : monthlyPrice.toFixed(0);
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-24 relative bg-[#0a0d1c]"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-[#ff5e7d]/10 blur-3xl -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 rounded-full bg-[#28c7f9]/10 blur-3xl bottom-48 -right-48"></div>
        <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        {/* Section header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          custom={0}
        >
          <div className="inline-block mb-3">
            <div className="h-1.5 w-20 bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] mx-auto rounded-full mb-6"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-white">Simple </span>
            <span className="text-[#8e5ff5]">Pricing</span>
            <span className="text-white"> Plans</span>
          </h2>
          <p className="text-lg text-[#a8b1c2] mb-8">
            Choose the perfect plan to accelerate your coding journey with our
            gamified learning platform.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-white/5 p-1 rounded-full border border-white/10 mb-8">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                !isYearly
                  ? "bg-[#8e5ff5] text-white"
                  : "text-[#a8b1c2] hover:text-white"
              }`}
              onClick={() => setIsYearly(false)}
            >
              Monthly Billing
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                isYearly
                  ? "bg-[#8e5ff5] text-white"
                  : "text-[#a8b1c2] hover:text-white"
              }`}
              onClick={() => setIsYearly(true)}
            >
              <span>Yearly Billing</span>
              <span className="ml-1 px-2 py-0.5 text-[10px] bg-[#58c896] text-white rounded-full whitespace-nowrap">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden ${
                plan.popular ? "md:-mt-6 md:mb-6" : ""
              }`}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              custom={index + 1}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-[#8e5ff5] text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div
                className={`bg-[#151f38]/60 backdrop-blur-lg border ${
                  plan.popular ? "border-[#8e5ff5]/50" : "border-white/10"
                } rounded-2xl shadow-xl h-full`}
              >
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: plan.color }}
                ></div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-[#a8b1c2] text-sm mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-white">
                      ${calculatePrice(plan.price)}
                    </span>
                    <span className="text-[#a8b1c2] ml-2">
                      {isYearly ? "/year" : "/month"}
                    </span>
                  </div>

                  <Link
                    href={`/signup?plan=${plan.name.toLowerCase()}`}
                    className="block w-full py-3 rounded-lg font-medium text-center mb-8"
                    style={{
                      backgroundColor: `${plan.color}20`,
                      color: plan.color,
                    }}
                  >
                    {plan.cta}
                  </Link>

                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        className="flex items-center"
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                        variants={listItemVariants}
                        custom={featureIndex}
                      >
                        {feature.included ? (
                          <svg
                            className="w-5 h-5 text-[#58c896] mr-3 flex-shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-[#a8b1c2]/30 mr-3 flex-shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-[#a8b1c2]"
                              : "text-[#a8b1c2]/50"
                          }
                        >
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison toggle */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          custom={4}
        >
          <button
            className="text-[#8e5ff5] hover:text-[#a679ff] flex items-center mx-auto transition-colors"
            onClick={() => setShowComparisonTable(!showComparisonTable)}
          >
            <span className="mr-2">
              {showComparisonTable ? "Hide" : "View"} Detailed Comparison
            </span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                showComparisonTable ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </motion.div>

        {/* Feature comparison table */}
        {showComparisonTable && (
          <motion.div
            className="overflow-x-auto mb-16"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex space-x-2 bg-white/5 rounded-full p-1 mb-8 mx-auto">
              {featureCategories.map((category, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeTab === idx
                      ? "bg-[#8e5ff5] text-white"
                      : "text-[#a8b1c2] hover:text-white"
                  }`}
                  onClick={() => setActiveTab(idx)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="bg-[#151f38]/60 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/5">
              <div className="min-w-full">
                <div className="grid grid-cols-4">
                  {/* Header */}
                  <div className="p-6 bg-[#131d33] border-r border-white/5">
                    <h4 className="text-lg font-bold text-white">
                      {featureCategories[activeTab].name}
                    </h4>
                    <p className="text-xs text-[#a8b1c2]">Feature comparison</p>
                  </div>

                  {/* Plan Headers */}
                  {plans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`p-6 text-center bg-[#131d33] ${
                        plan.popular ? "border-t-2" : ""
                      }`}
                      style={plan.popular ? { borderTopColor: plan.color } : {}}
                    >
                      <h4 className="font-bold text-white">{plan.name}</h4>
                      <div className="flex items-baseline justify-center">
                        <span className="text-2xl font-bold text-white">
                          ${calculatePrice(plan.price)}
                        </span>
                        <span className="text-[#a8b1c2] text-xs ml-1">
                          {isYearly ? "/year" : "/month"}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Feature rows */}
                  {featureCategories[activeTab].features.map((feature, idx) => (
                    <React.Fragment key={feature.name}>
                      {/* Feature name */}
                      <div
                        className={`p-4 text-[#a8b1c2] ${
                          idx % 2 === 0 ? "bg-[#121a30]" : ""
                        } border-r border-white/5`}
                      >
                        {feature.name}
                      </div>

                      {/* Free plan */}
                      <div
                        className={`p-4 text-center ${
                          idx % 2 === 0 ? "bg-[#121a30]" : ""
                        } border-r border-white/5`}
                      >
                        {typeof feature.free === "boolean" ? (
                          feature.free ? (
                            <svg
                              className="w-6 h-6 text-[#58c896] mx-auto"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6 text-[#a8b1c2]/30 mx-auto"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )
                        ) : (
                          <span className="text-[#a8b1c2]">{feature.free}</span>
                        )}
                      </div>

                      {/* Pro plan */}
                      <div
                        className={`p-4 text-center ${
                          idx % 2 === 0 ? "bg-[#121a30]" : ""
                        } ${
                          plans[1].popular
                            ? "border-x-2 border-x-[#8e5ff5]/20"
                            : "border-r border-white/5"
                        }`}
                      >
                        {typeof feature.pro === "boolean" ? (
                          feature.pro ? (
                            <svg
                              className="w-6 h-6 text-[#58c896] mx-auto"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6 text-[#a8b1c2]/30 mx-auto"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )
                        ) : (
                          <span className="text-[#8e5ff5] font-medium">
                            {feature.pro}
                          </span>
                        )}
                      </div>

                      {/* Premium plan */}
                      <div
                        className={`p-4 text-center ${
                          idx % 2 === 0 ? "bg-[#121a30]" : ""
                        }`}
                      >
                        {typeof feature.premium === "boolean" ? (
                          feature.premium ? (
                            <svg
                              className="w-6 h-6 text-[#58c896] mx-auto"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6 text-[#a8b1c2]/30 mx-auto"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )
                        ) : (
                          <span className="text-[#ff5e7d] font-medium">
                            {feature.premium}
                          </span>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          custom={5}
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            <Faq
              question="Can I switch between plans later?"
              answer="Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference for the remainder of your billing period. When downgrading, the new rate will apply at the start of your next billing cycle."
            />

            <Faq
              question="Is there a student discount available?"
              answer="Yes, we offer a 50% discount on our Pro plan for students with a valid educational email address. Contact our support team with proof of your student status to apply for the discount."
            />

            <Faq
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and various regional payment methods. For yearly subscriptions, we also offer invoicing options for businesses."
            />

            <Faq
              question="Can I get a refund if I'm not satisfied?"
              answer="Yes! We offer a 14-day money-back guarantee for all paid plans. If you're not completely satisfied with your Learnifies experience, simply contact our support team within 14 days of your purchase for a full refund."
            />

            <Faq
              question="Do I need to provide payment information for the free plan?"
              answer="No, you can sign up and use the Free plan without providing any payment information. You'll only need to enter payment details when you decide to upgrade to a paid plan."
            />
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="max-w-4xl mx-auto mt-16 text-center bg-[#151f38]/60 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          custom={6}
        >
          <div className="p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Level Up Your Coding Skills?
            </h3>
            <p className="text-[#a8b1c2] mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are accelerating their growth
              with our gamified learning platform. Start with the free plan and
              upgrade whenever you&apos;re ready.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/signup?plan=pro"
                className="px-8 py-3 bg-gradient-to-r from-[#8e5ff5] to-[#ff5e7d] rounded-full text-white font-medium transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Start with Pro Plan</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#ff5e7d] to-[#8e5ff5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>

              <Link
                href="/signup?plan=free"
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-colors"
              >
                Try For Free
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// FAQ Accordion Component
function Faq({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#151f38]/60 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
      <button
        className="w-full text-left p-6 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-medium text-white">{question}</h4>
        <svg
          className={`w-5 h-5 text-[#a8b1c2] transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 text-[#a8b1c2] border-t border-white/5">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}
