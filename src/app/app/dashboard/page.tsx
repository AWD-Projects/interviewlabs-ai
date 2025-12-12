import { ProfileCard } from "@/components/profiles/ProfileCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Mock data - TODO: replace with real data from Firestore
const mockProfiles = [
  {
    id: "mock-profile-1",
    title: "Job Interview - Software Engineer",
    type: "Job Interview",
    description: "Preparation for technical interview at FAANG company",
  },
  {
    id: "mock-profile-2",
    title: "H1-B Visa Interview",
    type: "Visa Interview",
    description: "Practice for consular interview",
  },
  {
    id: "mock-profile-3",
    title: "MBA Interview - Harvard",
    type: "Academic Interview",
    description: "Preparation for admission interview",
  },
];

export default function DashboardPage() {
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
          <Button className="gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900">
            <Plus className="h-4 w-4" />
            Create New Profile
          </Button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-cyan-50/30 to-transparent dark:from-cyan-950/10" />
      </div>

      {/* Profiles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockProfiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            id={profile.id}
            title={profile.title}
            type={profile.type}
            description={profile.description}
          />
        ))}
      </div>
    </div>
  );
}
