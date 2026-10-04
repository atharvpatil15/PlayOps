import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, Calendar, Users, MapPin, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTournamentDetails } from "@/actions/tournaments";

interface TournamentDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function TournamentDetailPage({ params }: TournamentDetailPageProps) {
  const { id } = await params;
  const { data: tournament, error } = await getTournamentDetails(id);

  if (!tournament || error) {
    notFound();
  }

  const approvedTeams = (tournament.registrations || []).filter(
    (r: any) => r.status === "approved"
  );

  return (
    <div className="container max-w-7xl space-y-8 px-4 py-8 sm:px-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/tournaments" className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tournaments</span>
          </Link>
        </Button>

        <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  tournament.status === "ongoing"
                    ? "live"
                    : tournament.status === "completed"
                      ? "secondary"
                      : "default"
                }
                className="capitalize"
              >
                {tournament.status}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {tournament.format}
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {tournament.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Official campus sports tournament organized under KK Wagh Athletic Department.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="lg">
              <Link href="/player/profile">Athlete ID Pass</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Sport Discipline</p>
          <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-foreground">
            <span>{tournament.sports?.icon || "🏆"}</span>
            <span>{tournament.sports?.name}</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Dates</p>
          <p className="mt-1 text-sm font-bold text-foreground">
            {new Date(tournament.start_date).toLocaleDateString()} –{" "}
            {new Date(tournament.end_date).toLocaleDateString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Campus Ground</p>
          <p className="mt-1 text-sm font-bold text-foreground">
            {tournament.venues?.name || "Campus Ground"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Approved Squads</p>
          <p className="mt-1 text-sm font-bold text-foreground">
            {approvedTeams.length} / {tournament.max_teams} Teams
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 border border-border bg-card">
          <TabsTrigger value="schedule">Matches ({tournament.matches?.length || 0})</TabsTrigger>
          <TabsTrigger value="teams">Teams ({approvedTeams.length})</TabsTrigger>
          <TabsTrigger value="rules">Rules & Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4 pt-4">
          {tournament.matches && tournament.matches.length > 0 ? (
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
          ) : (
            <div className="space-y-2 rounded-xl border border-dashed bg-card p-8 text-center">
              <Trophy className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
              <h3 className="text-base font-bold">Fixtures In Preparation</h3>
              <p className="text-sm text-muted-foreground">
                Official draw will be published as soon as registrations close on{" "}
                {new Date(tournament.registration_deadline).toLocaleDateString()}.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="teams" className="space-y-4 pt-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-base font-bold">Approved Squads</h3>
            {approvedTeams.length > 0 ? (
              <ul className="space-y-3 text-sm">
                {approvedTeams.map((reg: any) => (
                  <li
                    key={reg.id}
                    className="flex items-center justify-between border-b border-border pb-3"
                  >
                    <div>
                      <span className="font-bold text-foreground">{reg.teams?.name}</span>
                      {reg.teams?.captain && (
                        <p className="text-xs text-muted-foreground">
                          Captain: {reg.teams.captain.users?.full_name} (
                          {reg.teams.captain.registration_number})
                        </p>
                      )}
                    </div>
                    <Badge variant="success">✓ Verified Squad</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No approved squads yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4 pt-4">
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-bold">Rules & Regulations</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {tournament.rules ||
                "Standard college athletic rules and code of conduct apply. All participants must show their PlayOps Smart QR Pass before entering the field."}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
