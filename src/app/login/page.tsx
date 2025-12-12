"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FormEvent } from "react";

export default function LoginPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Login attempt:", {
      email: formData.get("email"),
      password: formData.get("password"),
    });
    // TODO: integrar Firebase Auth aquí
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Minimalist Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950" />
        <div className="absolute inset-0 animate-gradient-shift bg-gradient-to-tr from-transparent via-cyan-50/30 to-slate-100/30 dark:via-cyan-950/20 dark:to-slate-900/20" />
      </div>

      <Card className="w-full max-w-md border shadow-xl backdrop-blur-sm bg-background/95">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="mb-2 inline-block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              InterviewLabs AI
            </h1>
          </Link>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@email.com"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900">
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-slate-900 dark:text-slate-100 hover:underline">
              Sign up here
            </Link>
          </div>
        </CardContent>
      </Card>

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
