"use server";

import { getCurrentUserServer } from "@/lib/auth";
import { createProfile, getProfilesByUser } from "@/lib/db";
import { InterviewProfile } from "@/lib/types";

export async function createProfileAction(formData: FormData) {
  try {
    const user = await getCurrentUserServer();
    if (!user) {
      console.error("createProfileAction: user not found");
      return null;
    }

    const payload = {
      title: (formData.get("title") as string) || "Nuevo perfil",
      type: (formData.get("type") as InterviewProfile["type"]) || "custom",
      language: (formData.get("language") as InterviewProfile["language"]) || "es",
      level: (formData.get("level") as InterviewProfile["level"]) || undefined,
      elevenAgentId: (formData.get("elevenAgentId") as string) || undefined,
    };

    return await createProfile(user.uid, payload);
  } catch (error) {
    console.error("Error in createProfileAction:", error);
    return null;
  }
}

export async function getProfilesAction() {
  try {
    const user = await getCurrentUserServer();
    if (!user) {
      console.error("getProfilesAction: user not found");
      return [];
    }
    return await getProfilesByUser(user.uid);
  } catch (error) {
    console.error("Error in getProfilesAction:", error);
    return [];
  }
}

// Ejemplo de uso en un componente cliente:
// const action = useActionState(createProfileAction, initialState);
// <form action={createProfileAction}>...</form>
//
// Ejemplo de uso en un server component:
// const profiles = await getProfilesAction();
