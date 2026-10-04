import Link from "next/link";
import { Clock, MapPin, Radio } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils/format";
import type { MatchWithTeams } from "@/types/match";

interface MatchCardProps {
  match: MatchWithTeams;
  isLive?: boolean;
}

export function MatchCard({ match, isLive }: MatchCardProps) {
  const isMatchLive = isLive || match.status === "live";

  return (
    <Card className="overflow-hidden transition-colors hover:border-primary/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/40 p-3">
        <span className="text-xs font-semibold uppercase text-muted-foreground">
          {match.round.replace(/_/g, " ")} • Match #{match.match_number}
        </span>
        {isMatchLive ? (
          <Badge variant="live" className="flex items-center gap-1">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>LIVE</span>
          </Badge>
        ) : (
          <Badge variant={match.status === "completed" ? "secondary" : "outline"}>
            {match.status}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {/* Teams and Scores */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground sm:text-base">
              {match.team_a?.name || "Team A"}
            </span>
            <span className="font-mono text-base font-bold sm:text-lg">
              {match.score_team_a || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground sm:text-base">
              {match.team_b?.name || "Team B"}
            </span>
            <span className="font-mono text-base font-bold sm:text-lg">
              {match.score_team_b || "-"}
            </span>
          </div>
        </div>

        {/* Schedule & Venue Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {formatDate(match.match_date)}{" "}
              {match.start_time ? `• ${formatTime(match.start_time)}` : ""}
            </span>
          </div>
          {match.venue && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{match.venue.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
