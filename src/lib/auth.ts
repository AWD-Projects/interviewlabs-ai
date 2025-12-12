import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/server";

export interface AuthUser {
  uid: string;
  email?: string | null;
}

export async function getCurrentUserServer(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("session")?.value || cookieStore.get("token")?.value || cookieStore.get("idToken")?.value;

    if (!token) {
      // TODO: reemplazar mock por verificación real de token en producción.
      return {
        uid: "mock-user",
        email: "mock@example.com",
      };
    }

    if (!adminAuth) {
      console.warn("Admin auth not initialized; returning mock user.");
      return {
        uid: "mock-user",
        email: "mock@example.com",
      };
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error) {
    console.error("Error verifying auth token:", error);
    // TODO: reemplazar mock por verificación real de token en producción.
    return {
      uid: "mock-user",
      email: "mock@example.com",
    };
  }
}
