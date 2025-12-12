export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const agentId = process.env.ELEVENLABS_AGENT_ID || "agent_4401kc7zt9xeenqt8tte6qrd683j";
    if (!apiKey) {
      return NextResponse.json({ error: "ELEVENLABS_API_KEY is missing" }, { status: 500 });
    }

    const upstream = new FormData();
    upstream.append("file", file, file.name);
    upstream.append("agent_id", agentId);

    const response = await fetch("https://api.elevenlabs.io/v1/convai/knowledge-base/file", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: upstream,
    });

    const text = await response.text();
    // Try to parse JSON, fallback to text for better error visibility
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      console.error("ElevenLabs upload failed:", response.status, data);
      return NextResponse.json(data, { status: response.status });
    }

    // Optionally update the agent's knowledge base with the new document
    if (data?.id) {
      try {
        const updateRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
          method: "PATCH",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationConfig: {
              agent: {
                prompt: {
                  knowledgeBase: [
                    {
                      type: "text",
                      name: data.name ?? "Document",
                      id: data.id,
                    },
                  ],
                },
              },
            },
          }),
        });

        const updateText = await updateRes.text();
        let updateData: any;
        try {
          updateData = JSON.parse(updateText);
        } catch {
          updateData = { message: updateText };
        }

        if (!updateRes.ok) {
          console.error("ElevenLabs agent update failed:", updateRes.status, updateData);
          return NextResponse.json(
            { upload: data, agentUpdate: updateData, error: "Agent update failed" },
            { status: updateRes.status }
          );
        }

        return NextResponse.json({ upload: data, agentUpdate: updateData }, { status: 200 });
      } catch (err) {
        console.error("Error updating agent after upload:", err);
        return NextResponse.json({ upload: data, error: "Agent update threw an exception" }, { status: 500 });
      }
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error uploading file to ElevenLabs:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
