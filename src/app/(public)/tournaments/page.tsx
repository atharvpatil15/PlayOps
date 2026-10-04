import Link from "next/link";
import { Trophy, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TournamentCard } from "@/components/shared/tournament-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SUPPORTED_SPORTS } from "@/lib/constants/sport";

export default function TournamentsPage() {
  // Sample demonstration tournaments aligned with KK Wagh sports calendar
  const tournaments = [
    {
      id: "t-cricket-2026",
      name: "KK Wagh Inter-Department Cricket Premier League 2026",
      sport_id: "sport-1",
      format: "knockout" as const,
      start_date: "2026-10-15",
      end_date: "2026-10-22",
      registration_deadline: "2026-10-10T23:59:59Z",
      venue_id: "v-1",
      max_teams: 12,
      entry_fee: 500,
      rules: "Standard T20 college tournament regulations apply.",
      status: "upcoming" as const,
      created_by: "admin",
      created_at: "2026-10-01T10:00:00Z",
      updated_at: "2026-10-01T10:00:00Z",
      sport: { id: "sport-1", name: "Cricket", type: "outdoor" as const, max_players_per_team: 15, min_players_per_team: 11, description: null, icon: "🏏", is_active: true, created_at: "" },
      venue: { id: "v-1", name: "Main Cricket Ground", location: "Behind Main Building", type: "outdoor" as const, capacity: 500, facilities: [], is_available: true, created_at: "" },
    },
    {
      id: "t-football-2026",
      name: "KK Wagh Monsoon Football Championship",
      sport_id: "sport-2",
      format: "group+knockout" as const,
      start_date: "2026-10-05",
      end_date: "2026-10-12",
      registration_deadline: "2026-10-03T23:59:59Z",
      venue_id: "v-2",
      max_teams: 8,
      entry_fee: 400,
      rules: "FIFA 11-a-side college rules with 35-min halves.",
      status: "ongoing" as const,
      created_by: "admin",
      created_at: "2026-09-20T10:00:00Z",
      updated_at: "2026-10-04T10:00:00Z",
      sport: { id: "sport-2", name: "Football", type: "outdoor" as const, max_players_per_team: 18, min_players_per_team: 11, description: null, icon: "⚽", is_active: true, created_at: "" },
      venue: { id: "v-2", name: "Football Field North", location: "Sports Complex North", type: "outdoor" as const, capacity: 300, facilities: [], is_available: true, created_at: "" },
    },
    {
      id: "t-badminton-2026",
      name: "Annual Badminton Shuttlers Trophy",
      sport_id: "sport-3",
      format: "knockout" as const,
      start_date: "2026-10-25",
      end_date: "2026-10-27",
      registration_deadline: "2026-10-20T23:59:59Z",
      venue_id: "v-3",
      max_teams: 16,
      entry_fee: 100,
      rules: "BWF best of 3 sets of 21 points.",
      status: "upcoming" as const,
      created_by: "admin",
      created_at: "2026-10-01T10:00:00Z",
      updated_at: "2026-10-01T10:00:00Z",
      sport: { id: "sport-3", name: "Badminton", type: "indoor" as const, max_players_per_team: 2, min_players_per_team: 1, description: null, icon: "🏸", is_active: true, created_at: "" },
      venue: { id: "v-3", name: "Indoor Sports Complex", location: "Building A", type: "indoor" as const, capacity: 150, facilities: [], is_available: true, created_at: "" },
    },
  ];

  return (
    <div className="container max-w-7xl px-4 py-8 sm:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Tournaments & Championships
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore and register for college tournaments across all athletic departments.
          </p>
        </div>
        <Button asChild>
          <Link href="/register">Register Team</Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tournament by name or sport..." className="pl-9" />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Badge variant="default" className="cursor-pointer">
            All Sports
          </Badge>
          {SUPPORTED_SPORTS.slice(0, 5).map((s) => (
            <Badge key={s.name} variant="outline" className="cursor-pointer hover:bg-muted">
              {s.icon} {s.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tournament Cards Grid */}
      {tournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No Tournaments Found"
          description="There are currently no active or upcoming tournaments matching your filter."
        />
      )}
    </div>
  );
}
