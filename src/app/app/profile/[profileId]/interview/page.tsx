"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TranscriptMock } from "@/components/interview/TranscriptMock";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.profileId as string;

  const handleEndInterview = () => {
    console.log("Ending interview...");
    // TODO: al terminar la entrevista tendremos un conversationId para sincronizar datos
    router.push(`/app/profile/${profileId}/progress`);
  };

  return (
    <>
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        async
        type="text/javascript"
      />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Session</h1>
          <p className="text-muted-foreground">
            Practice your interview with our intelligent voice agent
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Panel - Interview Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Panel</CardTitle>
                <CardDescription>
                  Control your practice session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border-2 border-dashed p-6">
                  <p className="mb-4 text-sm text-muted-foreground text-center">
                    ElevenLabs Voice Agent
                  </p>
                  <div className="min-h-[300px] flex items-center justify-center">
                    <elevenlabs-convai agent-id="agent_4401kc7zt9xeenqt8tte6qrd683j"></elevenlabs-convai>
                  </div>
                </div>

                <Button
                  onClick={handleEndInterview}
                  variant="outline"
                  className="w-full"
                >
                  End Interview
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Transcript */}
          <div className="space-y-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
                <CardDescription>
                  Real-time conversation
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <TranscriptMock />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
