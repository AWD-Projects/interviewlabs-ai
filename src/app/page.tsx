"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Minimalist Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950" />
        <div className="absolute inset-0 animate-gradient-shift bg-gradient-to-tr from-transparent via-cyan-50/30 to-slate-100/30 dark:via-cyan-950/20 dark:to-slate-900/20" />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-1 items-center justify-center">
        <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="mb-6 text-6xl font-bold tracking-tight md:text-7xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            InterviewLabs AI
          </h1>
          <p className="mb-4 text-xl text-slate-600 dark:text-slate-400 md:text-2xl">
            Train for your interviews with an intelligent voice agent.
          </p>
          <p className="mx-auto mb-12 max-w-2xl text-base text-slate-500 dark:text-slate-500 md:text-lg">
            Practice job, visa, or academic interviews with advanced artificial intelligence technology.
            Get real-time feedback, improve your communication skills, and boost your confidence
            before the real interview.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900">
              <Link href="/interview">Tomar Entrevista</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(5%, 5%) scale(1.05);
            opacity: 0.3;
          }
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
