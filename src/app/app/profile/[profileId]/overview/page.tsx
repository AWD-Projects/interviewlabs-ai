import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ProfileOverviewPageProps {
  params: Promise<{ profileId: string }>;
}

export default async function ProfileOverviewPage({ params }: ProfileOverviewPageProps) {
  const { profileId } = await params;

  // Mock data - TODO: replace with real data from Firestore
  const mockProfile = {
    id: profileId,
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
              Start practicing or review your progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href={`/app/profile/${profileId}/interview`}>
                Practice Interview
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/app/profile/${profileId}/progress`}>
                View Progress
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
