"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";

export default function ProfileOverviewPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const [hasDocument] = useState(true);
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
              Start your interview practice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
