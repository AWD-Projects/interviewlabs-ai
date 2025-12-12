interface TranscriptMessage {
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

interface TranscriptMockProps {
  messages?: TranscriptMessage[];
}

export function TranscriptMock({ messages }: TranscriptMockProps) {
  // Mock messages if none provided
  const defaultMessages: TranscriptMessage[] = [
    {
      role: "agent",
      content: "Hola, bienvenido a tu entrevista de práctica. ¿Estás listo para comenzar?",
      timestamp: "10:00 AM",
    },
    {
      role: "user",
      content: "Sí, estoy listo. Gracias.",
      timestamp: "10:00 AM",
    },
    {
      role: "agent",
      content: "Perfecto. Cuéntame sobre tu experiencia más reciente en desarrollo de software.",
      timestamp: "10:01 AM",
    },
    {
      role: "user",
      content: "He trabajado los últimos 3 años como desarrollador full-stack en una startup...",
      timestamp: "10:01 AM",
    },
  ];

  const displayMessages = messages || defaultMessages;

  return (
    <div className="space-y-4">
      {displayMessages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <p className="mt-1 text-xs opacity-70">{message.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
