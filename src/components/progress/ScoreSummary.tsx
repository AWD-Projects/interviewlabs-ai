import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreSummaryProps {
  currentScore: number;
  trend?: "up" | "down" | "stable";
  maxScore?: number;
}

export function ScoreSummary({ 
  currentScore, 
  trend = "stable", 
  maxScore = 100 
}: ScoreSummaryProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Actual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{currentScore}</span>
          <span className="text-2xl text-muted-foreground">/ {maxScore}</span>
          <span className={`ml-2 text-2xl ${getTrendColor()}`}>
            {getTrendIcon()}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {trend === "up" && "¡Mejorando! Sigue así."}
          {trend === "down" && "Necesitas más práctica."}
          {trend === "stable" && "Rendimiento estable."}
        </p>
      </CardContent>
    </Card>
  );
}
