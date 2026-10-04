import Link from "next/link";
import { Trophy, Calendar, Users, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";
import type { TournamentWithSportVenue } from "@/types/tournament";

interface TournamentCardProps {
  tournament: TournamentWithSportVenue;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const statusVariant =
    tournament.status === "ongoing"
      ? "success"
      : tournament.status === "upcoming"
      ? "default"
      : "secondary";

  return (
    <Card className="flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant={statusVariant} className="capitalize">
            {tournament.status}
          </Badge>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {tournament.format.replace("+", " & ")}
          </span>
        </div>
        <CardTitle className="text-lg font-bold leading-tight mt-2 text-foreground line-clamp-1">
          {tournament.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary shrink-0" />
          <span>{tournament.sport?.name || "Multi-sport"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>
            {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
          </span>
        </div>
        {tournament.venue && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="line-clamp-1">{tournament.venue.name}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>Max {tournament.max_teams} Teams</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/tournaments/${tournament.id}`} className="flex items-center justify-center gap-1.5">
            <span>View Tournament</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
