"use client";

import { useState } from "react";
import { Trophy, CheckCircle2, Calendar, MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils/format";

interface CompletedMatch {
  id: string;
  tournament_id: string;
  sport_id: string;
  team_a_id: string;
  team_b_id: string;
  match_date: string;
  round: string;
  match_number: number;
  status: string;
  score_team_a: string | null;
  score_team_b: string | null;
  winner_id: string | null;
  remarks: string | null;
  tournaments?: { id: string; name: string; format: string } | null;
  sports?: { id: string; name: string; icon: string | null } | null;
  team_a?: { id: string; name: string } | null;
  team_b?: { id: string; name: string } | null;
  venues?: { id: string; name: string; location?: string } | null;
}

interface ResultsListProps {
  initialMatches: CompletedMatch[];
  sports: Array<{ id: string; name: string; icon: string | null }>;
}

export function ResultsList({ initialMatches, sports }: ResultsListProps) {
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");

  const filteredMatches = initialMatches.filter((m) => {
    const matchesSport = selectedSport === "all" || m.sport_id === selectedSport;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (m.team_a?.name || "").toLowerCase().includes(q) ||
      (m.team_b?.name || "").toLowerCase().includes(q) ||
      (m.tournaments?.name || "").toLowerCase().includes(q);

    return matchesSport && matchesSearch;
  });

  const getWinnerDescription = (m: CompletedMatch) => {
    if (!m.winner_id) {
      return "Match Drawn / Tied";
    }
    if (m.winner_id === m.team_a_id) {
      return `${m.team_a?.name || "Team A"} won`;
    }
    if (m.winner_id === m.team_b_id) {
      return `${m.team_b?.name || "Team B"} won`;
    }
    return "Match Concluded";
  };

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams or tournaments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedSport("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              selectedSport === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Sports
          </button>
          {sports.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSport(s.id)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                selectedSport === s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <span>{s.icon || "🏅"}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Cards Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredMatches.map((m) => {
            const teamAWon = m.winner_id === m.team_a_id;
            const teamBWon = m.winner_id === m.team_b_id;

            return (
              <Card key={m.id} className="overflow-hidden border transition-all hover:shadow-md">
                <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span>{m.sports?.icon || "🏅"}</span>
                      <p className="text-xs font-bold text-foreground">
                        {m.tournaments?.name || "Tournament"}
                      </p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {m.round.replace(/_/g, " ").toUpperCase()} • Match #{m.match_number}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Final Result
                  </Badge>
                </div>

                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2.5">
                    <div
                      className={`flex items-center justify-between rounded-lg p-2.5 transition-colors ${
                        teamAWon ? "bg-emerald-500/10 font-bold text-emerald-950 dark:text-emerald-200" : "bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {teamAWon && <Trophy className="h-4 w-4 text-emerald-600" />}
                        <span className="text-sm font-semibold">{m.team_a?.name || "Team A"}</span>
                      </div>
                      <span className="font-mono text-lg font-extrabold">
                        {m.score_team_a ?? "-"}
                      </span>
                    </div>

                    <div
                      className={`flex items-center justify-between rounded-lg p-2.5 transition-colors ${
                        teamBWon ? "bg-emerald-500/10 font-bold text-emerald-950 dark:text-emerald-200" : "bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {teamBWon && <Trophy className="h-4 w-4 text-emerald-600" />}
                        <span className="text-sm font-semibold">{m.team_b?.name || "Team B"}</span>
                      </div>
                      <span className="font-mono text-lg font-extrabold">
                        {m.score_team_b ?? "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{getWinnerDescription(m)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(m.match_date)}
                      </span>
                      {m.venues && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {m.venues.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {m.remarks && (
                    <p className="rounded bg-muted/50 p-2 text-xs text-muted-foreground italic">
                      &quot;{m.remarks}&quot;
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No Match Results Found"
          description={
            search || selectedSport !== "all"
              ? "No completed matches match your current filters."
              : "Completed tournament matches will be archived here once officially recorded by ground referees."
          }
        />
      )}
    </div>
  );
}
