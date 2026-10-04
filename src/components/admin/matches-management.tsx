"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Radio,
  Plus,
  Search,
  Trophy,
  MapPin,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Activity,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  scheduleMatch,
  startMatch,
  cancelMatch,
  type ScheduleMatchInput,
} from "@/actions/matches";
import { LiveScoreConsole } from "./live-score-console";

interface Match {
  id: string;
  tournament_id: string;
  sport_id: string;
  team_a_id: string;
  team_b_id: string;
  venue_id: string | null;
  match_date: string;
  start_time: string | null;
  round: string;
  match_number: number;
  status: "scheduled" | "live" | "completed" | "cancelled" | "postponed";
  score_team_a: string | null;
  score_team_b: string | null;
  winner_id: string | null;
  tournaments?: { id: string; name: string } | null;
  sports?: { id: string; name: string; icon: string | null } | null;
  team_a?: { id: string; name: string } | null;
  team_b?: { id: string; name: string } | null;
  venues?: { id: string; name: string; location?: string } | null;
}

interface MatchesManagementProps {
  initialMatches: Match[];
  tournaments: Array<{ id: string; name: string; sport_id: string }>;
  sports: Array<{ id: string; name: string; icon: string | null }>;
  venues: Array<{ id: string; name: string; location?: string }>;
  teams: Array<{ id: string; name: string; sport_id: string; tournament_id: string | null }>;
}

export function MatchesManagement({
  initialMatches,
  tournaments,
  sports,
  venues,
  teams,
}: MatchesManagementProps) {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tournamentFilter, setTournamentFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live scoring modal
  const [scoringMatch, setScoringMatch] = useState<Match | null>(null);

  // Schedule Match Form State
  const [formData, setFormData] = useState<ScheduleMatchInput>({
    tournament_id: tournaments[0]?.id || "",
    sport_id: sports[0]?.id || "",
    team_a_id: "",
    team_b_id: "",
    venue_id: venues[0]?.id || null,
    match_date: new Date().toISOString().split("T")[0],
    start_time: "10:00:00",
    round: "group",
  });

  // Filter teams based on selected tournament or sport
  const availableTeams = teams.filter((t) => {
    if (formData.tournament_id) {
      return t.tournament_id === formData.tournament_id || t.sport_id === formData.sport_id;
    }
    return t.sport_id === formData.sport_id;
  });

  const filteredMatches = matches.filter((m) => {
    const matchesSearch =
      m.team_a?.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.team_b?.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.tournaments?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesTourney =
      tournamentFilter === "all" || m.tournament_id === tournamentFilter;
    return matchesSearch && matchesStatus && matchesTourney;
  });

  const handleOpenSchedule = () => {
    const defaultTourney = tournaments[0];
    const defaultSport = sports.find((s) => s.id === defaultTourney?.sport_id) || sports[0];

    setFormData({
      tournament_id: defaultTourney?.id || "",
      sport_id: defaultSport?.id || "",
      team_a_id: "",
      team_b_id: "",
      venue_id: venues[0]?.id || null,
      match_date: new Date().toISOString().split("T")[0],
      start_time: "10:00:00",
      round: "group",
    });
    setIsOpen(true);
  };

  const handleTournamentSelect = (tourneyId: string) => {
    const tourney = tournaments.find((t) => t.id === tourneyId);
    setFormData((prev) => ({
      ...prev,
      tournament_id: tourneyId,
      sport_id: tourney ? tourney.sport_id : prev.sport_id,
      team_a_id: "",
      team_b_id: "",
    }));
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tournament_id) {
      toast.error("Please select a tournament.");
      return;
    }
    if (!formData.team_a_id || !formData.team_b_id) {
      toast.error("Please select both participating teams.");
      return;
    }
    if (formData.team_a_id === formData.team_b_id) {
      toast.error("A squad cannot play against itself.");
      return;
    }

    setLoading(true);
    try {
      const res = await scheduleMatch(formData);
      if (!res.success || !res.data) throw new Error(res.error || "Scheduling failed");

      const scheduled: Match = {
        ...res.data,
        tournaments: tournaments.find((t) => t.id === formData.tournament_id) || null,
        sports: sports.find((s) => s.id === formData.sport_id) || null,
        team_a: teams.find((t) => t.id === formData.team_a_id) || null,
        team_b: teams.find((t) => t.id === formData.team_b_id) || null,
        venues: venues.find((v) => v.id === formData.venue_id) || null,
      };

      setMatches((prev) => [scheduled, ...prev]);
      toast.success("Match successfully scheduled!");
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule match.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartMatch = async (matchId: string) => {
    try {
      const res = await startMatch(matchId);
      if (!res.success) throw new Error(res.error || "Cannot start match");

      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId
            ? { ...m, status: "live", score_team_a: "0", score_team_b: "0" }
            : m
        )
      );
      toast.success("Match is now LIVE!");
    } catch (err: any) {
      toast.error(err.message || "Failed to start match.");
    }
  };

  const handleCancelMatch = async (matchId: string) => {
    if (!confirm("Are you sure you want to cancel this match fixture?")) return;
    try {
      const res = await cancelMatch(matchId);
      if (!res.success) throw new Error(res.error || "Failed to cancel");

      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, status: "cancelled" } : m))
      );
      toast.success("Match fixture marked as cancelled.");
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel match.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Match Scheduling & Live Scorekeeper
          </h1>
          <p className="text-sm text-muted-foreground">
            Schedule college match fixtures, control ground scoreboards, and broadcast live ball-by-ball events.
          </p>
        </div>
        <Button onClick={handleOpenSchedule} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Schedule Match</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams or tournament..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>

        <div className="w-full sm:w-56">
          <Select value={tournamentFilter} onValueChange={setTournamentFilter}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Tournament" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tournaments</SelectItem>
              {tournaments.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-44">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="live">● Live In-Play</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Matches Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span>Match Fixtures ({filteredMatches.length})</span>
            <Link
              href="/live"
              className="text-xs text-primary hover:underline font-normal flex items-center gap-1"
            >
              <Radio className="h-3.5 w-3.5 text-red-500 animate-pulse" />
              <span>View Public Live Center</span>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Tournament & Sport</TableHead>
                  <TableHead>Fixture Matchup</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date & Ground</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Scoring Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No match fixtures found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMatches.map((match) => (
                    <TableRow key={match.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs font-bold text-muted-foreground">
                        M#{match.match_number}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {match.tournaments?.name || "Tournament"}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span>{match.sports?.icon || "🏆"}</span>
                          <span>{match.sports?.name}</span>
                          <span>•</span>
                          <span className="capitalize">{match.round?.replace(/_/g, " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        <div>{match.team_a?.name || "Team A"}</div>
                        <div className="text-xs text-muted-foreground">vs</div>
                        <div>{match.team_b?.name || "Team B"}</div>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-bold">
                        {match.status === "scheduled" ? (
                          <span className="text-muted-foreground font-normal text-xs">TBD</span>
                        ) : (
                          <div className="space-y-0.5">
                            <div>{match.score_team_a ?? "0"}</div>
                            <div>{match.score_team_b ?? "0"}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 text-foreground font-medium">
                          <Calendar className="h-3 w-3 text-primary" />
                          <span>{new Date(match.match_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{match.venues?.name || "Campus Ground"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            match.status === "live"
                              ? "live"
                              : match.status === "completed"
                              ? "secondary"
                              : match.status === "cancelled"
                              ? "destructive"
                              : "outline"
                          }
                          className="capitalize text-[11px]"
                        >
                          {match.status === "live" ? "● Live" : match.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1.5">
                        {match.status === "scheduled" && (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-8 gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleStartMatch(match.id)}
                          >
                            <Play className="h-3.5 w-3.5" />
                            <span>Start Match</span>
                          </Button>
                        )}

                        {match.status === "live" && (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-8 gap-1 text-xs bg-primary"
                            onClick={() => setScoringMatch(match)}
                          >
                            <Activity className="h-3.5 w-3.5" />
                            <span>Ground Console</span>
                          </Button>
                        )}

                        {match.status === "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            onClick={() => setScoringMatch(match)}
                          >
                            View Log
                          </Button>
                        )}

                        {match.status === "scheduled" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleCancelMatch(match.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Match Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleScheduleSubmit}>
            <DialogHeader>
              <DialogTitle>Schedule Match Fixture</DialogTitle>
              <DialogDescription>
                Assign competing squads, ground venue, date, and round.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label>Tournament</Label>
                <Select
                  value={formData.tournament_id}
                  onValueChange={handleTournamentSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tournament" />
                  </SelectTrigger>
                  <SelectContent>
                    {tournaments.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Team A (Home)</Label>
                  <Select
                    value={formData.team_a_id}
                    onValueChange={(val) => setFormData({ ...formData, team_a_id: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Team A" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeams.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Team B (Away)</Label>
                  <Select
                    value={formData.team_b_id}
                    onValueChange={(val) => setFormData({ ...formData, team_b_id: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Team B" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeams.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Match Date</Label>
                  <Input
                    type="date"
                    value={formData.match_date}
                    onChange={(e) =>
                      setFormData({ ...formData, match_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={formData.start_time || "10:00"}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Ground / Venue</Label>
                  <Select
                    value={formData.venue_id || ""}
                    onValueChange={(val) => setFormData({ ...formData, venue_id: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Match Stage / Round</Label>
                  <Select
                    value={formData.round}
                    onValueChange={(val: any) => setFormData({ ...formData, round: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group">Group Stage</SelectItem>
                      <SelectItem value="round_of_16">Round of 16</SelectItem>
                      <SelectItem value="quarter_final">Quarter-Final</SelectItem>
                      <SelectItem value="semi_final">Semi-Final</SelectItem>
                      <SelectItem value="final">Championship Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Schedule Fixture
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Live Scoring Console Modal */}
      {scoringMatch && (
        <LiveScoreConsole
          match={scoringMatch}
          onClose={() => {
            setScoringMatch(null);
            // Refresh matches list
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
