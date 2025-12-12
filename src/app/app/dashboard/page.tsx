import { ProfileCard } from "@/components/profiles/ProfileCard";

// Mock data - TODO: reemplazar con datos reales de Firestore
const mockProfiles = [
  {
    id: "mock-profile-1",
    title: "Entrevista de Trabajo - Software Engineer",
    type: "Job Interview",
    description: "Preparación para entrevista técnica en empresa FAANG",
  },
  {
    id: "mock-profile-2",
    title: "Entrevista de Visa H1-B",
    type: "Visa Interview",
    description: "Práctica para entrevista consular",
  },
  {
    id: "mock-profile-3",
    title: "Entrevista MBA - Harvard",
    type: "Academic Interview",
    description: "Preparación para entrevista de admisión",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Tus perfiles de entrevista
        </h1>
        <p className="text-muted-foreground">
          Selecciona un perfil para comenzar a practicar
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
