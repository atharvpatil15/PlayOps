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
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <CardHeader className="bg-muted/40 p-3 flex flex-row items-center justify-between space-y-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase">
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

      <CardContent className="p-4 space-y-4">
        {/* Teams and Scores */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground text-sm sm:text-base">
              {match.team_a?.name || "Team A"}
            </span>
            <span className="font-mono text-base sm:text-lg font-bold">
              {match.score_team_a || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground text-sm sm:text-base">
              {match.team_b?.name || "Team B"}
            </span>
            <span className="font-mono text-base sm:text-lg font-bold">
              {match.score_team_b || "-"}
            </span>
          </div>
        </div>

        {/* Schedule & Venue Metadata */}
        <div className="pt-2 border-t flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {formatDate(match.match_date)} {match.start_time ? `• ${formatTime(match.start_time)}` : ""}
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
