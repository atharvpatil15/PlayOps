import Link from "next/link";
import { Trophy, Calendar, Users, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { TournamentWithSportVenue } from "@/types/tournament";

interface TournamentCardProps {
  tournament: TournamentWithSportVenue;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const isOngoing = tournament.status === "ongoing";
  const isUpcoming = tournament.status === "upcoming";

  const statusVariant = isOngoing ? "success" : isUpcoming ? "default" : "secondary";

  return (
    <Card className="flex flex-col justify-between overflow-hidden border border-border bg-card transition-colors duration-150 hover:border-foreground/40">
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-2">
          <Badge variant={statusVariant} className="text-[10px] uppercase font-medium">
            {tournament.status}
          </Badge>
          <span className="text-[11px] text-muted-foreground uppercase font-medium">
            {tournament.format.replace("+", " & ")}
          </span>
        </div>
        <CardTitle className="mt-2 line-clamp-1 font-serif text-lg font-medium text-foreground">
          {tournament.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Trophy className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium text-foreground">{tournament.sport?.name || "Multi-sport"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>
            {formatDate(tournament.start_date)} – {formatDate(tournament.end_date)}
          </span>
        </div>
        {tournament.venue && (
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="line-clamp-1">{tournament.venue.name}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>Max {tournament.max_teams} Teams</span>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border pt-3">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link
            href={`/tournaments/${tournament.id}`}
            className="flex items-center justify-center gap-1.5"
          >
            <span>View Tournament Bracket</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
