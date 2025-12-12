export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

interface TranscriptMessage {
  role: string;
  time_in_call_secs: number;
  message: string;
}

interface ConversationMetadata {
  start_time_unix_secs: number;
  call_duration_secs: number;
}

interface ConversationResponse {
  agent_id: string;
  conversation_id: string;
  status: string;
  transcript: TranscriptMessage[];
  metadata: ConversationMetadata;
  has_audio: boolean;
  has_user_audio: boolean;
  has_response_audio: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY is missing" },
        { status: 500 }
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "ElevenLabs conversation fetch failed:",
        response.status,
        errorText
      );
      return NextResponse.json(
        { error: errorText || "Failed to fetch conversation" },
        { status: response.status }
      );
    }

    const data: ConversationResponse = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversation from ElevenLabs:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}
