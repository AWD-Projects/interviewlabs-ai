"use client";

import Script from "next/script";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InterviewLandingPage() {
    return (
        <>
            <Script
                src="https://unpkg.com/@elevenlabs/convai-widget-embed"
                async
                type="text/javascript"
            />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
                {/* Minimalist Animated Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950" />
                    <div className="absolute inset-0 animate-gradient-shift bg-gradient-to-tr from-transparent via-cyan-50/30 to-slate-100/30 dark:via-cyan-950/20 dark:to-slate-900/20" />
                </div>

                {/* Main Content */}
                <main className="relative z-10 flex flex-1 items-center justify-center">
                    <div className="container mx-auto max-w-5xl px-4 py-16">
                        <div className="text-center mb-8">
                            <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                Entrevista de Práctica
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 md:text-2xl mb-2">
                                Practica con nuestro agente de voz inteligente
                            </p>
                            <p className="text-base text-slate-500 dark:text-slate-500">
                                Powered by ElevenLabs AI
                            </p>
                        </div>

                        {/* ElevenLabs Widget Container */}
                        <div className="max-w-4xl mx-auto">
                            <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 shadow-2xl">
                                <div className="min-h-[500px] flex items-center justify-center">
                                    <elevenlabs-convai agent-id="agent_4401kc7zt9xeenqt8tte6qrd683j"></elevenlabs-convai>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/">Volver al Inicio</Link>
                                </Button>
                            </div>
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
        </>
    );
}
