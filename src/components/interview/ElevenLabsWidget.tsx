"use client";

import { useEffect, useRef } from "react";

interface ElevenLabsWidgetProps {
  agentId: string;
}

export function ElevenLabsWidget({ agentId }: ElevenLabsWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Crear el custom element después de que se monte el componente
    if (widgetRef.current && !widgetRef.current.querySelector('elevenlabs-convai')) {
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', agentId);
      widgetRef.current.appendChild(widget);

      console.log("ElevenLabs Widget mounted with agent ID:", agentId);
    }

    return () => {
      // Limpiar el widget al desmontar
      if (widgetRef.current) {
        widgetRef.current.innerHTML = '';
      }
    };
  }, [agentId]);

  return <div ref={widgetRef} className="w-full min-h-[300px]" />;
}
