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
        <CardTitle>Current Score</CardTitle>
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
          {trend === "up" && "Improving! Keep it up."}
          {trend === "down" && "You need more practice."}
          {trend === "stable" && "Stable performance."}
        </p>
      </CardContent>
    </Card>
  );
}
