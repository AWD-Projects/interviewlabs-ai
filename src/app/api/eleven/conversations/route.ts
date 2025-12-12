export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY is missing" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.elevenlabs.io/v1/convai/conversations", {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ElevenLabs conversations fetch failed:", response.status, data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversations from ElevenLabs:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
