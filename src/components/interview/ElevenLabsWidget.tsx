"use client";

import { useEffect, useRef } from "react";

// Declarar el custom element para TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": {
        "agent-id": string;
        children?: React.ReactNode;
      };
    }
  }
}

interface ElevenLabsWidgetProps {
  agentId: string;
}

export function ElevenLabsWidget({ agentId }: ElevenLabsWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Asegurar que el widget se cargue correctamente
    console.log("ElevenLabs Widget mounted with agent ID:", agentId);
  }, [agentId]);

  return (
    <div ref={widgetRef} className="w-full">
      <elevenlabs-convai agent-id={agentId} />
    </div>
  );
}