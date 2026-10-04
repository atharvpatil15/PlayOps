import { Calendar, Clock, MapPin, Trophy, Radio, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { createClient } from "@/lib/supabase/server";
import { getPlayerAnalytics } from "@/actions/analytics";
import { formatDate, formatTime } from "@/lib/utils/format";

export const revalidate = 0;

export default async function PlayerMatchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const analyticsRes = await getPlayerAnalytics(user?.id);
  const data = analyticsRes.data;

  const upcomingMatches = data?.upcomingMatches || [];
  const completedMatches = data?.completedMatches || [];
  const teams = data?.teams || [];
  const teamIds = teams.map((t: any) => t.id);

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Match Schedule
        </h1>
        <p className="text-sm text-muted-foreground">
          View scheduled fixtures and historical results for your team.
        </p>
      </div>

      {/* Upcoming Scheduled Fixtures */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Upcoming Fixtures ({upcomingMatches.length})</span>
        </h2>

        {upcomingMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {upcomingMatches.map((m: any) => (
              <Card key={m.id} className="p-4 transition-colors hover:border-primary/40">
                <div className="mb-3 flex items-center justify-between border-b pb-2 text-xs">
                  <span className="font-semibold text-primary">
                    {m.tournaments?.name || "Tournament"} • {m.round?.replace(/_/g, " ").toUpperCase()}
                  </span>
                  <Badge variant="outline">Match #{m.match_number}</Badge>
                </div>

                <div className="space-y-2 py-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground sm:text-base">
                      {m.team_a?.name || "Team A"}
                    </span>
                    <span className="text-xs text-muted-foreground">vs</span>
                    <span className="font-bold text-foreground sm:text-base">
                      {m.team_b?.name || "Team B"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(m.match_date)} {m.start_time ? `• ${formatTime(m.start_time)}` : ""}
                    </span>
                    {m.venues && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {m.venues.name}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No Upcoming Fixtures"
            description="Your squads do not have any pending scheduled fixtures. Check back as tournament schedules are updated."
          />
        )}
      </div>

      {/* Past Completed Matches */}
      <div className="space-y-4 border-t pt-6">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Trophy className="h-5 w-5 text-amber-500" />
          <span>Completed Matches ({completedMatches.length})</span>
        </h2>

        {completedMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {completedMatches.map((m: any) => {
              const myTeamWon = m.winner_id && teamIds.includes(m.winner_id);
              const isDraw = !m.winner_id;

              return (
                <Card key={m.id} className="p-4">
                  <div className="mb-3 flex items-center justify-between border-b pb-2 text-xs">
                    <span className="font-semibold text-primary">
                      {m.tournaments?.name || "Tournament"}
                    </span>
                    <Badge
                      variant={myTeamWon ? "success" : isDraw ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {myTeamWon ? "Victory" : isDraw ? "Drawn" : "Completed"}
                    </Badge>
                  </div>

                  <div className="space-y-2 py-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{m.team_a?.name}</span>
                      <span className="font-mono font-bold">{m.score_team_a ?? "-"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{m.team_b?.name}</span>
                      <span className="font-mono font-bold">{m.score_team_b ?? "-"}</span>
                    </div>

                    <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                      <span>{formatDate(m.match_date)}</span>
                      {m.remarks && <span className="italic line-clamp-1">{m.remarks}</span>}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No historical matches recorded yet.</p>
        )}
      </div>
    </div>
  );
}
