import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreSummary } from "@/components/progress/ScoreSummary";

interface ProgressPageProps {
  params: Promise<{ profileId: string }>;
}

export default async function ProgressPage({ params }: ProgressPageProps) {
  const { profileId } = await params;

  // TODO: reemplazar datos mock por lecturas reales desde Firestore
  const mockData = {
    currentScore: 82,
    trend: "up" as const,
    recentSessions: [
      { id: 1, date: "2024-12-10", score: 82, duration: "15 min" },
      { id: 2, date: "2024-12-08", score: 78, duration: "12 min" },
      { id: 3, date: "2024-12-05", score: 75, duration: "18 min" },
    ],
    chartData: [
      { session: 1, score: 65 },
      { session: 2, score: 70 },
      { session: 3, score: 75 },
      { session: 4, score: 78 },
      { session: 5, score: 82 },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tu Progreso</h1>
        <p className="text-muted-foreground">
          Revisa tu desempeño y mejora continua
        </p>
      </div>

      {/* Score Summary */}
      <ScoreSummary currentScore={mockData.currentScore} trend={mockData.trend} />

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Sesiones</CardTitle>
          <CardDescription>Tus 3 sesiones más recientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{session.date}</p>
                  <p className="text-sm text-muted-foreground">
                    Duración: {session.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{session.score}</p>
                  <p className="text-sm text-muted-foreground">/ 100</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Chart - Simple Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución del Score</CardTitle>
          <CardDescription>Últimas 5 sesiones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.chartData.map((data) => (
              <div key={data.session} className="flex items-center gap-4">
                <span className="w-20 text-sm text-muted-foreground">
                  Sesión {data.session}
                </span>
                <div className="flex-1">
                  <div className="h-8 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right font-medium">{data.score}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
