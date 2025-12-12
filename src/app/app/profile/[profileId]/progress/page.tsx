"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreSummary } from "@/components/progress/ScoreSummary";

interface Conversation {
  conversation_id: string;
  agent_id: string;
  status: string;
  metadata?: {
    [key: string]: any;
  };
  created_at: string;
  updated_at?: string;
}

interface ConversationsResponse {
  conversations: Conversation[];
  has_more: boolean;
  last_conversation_id?: string;
}

interface SentimentResult {
  text: string;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  confidence: number;
  speaker?: string;
}

interface AnalysisResult {
  transcript_id: string;
  text?: string;
  sentiment_analysis?: SentimentResult[];
}

export default function ProgressPage() {
  const params = useParams();
  const profileId = params.profileId as string;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzingMap, setAnalyzingMap] = useState<Record<string, boolean>>({});
  const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult>>({});

  // TODO: reemplazar datos mock por lecturas reales desde Firestore
  const mockData = {
    currentScore: 82,
    trend: "up" as const,
    chartData: [
      { session: 1, score: 65 },
      { session: 2, score: 70 },
      { session: 3, score: 75 },
      { session: 4, score: 78 },
      { session: 5, score: 82 },
    ],
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/eleven/conversations");

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data: ConversationsResponse = await response.json();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(err instanceof Error ? err.message : "Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleAnalyzeEmotions = async (conversationId: string) => {
    try {
      setAnalyzingMap((prev) => ({ ...prev, [conversationId]: true }));

      const response = await fetch(
        `/api/eleven/conversations/${conversationId}/analyze`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze conversation");
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResults((prev) => ({ ...prev, [conversationId]: data }));
    } catch (err) {
      console.error("Error analyzing conversation:", err);
      alert(err instanceof Error ? err.message : "Failed to analyze emotions");
    } finally {
      setAnalyzingMap((prev) => ({ ...prev, [conversationId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
        <p className="text-muted-foreground">
          Review your performance and continuous improvement
        </p>
      </div>

      {/* Score Summary */}
      <ScoreSummary currentScore={mockData.currentScore} trend={mockData.trend} />

      {/* Recent Conversations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
          <CardDescription>Your interview sessions from ElevenLabs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading conversations...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No conversations yet. Start your first interview!</p>
          ) : (
            <div className="space-y-4">
              {conversations.slice(0, 5).map((conversation) => (
                <div
                  key={conversation.conversation_id}
                  className="rounded-lg border p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">
                        {new Date(conversation.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {conversation.status}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {conversation.conversation_id.slice(0, 20)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        conversation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        conversation.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {conversation.status}
                      </span>
                    </div>
                  </div>

                  {/* Audio Player */}
                  <div className="w-full">
                    <audio
                      controls
                      preload="metadata"
                      className="w-full"
                      style={{ height: '40px' }}
                    >
                      <source
                        src={`/api/eleven/conversations/${conversation.conversation_id}/audio`}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                  {/* Analyze Emotions Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleAnalyzeEmotions(conversation.conversation_id)}
                      disabled={analyzingMap[conversation.conversation_id]}
                      size="sm"
                      variant="outline"
                    >
                      {analyzingMap[conversation.conversation_id]
                        ? "Analyzing..."
                        : "Analyze Emotions"}
                    </Button>
                  </div>

                  {/* Analysis Results */}
                  {analysisResults[conversation.conversation_id] && (
                    <div className="mt-4 space-y-3 rounded-lg bg-muted/50 p-4">
                      <h4 className="font-semibold text-sm">Emotion Analysis Results</h4>

                      {analysisResults[conversation.conversation_id].text && (
                        <div className="text-sm">
                          <p className="font-medium mb-2">Transcript:</p>
                          <p className="text-muted-foreground italic">
                            {analysisResults[conversation.conversation_id].text}
                          </p>
                        </div>
                      )}

                      {analysisResults[conversation.conversation_id].sentiment_analysis &&
                       analysisResults[conversation.conversation_id].sentiment_analysis!.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-medium text-sm">Sentiment Analysis:</p>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {analysisResults[conversation.conversation_id].sentiment_analysis!.map(
                              (segment, idx) => (
                                <div
                                  key={idx}
                                  className="rounded border p-2 text-xs"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                        segment.sentiment === "POSITIVE"
                                          ? "bg-green-100 text-green-800"
                                          : segment.sentiment === "NEGATIVE"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {segment.sentiment}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {(segment.confidence * 100).toFixed(1)}% confident
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground">{segment.text}</p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Chart - Simple Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Score Evolution</CardTitle>
          <CardDescription>Last 5 sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.chartData.map((data) => (
              <div key={data.session} className="flex items-center gap-4">
                <span className="w-20 text-sm text-muted-foreground">
                  Session {data.session}
                </span>
                <div className="flex-1">
                  <div className="h-8 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right font-medium">{data.score}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
