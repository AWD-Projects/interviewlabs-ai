import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ProfileOverviewPageProps {
  params: Promise<{ profileId: string }>;
}

export default async function ProfileOverviewPage({ params }: ProfileOverviewPageProps) {
  const { profileId } = await params;

  // Mock data - TODO: reemplazar con datos reales de Firestore
  const mockProfile = {
    id: profileId,
    name: "Entrevista de Trabajo - Software Engineer",
    type: "Job Interview",
    language: "Inglés",
    level: "Avanzado",
    description: "Preparación para entrevista técnica en empresa FAANG",
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
            <CardTitle>Detalles del Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo:</span>
              <span className="font-medium">{mockProfile.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Idioma:</span>
              <span className="font-medium">{mockProfile.language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nivel:</span>
              <span className="font-medium">{mockProfile.level}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Comienza a practicar o revisa tu progreso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href={`/app/profile/${profileId}/interview`}>
                Practicar entrevista
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/app/profile/${profileId}/progress`}>
                Ver progreso
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
