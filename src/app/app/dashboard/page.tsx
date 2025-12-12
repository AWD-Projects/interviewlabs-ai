"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ProfileCard } from "@/components/profiles/ProfileCard";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";

export default function DashboardPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [profiles, setProfiles] = useState<
    { id: string; title: string; type: string; description?: string }[]
  >([]);
  const [title, setTitle] = useState("Visa USA B1/B2");
  const [description, setDescription] = useState("Explica brevemente de qué trata la práctica.");
  const [language, setLanguage] = useState<"es" | "en">("es");
  const [isUploading, setIsUploading] = useState(false);
  const [hasDocument, setHasDocument] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        void fetchProfiles(u.uid);
      } else {
        setProfiles([]);
      }
    });
    return () => unsub();
  }, []);

  const fetchProfiles = async (uid: string) => {
    try {
      const q = query(collection(firestore, "interviewProfiles"), where("userId", "==", uid));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || "Sin título",
          type: data.type || "custom",
          description: data.description || (data.language ? `Idioma: ${data.language}` : ""),
        };
      });
      setProfiles(list);
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setError("No se pudieron cargar los perfiles.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      setError("Debes iniciar sesión para subir documentos.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const res = await fetch("/api/eleven/knowledge-base", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      setHasDocument(true);
    } catch (err) {
      console.error("Error uploading document:", err);
      setError("No se pudo subir el documento. Intenta de nuevo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCreateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setError("Debes iniciar sesión para crear un perfil.");
      return;
    }
    setError(null);
    setIsCreating(true);
    try {
      const docRef = doc(collection(firestore, "interviewProfiles"));
      await setDoc(docRef, {
        id: docRef.id,
        userId: user.uid,
        title: title || "Nuevo perfil",
        description: description || "",
        type: "custom",
        language,
        createdAt: serverTimestamp(),
      });
      console.log("Created profile:", docRef.id);
      // Reset some fields after creation
      setTitle("Visa USA B1/B2");
      setDescription("Explica brevemente de qué trata la práctica.");
      setLanguage("es");
      setHasDocument(false);
      await fetchProfiles(user.uid);
    } catch (err) {
      console.error("Error creating profile:", err);
      setError("No se pudo crear el perfil. Intenta de nuevo.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with minimalist gradient */}
      <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 p-8">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Your Interview Profiles
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
            Select a profile to start practicing or create a new one
          </p>
          <form onSubmit={handleCreateProfile} className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="grid gap-3 md:grid-cols-3">
              <input
                className="rounded-md border px-3 py-2 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title of the interview practice"
                required
              />
              <textarea
                className="rounded-md border px-3 py-2 text-sm md:col-span-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description of the interview practice"
                required
              />
              <select
                className="rounded-md border px-3 py-2 text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value as typeof language)}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
              <Button
                type="button"
                variant="outline"
                className="gap-2 md:col-span-1"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : hasDocument ? "Document Uploaded" : "Upload Document"}
              </Button>
            </div>
            <Button
              type="submit"
              disabled={isCreating || !hasDocument}
              className="gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900"
            >
              <Plus className="h-4 w-4" />
              {isCreating ? "Creating..." : "Create New Interview Practice"}
            </Button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </form>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-cyan-50/30 to-transparent dark:from-cyan-950/10" />
      </div>

      {/* Profiles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            id={profile.id}
            title={profile.title}
            type={profile.type}
            description={profile.description}
          />
        ))}
      </div>
      {profiles.length === 0 && (
        <p className="text-sm text-muted-foreground">No profiles yet. Create your first interview practice above.</p>
      )}
    </div>
  );
}
