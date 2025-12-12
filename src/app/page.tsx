import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">InterviewLabs AI</h1>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            InterviewLabs AI
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Entrena para tus entrevistas con un agente de voz inteligente.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Comenzar</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
