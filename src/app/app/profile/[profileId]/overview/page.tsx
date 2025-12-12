"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";

export default function ProfileOverviewPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const [hasDocument, setHasDocument] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // Mock data - TODO: replace with real data from Firestore
  const mockProfile = {
    id: profileId ?? "unknown",
    name: "Job Interview - Software Engineer",
    type: "Job Interview",
    language: "English",
    level: "Advanced",
    description: "Preparation for technical interview at FAANG company",
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profileId) return;

    const user = auth.currentUser;
    if (!user) {
      setUploadError("Debes iniciar sesión para subir documentos.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("profileId", profileId);

      const res = await fetch("/api/eleven/knowledge-base", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      setHasDocument(true);
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadError("No se pudo subir el documento. Intenta de nuevo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{mockProfile.name}</h1>
        <p className="text-muted-foreground">{mockProfile.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{mockProfile.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Language:</span>
              <span className="font-medium">{mockProfile.language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Level:</span>
              <span className="font-medium">{mockProfile.level}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Upload supporting docs first, then start your interview practice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Documents"}
            </Button>
            <Button
              className="w-full"
              disabled={!hasDocument}
              aria-disabled={!hasDocument}
              onClick={() => {
                if (!hasDocument || !profileId) return;
                router.push(`/app/profile/${profileId}/interview`);
              }}
            >
              Practice Interview
            </Button>
            {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}
            {!hasDocument ? (
              <p className="text-xs text-muted-foreground">
                Practice is disabled until you upload at least one document.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
