import { Activity, Award, Flame, Target, Trophy, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getPlayerAnalytics } from "@/actions/analytics";

export const revalidate = 0;

export default async function PlayerPerformancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const analyticsRes = await getPlayerAnalytics(user?.id);
  const data = analyticsRes.data;

  const player = data?.player;
  const stats = data?.stats || {
    totalMatches: 0,
    completedMatches: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0,
    certificatesCount: 0,
  };
  const teams = data?.teams || [];
  const performances = data?.performance || [];

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Performance Analytics &amp; Radar
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your statistics, match ratings, runs, wickets, and tournament accomplishments.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          title="Matches Competed"
          value={stats.completedMatches}
          icon={Activity}
          trend={`${stats.totalMatches} total scheduled`}
          description="Career Encounters"
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate}%`}
          icon={Target}
          trend={`${stats.wins}W - ${stats.losses}L - ${stats.draws}D`}
          description="Overall Success"
        />
        <StatCard
          title="Registered Teams"
          value={teams.length}
          icon={Flame}
          trend={teams.length > 0 ? "Active Athlete" : "Free Agent"}
          description="Department Squads"
        />
        <StatCard
          title="Honours & Certificates"
          value={stats.certificatesCount}
          icon={Award}
          trend="Verifiable"
          description="Podium & Recognition"
        />
      </div>

      {/* Squad Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Squad Roster Affiliations</CardTitle>
          <CardDescription>
            College departments and tournament teams currently represented
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {teams.length > 0 ? (
            teams.map((t: any) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border p-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{t.sports?.icon || "🏅"}</span>
                  <div>
                    <span className="font-semibold text-foreground">{t.name}</span>
                    <p className="text-xs text-muted-foreground">{t.sports?.name || "Sport"}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Active Roster
                </Badge>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              You haven&apos;t been added to any squads yet. Reach out to your department team captain or register for open tournaments.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recorded Performance Metrics */}
      {performances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Official Performance Log</CardTitle>
            <CardDescription>Verified statistics logged by ground referees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {performances.map((perf: any) => (
              <div
                key={perf.id}
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-foreground">{perf.sports?.name || "Sports Entry"}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {perf.goals_scored > 0 && <span>Goals: {perf.goals_scored}</span>}
                    {perf.runs_scored > 0 && <span>Runs: {perf.runs_scored}</span>}
                    {perf.wickets_taken > 0 && <span>Wickets: {perf.wickets_taken}</span>}
                    {perf.points_scored > 0 && <span>Points: {perf.points_scored}</span>}
                  </div>
                </div>
                {perf.rating && (
                  <Badge variant="success" className="text-xs font-mono">
                    Rating: {perf.rating}/10
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
