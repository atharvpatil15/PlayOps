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
    <Card className="overflow-hidden border border-border bg-card transition-colors duration-150 hover:border-foreground/40">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border bg-muted/30 px-4 py-2.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {match.round.replace(/_/g, " ")} • MATCH #{match.match_number}
        </span>
        {isMatchLive ? (
          <Badge variant="live" className="flex items-center gap-1.5 px-2 py-0.2 text-[10px]">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>LIVE</span>
          </Badge>
        ) : (
          <Badge variant={match.status === "completed" ? "secondary" : "outline"} className="text-[10px]">
            {match.status}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3 p-4">
        {/* Teams and Scores */}
        <div className="space-y-2">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-foreground">
              {match.team_a?.name || "Team A"}
            </span>
            <span className="font-mono text-base font-bold text-foreground tabular-nums">
              {match.score_team_a || "—"}
            </span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-border/50">
            <span className="text-sm font-medium text-foreground">
              {match.team_b?.name || "Team B"}
            </span>
            <span className="font-mono text-base font-bold text-foreground tabular-nums">
              {match.score_team_b || "—"}
            </span>
          </div>
        </div>

        {/* Schedule & Venue Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {formatDate(match.match_date)}{" "}
              {match.start_time ? `• ${formatTime(match.start_time)}` : ""}
            </span>
          </div>
          {match.venue && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{match.venue.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
