import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ProfileCardProps {
  id: string;
  title: string;
  type: string;
  description?: string;
}

export function ProfileCard({ id, title, type, description }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {type}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={`/app/profile/${id}/overview`}>Ver perfil</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
