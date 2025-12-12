export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60 seconds for the analysis

import { NextRequest, NextResponse } from "next/server";

interface AssemblyAITranscriptResponse {
  id: string;
  status: "queued" | "processing" | "completed" | "error";
  text?: string;
  sentiment_analysis_results?: Array<{
    text: string;
    sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
    confidence: number;
    speaker?: string;
  }>;
  error?: string;
}

async function pollTranscript(
  transcriptId: string,
  apiKey: string,
  maxAttempts = 60
): Promise<AssemblyAITranscriptResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    const data: AssemblyAITranscriptResponse = await response.json();

    if (data.status === "completed" || data.status === "error") {
      return data;
    }

    // Wait 1 second before next poll
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error("Transcript processing timeout");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const assemblyAIKey = process.env.ASSEMBLYAI_API_KEY;
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

    if (!assemblyAIKey) {
      return NextResponse.json(
        { error: "ASSEMBLYAI_API_KEY is missing" },
        { status: 500 }
      );
    }

    if (!elevenLabsKey) {
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

    console.log("Fetching audio from ElevenLabs for conversation:", conversationId);

    // Step 1: Download audio from ElevenLabs
    const audioResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}/audio`,
      {
        headers: {
          "xi-api-key": elevenLabsKey,
        },
      }
    );

    if (!audioResponse.ok) {
      const errorText = await audioResponse.text();
      console.error("Failed to fetch audio from ElevenLabs:", audioResponse.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch audio from ElevenLabs" },
        { status: audioResponse.status }
      );
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    console.log("Audio downloaded, size:", audioBuffer.byteLength, "bytes");

    // Step 2: Upload audio to AssemblyAI
    const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        Authorization: assemblyAIKey,
      },
      body: audioBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("AssemblyAI upload failed:", uploadResponse.status, errorText);
      return NextResponse.json(
        { error: "Failed to upload audio to AssemblyAI" },
        { status: uploadResponse.status }
      );
    }

    const uploadData: { upload_url: string } = await uploadResponse.json();
    console.log("Audio uploaded to AssemblyAI:", uploadData.upload_url);

    // Step 3: Submit the uploaded audio for transcription
    const submitResponse = await fetch(
      "https://api.assemblyai.com/v2/transcript",
      {
        method: "POST",
        headers: {
          Authorization: assemblyAIKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio_url: uploadData.upload_url,
          sentiment_analysis: true,
        }),
      }
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error("AssemblyAI submission failed:", submitResponse.status, errorText);
      return NextResponse.json(
        { error: errorText || "Failed to submit audio for analysis" },
        { status: submitResponse.status }
      );
    }

    const submitData: AssemblyAITranscriptResponse = await submitResponse.json();
    console.log("Transcript ID:", submitData.id);

    // Step 4: Poll for completion
    const result = await pollTranscript(submitData.id, assemblyAIKey);

    if (result.status === "error") {
      return NextResponse.json(
        { error: result.error || "Transcript processing failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        transcript_id: result.id,
        text: result.text,
        sentiment_analysis: result.sentiment_analysis_results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error analyzing audio with AssemblyAI:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to analyze audio",
      },
      { status: 500 }
    );
  }
}
