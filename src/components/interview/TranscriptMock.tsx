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
      content: "Hello, welcome to your practice interview. Are you ready to begin?",
      timestamp: "10:00 AM",
    },
    {
      role: "user",
      content: "Yes, I'm ready. Thank you.",
      timestamp: "10:00 AM",
    },
    {
      role: "agent",
      content: "Perfect. Tell me about your most recent experience in software development.",
      timestamp: "10:01 AM",
    },
    {
      role: "user",
      content: "I've worked for the past 3 years as a full-stack developer at a startup...",
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
