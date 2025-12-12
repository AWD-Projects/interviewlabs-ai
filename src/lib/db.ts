import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/server";
import { Evaluation, InterviewProfile, InterviewSession } from "@/lib/types";

function toDate(value: Timestamp | Date | undefined, fallback?: Date): Date {
  if (value instanceof Timestamp) return value.toDate();
  if (value) return value;
  return fallback ?? new Date();
}

function toOptionalDate(value: Timestamp | Date | undefined): Date | undefined {
  if (!value) return undefined;
  return value instanceof Timestamp ? value.toDate() : value;
}

export async function createProfile(
  userId: string,
  data: {
    title: string;
    type: "job" | "visa" | "admission" | "custom";
    language: "es" | "en";
    level?: "junior" | "mid" | "senior";
    elevenAgentId?: string;
  }
): Promise<InterviewProfile> {
  try {
    if (!adminDb) {
      console.warn("Admin DB not initialized. Returning mock profile.");
      return {
        id: "",
        userId,
        title: data.title,
        type: data.type,
        language: data.language,
        level: data.level,
        elevenAgentId: data.elevenAgentId,
        createdAt: new Date(),
      };
    }
    const docRef = adminDb.collection("interviewProfiles").doc();
    const createdAt = new Date();
    const payload = { ...data, userId, createdAt };
    await docRef.set(payload);
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error("Error creating profile:", error);
    return {
      id: "",
      userId,
      title: data.title,
      type: data.type,
      language: data.language,
      level: data.level,
      elevenAgentId: data.elevenAgentId,
      createdAt: new Date(),
    };
  }
}

export async function getProfilesByUser(userId: string): Promise<InterviewProfile[]> {
  try {
    if (!adminDb) {
      console.warn("Admin DB not initialized. Returning empty profiles list.");
      return [];
    }
    const snapshot = await adminDb.collection("interviewProfiles").where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        type: data.type,
        language: data.language,
        level: data.level,
        elevenAgentId: data.elevenAgentId,
        elevenDatasetId: data.elevenDatasetId,
        createdAt: toDate(data.createdAt),
      } as InterviewProfile;
    });
  } catch (error) {
    console.error("Error fetching profiles by user:", error);
    return [];
  }
}

export async function createSession(userId: string, profileId: string): Promise<InterviewSession> {
  try {
    if (!adminDb) {
      console.warn("Admin DB not initialized. Returning mock session.");
      return {
        id: "",
        userId,
        profileId,
        status: "in_progress",
        startedAt: new Date(),
      };
    }
    const docRef = adminDb.collection("sessions").doc();
    const startedAt = new Date();
    const payload: Omit<InterviewSession, "id"> = {
      userId,
      profileId,
      status: "in_progress",
      startedAt,
    };
    await docRef.set(payload);
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error("Error creating session:", error);
    return {
      id: "",
      userId,
      profileId,
      status: "failed",
      startedAt: new Date(),
    };
  }
}

export async function updateSessionAfterSync(
  sessionId: string,
  update: {
    status?: "completed" | "failed";
    conversationId?: string;
    durationSecs?: number;
    endedAt?: Date;
    audioUrl?: string;
  }
): Promise<void> {
  try {
    if (!adminDb) {
      console.warn("Admin DB not initialized. Skipping session update.");
      return;
    }
    const endedAt = update.endedAt ?? (update.status ? new Date() : undefined);
    await adminDb
      .collection("sessions")
      .doc(sessionId)
      .set(
        {
          ...update,
          endedAt,
        },
        { merge: true }
      );
  } catch (error) {
    console.error("Error updating session after sync:", error);
  }
}

export async function saveEvaluation(data: {
  sessionId: string;
  userId: string;
  profileId: string;
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}): Promise<Evaluation> {
  try {
    if (!adminDb) {
      console.warn("Admin DB not initialized. Returning mock evaluation.");
      return {
        id: "",
        ...data,
        createdAt: new Date(),
      };
    }
    const docRef = adminDb.collection("evaluations").doc();
    const createdAt = new Date();
    const payload = { ...data, createdAt };
    await docRef.set(payload);
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error("Error saving evaluation:", error);
    return {
      id: "",
      ...data,
      createdAt: new Date(),
    };
  }
}

export async function getEvaluationsByProfile(userId: string, profileId: string): Promise<Evaluation[]> {
  try {
    if (!adminDb) {
      console.warn("Admin DB not initialized. Returning empty evaluations list.");
      return [];
    }
    const snapshot = await adminDb
      .collection("evaluations")
      .where("userId", "==", userId)
      .where("profileId", "==", profileId)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        sessionId: data.sessionId,
        userId: data.userId,
        profileId: data.profileId,
        overallScore: data.overallScore,
        summary: data.summary,
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        createdAt: toDate(data.createdAt),
      } as Evaluation;
    });
  } catch (error) {
    console.error("Error fetching evaluations by profile:", error);
    return [];
  }
}

export async function getSessionsByProfile(userId: string, profileId: string): Promise<InterviewSession[]> {
  try {
    if (!adminDb) {
      console.warn("Admin DB not initialized. Returning empty sessions list.");
      return [];
    }
    const snapshot = await adminDb
      .collection("sessions")
      .where("userId", "==", userId)
      .where("profileId", "==", profileId)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        profileId: data.profileId,
        status: data.status,
        conversationId: data.conversationId,
        startedAt: toDate(data.startedAt),
        endedAt: toOptionalDate(data.endedAt),
        durationSecs: data.durationSecs,
        audioUrl: data.audioUrl,
      } as InterviewSession;
    });
  } catch (error) {
    console.error("Error fetching sessions by profile:", error);
    return [];
  }
}
