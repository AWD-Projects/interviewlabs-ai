import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProfileCardProps {
  id: string;
  title: string;
  type: string;
  description?: string;
}

export function ProfileCard({ id, title, type, description }: ProfileCardProps) {
  return (
    <Card className="group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-2 line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {type}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full group/button">
          <Link href={`/app/profile/${id}/overview`} className="gap-2">
            View Profile
            <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
