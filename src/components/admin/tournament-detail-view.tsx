"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Zap,
  Play,
  Clock,
  Shield,
  Loader2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { reviewRegistration, generateTournamentFixtures } from "@/actions/tournaments";

interface TournamentDetailProps {
  tournament: any;
}

export function TournamentDetailView({ tournament: initialTournament }: TournamentDetailProps) {
  const [tournament, setTournament] = useState(initialTournament);
  const [generating, setGenerating] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const approvedRegistrations = (tournament.registrations || []).filter(
    (r: any) => r.status === "approved"
  );
  const pendingRegistrations = (tournament.registrations || []).filter(
    (r: any) => r.status === "pending"
  );

  const handleReview = async (registrationId: string, status: "approved" | "rejected") => {
    setReviewingId(registrationId);
    try {
      const res = await reviewRegistration(registrationId, status);
      if (!res.success) throw new Error(res.error || "Review failed");

      setTournament((prev: any) => ({
        ...prev,
        registrations: prev.registrations.map((r: any) =>
          r.id === registrationId ? { ...r, status } : r
        ),
      }));

      toast.success(`Team registration marked as ${status}.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update registration.");
    } finally {
      setReviewingId(null);
    }
  };

  const handleGenerateFixtures = async () => {
    if (approvedRegistrations.length < 2) {
      toast.error("You need at least 2 approved teams to generate fixtures.");
      return;
    }

    setGenerating(true);
    try {
      const res = await generateTournamentFixtures(tournament.id);
      if (!res.success) throw new Error(res.error || "Generation failed");

      toast.success(res.message || "Fixtures generated successfully!");
      // Reload page to re-fetch newly inserted matches
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to generate fixtures.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back button & Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5 text-muted-foreground">
            <Link href="/admin/tournaments">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tournaments</span>
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tournament.sports?.icon || "🏆"}</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {tournament.name}
              </h1>
              <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{tournament.sports?.name}</span>
                <span>•</span>
                <span className="capitalize">{tournament.format}</span>
                <span>•</span>
                <span>{tournament.venues?.name || "Campus Ground"}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              tournament.status === "ongoing"
                ? "live"
                : tournament.status === "completed"
                  ? "secondary"
                  : "default"
            }
            className="px-3 py-1 text-xs capitalize"
          >
            {tournament.status}
          </Badge>

          {tournament.status === "upcoming" && (
            <Button
              onClick={handleGenerateFixtures}
              disabled={generating || approvedRegistrations.length < 2}
              className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              <span>Generate Fixtures & Launch</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="teams" className="space-y-4">
        <TabsList className="border border-border bg-card">
          <TabsTrigger value="teams" className="gap-2">
            <Users className="h-4 w-4" />
            <span>Teams ({tournament.registrations?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="fixtures" className="gap-2">
            <Trophy className="h-4 w-4" />
            <span>Fixtures & Bracket ({tournament.matches?.length || 0})</span>
          </TabsTrigger>
          {tournament.format !== "knockout" && (
            <TabsTrigger value="standings" className="gap-2">
              <Shield className="h-4 w-4" />
              <span>Points Table</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="rules" className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Rules & Logistics</span>
          </TabsTrigger>
        </TabsList>

        {/* Teams & Registrations Tab */}
        <TabsContent value="teams" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Max Teams
                </span>
                <p className="mt-1 text-2xl font-bold text-foreground">{tournament.max_teams}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Approved Squads
                </span>
                <p className="mt-1 text-2xl font-bold text-emerald-500">
                  {approvedRegistrations.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Pending Review
                </span>
                <p className="mt-1 text-2xl font-bold text-amber-500">
                  {pendingRegistrations.length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Registered Squads & Review</CardTitle>
              <CardDescription>
                Approve or reject squads participating in this tournament bracket.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Squad Name</TableHead>
                      <TableHead>Sport</TableHead>
                      <TableHead>Captain</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Review Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tournament.registrations?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No teams registered for this tournament yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tournament.registrations?.map((reg: any) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-semibold text-foreground">
                            {reg.teams?.name}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1.5">
                              <span>{reg.teams?.sports?.icon || "🏆"}</span>
                              <span>{reg.teams?.sports?.name}</span>
                            </span>
                          </TableCell>
                          <TableCell>
                            {reg.teams?.captain ? (
                              <div className="text-xs">
                                <span className="font-medium text-foreground">
                                  {reg.teams.captain.users?.full_name}
                                </span>
                                <span className="block font-mono text-muted-foreground">
                                  ({reg.teams.captain.registration_number})
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(reg.registration_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                reg.status === "approved"
                                  ? "success"
                                  : reg.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="capitalize"
                            >
                              {reg.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="space-x-1 text-right">
                            {reg.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-emerald-600 hover:text-emerald-700"
                                  onClick={() => handleReview(reg.id, "approved")}
                                  disabled={reviewingId === reg.id}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-destructive hover:text-destructive"
                                  onClick={() => handleReview(reg.id, "rejected")}
                                  disabled={reviewingId === reg.id}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {reg.status === "approved" && (
                              <span className="text-xs text-muted-foreground">Ready for draw</span>
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
        </TabsContent>

        {/* Fixtures & Bracket Tab */}
        <TabsContent value="fixtures" className="space-y-4">
          {tournament.matches?.length === 0 ? (
            <Card>
              <CardContent className="space-y-3 py-16 text-center">
                <Trophy className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-bold text-foreground">Fixtures Not Yet Generated</h3>
                <p className="mx-auto max-w-md text-sm text-muted-foreground">
                  Approve participating teams and click &quot;Generate Fixtures & Launch&quot; to
                  build the official {tournament.format} match schedule.
                </p>
                {tournament.status === "upcoming" && (
                  <Button
                    onClick={handleGenerateFixtures}
                    disabled={generating || approvedRegistrations.length < 2}
                    className="mt-2 gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Generate Fixtures Now</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">
                  Official Schedule ({tournament.matches.length} Matches)
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateFixtures}
                  disabled={generating}
                  className="gap-1.5 text-xs"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Regenerate Draw</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {tournament.matches.map((m: any) => (
                  <Card
                    key={m.id}
                    className="border-border transition-colors hover:border-primary/40"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-semibold uppercase tracking-wider text-primary">
                          Match #{m.match_number} • {m.round?.replace(/_/g, " ")}
                        </span>
                        <Badge
                          variant={
                            m.status === "live"
                              ? "live"
                              : m.status === "completed"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-[10px] capitalize"
                        >
                          {m.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3 font-semibold">
                        <span className="text-foreground">{m.team_a?.name || "Team A"}</span>
                        <span className="font-mono text-muted-foreground">
                          {m.score_team_a ?? "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3 font-semibold">
                        <span className="text-foreground">{m.team_b?.name || "Team B"}</span>
                        <span className="font-mono text-muted-foreground">
                          {m.score_team_b ?? "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span>{new Date(m.match_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{m.venues?.name || "Main Ground"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Standings / Points Table Tab */}
        {tournament.format !== "knockout" && (
          <TabsContent value="standings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">League Standings</CardTitle>
                <CardDescription>
                  Points table automatically updated as match scores are registered.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>P</TableHead>
                        <TableHead>W</TableHead>
                        <TableHead>L</TableHead>
                        <TableHead>D</TableHead>
                        <TableHead>Pts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tournament.pointsTable?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            Points table will populate when league fixtures are launched.
                          </TableCell>
                        </TableRow>
                      ) : (
                        tournament.pointsTable?.map((pt: any, idx: number) => (
                          <TableRow key={pt.id}>
                            <TableCell className="font-bold">{idx + 1}</TableCell>
                            <TableCell className="font-semibold text-foreground">
                              {pt.teams?.name}
                            </TableCell>
                            <TableCell>{pt.matches_played}</TableCell>
                            <TableCell>{pt.wins}</TableCell>
                            <TableCell>{pt.losses}</TableCell>
                            <TableCell>{pt.draws}</TableCell>
                            <TableCell className="font-bold text-primary">{pt.points}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Rules & Logistics Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Rules & Regulations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-lg border border-border bg-muted/40 p-4 leading-relaxed text-muted-foreground">
                {tournament.rules || "Standard college athletic rules and code of conduct apply."}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 rounded-lg border border-border p-3">
                  <span className="text-muted-foreground">Registration Closes</span>
                  <p className="font-semibold text-foreground">
                    {new Date(tournament.registration_deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1 rounded-lg border border-border p-3">
                  <span className="text-muted-foreground">Campus Venue</span>
                  <p className="font-semibold text-foreground">
                    {tournament.venues?.name || "Campus Ground"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
