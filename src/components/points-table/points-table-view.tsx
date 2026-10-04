"use client";

import { useState } from "react";
import { Trophy, BarChart3, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { useRouter } from "next/navigation";

interface PointsTableRow {
  id: string;
  tournament_id: string;
  team_id: string;
  matches_played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  net_score_diff: number | null;
  rank: number | null;
  group_name: string | null;
  teams?: { id: string; name: string; logo_url: string | null } | null;
  tournaments?: { id: string; name: string; format: string } | null;
}

interface Tournament {
  id: string;
  name: string;
  format: string;
  status: string;
}

interface PointsTableViewProps {
  initialStandings: PointsTableRow[];
  tournaments: Tournament[];
  selectedTournamentId: string | null;
}

export function PointsTableView({
  initialStandings,
  tournaments,
  selectedTournamentId,
}: PointsTableViewProps) {
  const router = useRouter();
  const currentTournament = tournaments.find((t) => t.id === selectedTournamentId);

  const handleTournamentChange = (tournamentId: string) => {
    router.push(`/points-table?tournament=${tournamentId}`);
  };

  const formatScoreDiff = (diff: number | null) => {
    if (diff === null || diff === undefined) return "0.00";
    const num = Number(diff);
    return num > 0 ? `+${num.toFixed(3)}` : num.toFixed(3);
  };

  return (
    <div className="space-y-6">
      {/* Tournament Selector Bar */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Select Tournament
          </span>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-foreground">
              {currentTournament?.name || "All Tournaments"}
            </h3>
          </div>
        </div>

        {tournaments.length > 0 && (
          <div className="w-full sm:w-72">
            <Select
              value={selectedTournamentId || ""}
              onValueChange={handleTournamentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a tournament" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.format})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Standings Table */}
      {initialStandings.length > 0 ? (
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
            <div>
              <CardTitle className="text-lg font-bold">
                {currentTournament?.name || "Tournament Leaderboard"}
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Top teams advance to the knockout/playoff stages
              </p>
            </div>
            <Badge variant="success">Auto-Updated from Live Matches</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10">
                  <TableHead className="w-16 text-center font-bold">Rank</TableHead>
                  <TableHead className="font-bold">Team</TableHead>
                  <TableHead className="text-center font-bold">Played</TableHead>
                  <TableHead className="text-center font-bold text-emerald-600">Won</TableHead>
                  <TableHead className="text-center font-bold text-red-500">Lost</TableHead>
                  <TableHead className="text-center font-bold text-muted-foreground">Draw</TableHead>
                  <TableHead className="text-center font-bold">Diff / NRR</TableHead>
                  <TableHead className="text-right font-extrabold text-foreground">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialStandings.map((row, index) => {
                  const rank = index + 1;
                  const isTopTwo = rank <= 2;

                  return (
                    <TableRow
                      key={row.id}
                      className={isTopTwo ? "bg-primary/5 font-medium" : ""}
                    >
                      <TableCell className="text-center font-bold">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            rank === 1
                              ? "bg-amber-400 font-extrabold text-amber-950"
                              : rank === 2
                                ? "bg-slate-300 font-bold text-slate-900"
                                : rank === 3
                                  ? "bg-amber-600/30 text-amber-800 dark:text-amber-300"
                                  : "text-muted-foreground"
                          }`}
                        >
                          {rank}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {row.teams?.name || "Unknown Team"}
                      </TableCell>
                      <TableCell className="text-center">{row.matches_played}</TableCell>
                      <TableCell className="text-center font-semibold text-emerald-600">
                        {row.wins}
                      </TableCell>
                      <TableCell className="text-center text-red-500">{row.losses}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{row.draws}</TableCell>
                      <TableCell className="text-center font-mono text-xs">
                        {formatScoreDiff(row.net_score_diff)}
                      </TableCell>
                      <TableCell className="text-right text-base font-extrabold text-foreground">
                        {row.points}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={BarChart3}
          title="No Standings Available"
          description={
            currentTournament
              ? "Matches for this tournament have not commenced yet. Standings will populate automatically as matches conclude."
              : "No tournaments are currently active."
          }
        />
      )}
    </div>
  );
}
