import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackToTop from "@/components/ui/BackToTop";
import NotificationSystem from "@/components/ui/NotificationSystem";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lernify - Modern Gamified Educational Platform",
  description:
    "A modern, interactive, and futuristic educational platform with gamified elements to enhance your learning experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-100 text-white`}
      >
        <ReduxProvider>
          <NextAuthProvider>
            {children}
            <BackToTop />
            <NotificationSystem />
          </NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
