"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface TranscriptMessage {
  role: string;
  time_in_call_secs: number;
  message: string;
}

interface ConversationDetails {
  agent_id: string;
  conversation_id: string;
  status: string;
  transcript: TranscriptMessage[];
  metadata: {
    start_time_unix_secs: number;
    call_duration_secs: number;
  };
  has_audio: boolean;
  has_user_audio: boolean;
  has_response_audio: boolean;
}

export default function ProgressPage() {
  const params = useParams();
  const profileId = params.profileId as string;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzingMap, setAnalyzingMap] = useState<Record<string, boolean>>({});
  const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult>>({});
  const [transcripts, setTranscripts] = useState<Record<string, ConversationDetails>>({});
  const [loadingTranscripts, setLoadingTranscripts] = useState<Record<string, boolean>>({});

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

  const handleFetchTranscript = async (conversationId: string) => {
    try {
      setLoadingTranscripts((prev) => ({ ...prev, [conversationId]: true }));

      const response = await fetch(
        `/api/eleven/conversations/${conversationId}/transcript`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transcript");
      }

      const data: ConversationDetails = await response.json();
      setTranscripts((prev) => ({ ...prev, [conversationId]: data }));
    } catch (err) {
      console.error("Error fetching transcript:", err);
    } finally {
      setLoadingTranscripts((prev) => ({ ...prev, [conversationId]: false }));
    }
  };

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

                  {/* Transcript Section */}
                  {!transcripts[conversation.conversation_id] ? (
                    <div className="flex justify-start">
                      <Button
                        onClick={() => handleFetchTranscript(conversation.conversation_id)}
                        disabled={loadingTranscripts[conversation.conversation_id]}
                        size="sm"
                        variant="outline"
                      >
                        {loadingTranscripts[conversation.conversation_id]
                          ? "Loading transcript..."
                          : "Show Transcript"}
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Conversation Transcript</h4>
                        <Button
                          onClick={() => setTranscripts((prev) => {
                            const newTranscripts = { ...prev };
                            delete newTranscripts[conversation.conversation_id];
                            return newTranscripts;
                          })}
                          size="sm"
                          variant="ghost"
                        >
                          Hide
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <p>Duration: {Math.floor(transcripts[conversation.conversation_id].metadata.call_duration_secs / 60)}m {transcripts[conversation.conversation_id].metadata.call_duration_secs % 60}s</p>
                        <p>Started: {new Date(transcripts[conversation.conversation_id].metadata.start_time_unix_secs * 1000).toLocaleString()}</p>
                      </div>

                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {transcripts[conversation.conversation_id].transcript.map((message, idx) => (
                          <div
                            key={idx}
                            className={`rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-blue-50 border border-blue-200'
                                : 'bg-green-50 border border-green-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold uppercase">
                                {message.role}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {Math.floor(message.time_in_call_secs / 60)}:{String(message.time_in_call_secs % 60).padStart(2, '0')}
                              </span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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

    </div>
  );
}
