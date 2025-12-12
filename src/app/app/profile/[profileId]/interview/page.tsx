"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TranscriptMock } from "@/components/interview/TranscriptMock";
import { useParams, useRouter } from "next/navigation";

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.profileId as string;

  const handleStartInterview = () => {
    console.log("Starting interview...");
    // TODO: aquí se integrará el widget / cliente del Agent de ElevenLabs
  };

  const handleEndInterview = () => {
    console.log("Ending interview...");
    // TODO: al terminar la entrevista tendremos un conversationId para sincronizar datos
    router.push(`/app/profile/${profileId}/progress`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sesión de Entrevista</h1>
        <p className="text-muted-foreground">
          Practica tu entrevista con nuestro agente de voz inteligente
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Interview Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Panel de Entrevista</CardTitle>
              <CardDescription>
                Controla tu sesión de práctica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border-2 border-dashed p-6 text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                  El widget de ElevenLabs se cargará aquí
                </p>
                {/* TODO: aquí se integrará el widget / cliente del Agent de ElevenLabs */}
                <div id="eleven-agent-widget-root" className="min-h-[200px] flex items-center justify-center bg-muted/50 rounded">
                  <p className="text-muted-foreground">Widget Placeholder</p>
                </div>
              </div>

              <Button onClick={handleStartInterview} className="w-full" size="lg">
                Iniciar Entrevista
              </Button>

              <Button
                onClick={handleEndInterview}
                variant="outline"
                className="w-full"
              >
                Terminar Entrevista (mock)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Transcript */}
        <div className="space-y-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Transcripción</CardTitle>
              <CardDescription>
                Conversación en tiempo real (mock)
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              <TranscriptMock />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
