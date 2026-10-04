import { Radio, Flame, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchCard } from "@/components/shared/match-card";
import { EmptyState } from "@/components/shared/empty-state";

export default function LivePage() {
  const sampleLiveMatches = [
    {
      id: "m-live-1",
      tournament_id: "t-1",
      sport_id: "sport-cricket",
      team_a_id: "ta-1",
      team_b_id: "tb-1",
      venue_id: "v-1",
      match_date: "2026-10-04",
      start_time: "11:00:00",
      end_time: null,
      round: "semi_final" as const,
      match_number: 14,
      status: "live" as const,
      winner_id: null,
      score_team_a: "152/4 (17.2 ov)",
      score_team_b: "Yet to bat",
      remarks: "Match paused due to drizzle",
      updated_by: null,
      created_at: "",
      updated_at: "",
      team_a: { id: "ta-1", name: "Computer Strikers", sport_id: "", tournament_id: null, captain_id: null, logo_url: null, created_by: "", created_at: "" },
      team_b: { id: "tb-1", name: "Mech Warriors", sport_id: "", tournament_id: null, captain_id: null, logo_url: null, created_by: "", created_at: "" },
      sport: { id: "s-1", name: "Cricket", type: "outdoor" as const, max_players_per_team: 15, min_players_per_team: 11, description: null, icon: "🏏", is_active: true, created_at: "" },
      venue: { id: "v-1", name: "Main Cricket Ground", location: "Campus Ground", type: "outdoor" as const, capacity: 500, facilities: [], is_available: true, created_at: "" },
    },
    {
      id: "m-live-2",
      tournament_id: "t-2",
      sport_id: "sport-football",
      team_a_id: "ta-2",
      team_b_id: "tb-2",
      venue_id: "v-2",
      match_date: "2026-10-04",
      start_time: "12:00:00",
      end_time: null,
      round: "group" as const,
      match_number: 8,
      status: "live" as const,
      winner_id: null,
      score_team_a: "2",
      score_team_b: "1",
      remarks: "Second half - 65th minute",
      updated_by: null,
      created_at: "",
      updated_at: "",
      team_a: { id: "ta-2", name: "IT Tigers FC", sport_id: "", tournament_id: null, captain_id: null, logo_url: null, created_by: "", created_at: "" },
      team_b: { id: "tb-2", name: "Civil Dynamos", sport_id: "", tournament_id: null, captain_id: null, logo_url: null, created_by: "", created_at: "" },
      sport: { id: "s-2", name: "Football", type: "outdoor" as const, max_players_per_team: 18, min_players_per_team: 11, description: null, icon: "⚽", is_active: true, created_at: "" },
      venue: { id: "v-2", name: "Football Field North", location: "Sports Complex North", type: "outdoor" as const, capacity: 300, facilities: [], is_available: true, created_at: "" },
    },
  ];

  return (
    <div className="container max-w-7xl px-4 py-8 sm:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="live" className="flex items-center gap-1.5 px-3 py-1">
              <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
              <span>LIVE MATCH CENTER</span>
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-2">
            Real-Time Ground Scores & Commentary
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Broadcasting live scores across all campus fields powered by Supabase Realtime.
          </p>
        </div>
      </div>

      {/* Live Match Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Flame className="h-5 w-5 text-red-500" />
          <span>Active In-Play Matches ({sampleLiveMatches.length})</span>
        </h2>

        {sampleLiveMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleLiveMatches.map((match) => (
              <MatchCard key={match.id} match={match} isLive />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Radio}
            title="No Live Matches At This Moment"
            description="All scheduled matches for today have finished or are scheduled for later."
          />
        )}
      </div>
    </div>
  );
}
