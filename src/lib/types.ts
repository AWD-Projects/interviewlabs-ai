export interface InterviewProfile {
  id: string;
  userId: string;
  title: string;
  type: "job" | "visa" | "admission" | "custom";
  language: "es" | "en";
  level?: "junior" | "mid" | "senior";
  elevenAgentId?: string;
  elevenDatasetId?: string;
  createdAt: Date;
}

export interface InterviewSession {
  id: string;
  userId: string;
  profileId: string;
  status: "in_progress" | "completed" | "failed";
  conversationId?: string;
  startedAt: Date;
  endedAt?: Date;
  durationSecs?: number;
  audioUrl?: string;
}

export interface Evaluation {
  id: string;
  sessionId: string;
  userId: string;
  profileId: string;
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  createdAt: Date;
}
