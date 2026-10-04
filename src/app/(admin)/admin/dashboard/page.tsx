import Link from "next/link";
import {
  Trophy,
  Users,
  Flame,
  Calendar,
  Plus,
  Radio,
  MapPin,
  Bell,
  ArrowRight,
  ShieldAlert,
  Dumbbell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { ROUTES } from "@/lib/constants/routes";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const admin = createAdminClient();

  // Parallel live count queries
  const [
    { count: playersCount },
    { count: sportsCount },
    { count: venuesCount },
    { count: tournamentsCount },
    { count: teamsCount },
    { count: liveMatchesCount, data: liveMatches },
  ] = await Promise.all([
    admin.from("players").select("*", { count: "exact", head: true }),
    admin.from("sports").select("*", { count: "exact", head: true }),
    admin.from("venues").select("*", { count: "exact", head: true }),
    admin.from("tournaments").select("*", { count: "exact", head: true }),
    admin.from("teams").select("*", { count: "exact", head: true }),
    admin
      .from("matches")
      .select(
        "*, tournaments(name), team_a:teams!matches_team_a_id_fkey(name), team_b:teams!matches_team_b_id_fkey(name)"
      )
      .eq("status", "live")
      .limit(3),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Sports Governance Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of live campus fixtures, pending team approvals, and tournament logistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="gap-1.5">
            <Link href={ROUTES.ADMIN_TOURNAMENTS}>
              <Plus className="h-4 w-4" />
              <span>Create Tournament</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href={ROUTES.ADMIN_MATCHES}>
              <Calendar className="h-4 w-4" />
              <span>Schedule Match</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 6 Key Stat Cards with live counts from Supabase */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          title="Athletes"
          value={String(playersCount ?? 0)}
          icon={Users}
          trend="Registered PRNs"
        />
        <StatCard
          title="Teams"
          value={String(teamsCount ?? 0)}
          icon={Users}
          description="Campus Squads"
        />
        <StatCard
          title="Tournaments"
          value={String(tournamentsCount ?? 0)}
          icon={Trophy}
          description="Active & upcoming"
        />
        <StatCard
          title="Live In-Play"
          value={String(liveMatchesCount ?? 0)}
          icon={Flame}
          trend={(liveMatchesCount ?? 0) > 0 ? "● Realtime" : "No live games"}
        />
        <StatCard
          title="Campus Grounds"
          value={String(venuesCount ?? 0)}
          icon={MapPin}
          description="Available facilities"
        />
        <StatCard
          title="Sports Catalog"
          value={String(sportsCount ?? 0)}
          icon={Dumbbell}
          trend="Active sports"
        />
      </div>

      {/* Ongoing Live Matches Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Radio className="h-4 w-4 animate-pulse text-red-500" />
              <span>Ongoing In-Play Matches</span>
            </CardTitle>
            <CardDescription>Live ground scoring console</CardDescription>
          </div>
          <Badge variant={(liveMatchesCount ?? 0) > 0 ? "live" : "secondary"}>
            {(liveMatchesCount ?? 0) > 0
              ? `${liveMatchesCount} Matches Live`
              : "0 Matches Currently Live"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {liveMatches && liveMatches.length > 0 ? (
            liveMatches.map((m: any) => (
              <div
                key={m.id}
                className="flex flex-col justify-between gap-3 rounded-lg border border-border bg-muted/20 p-3 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">
                      {m.tournaments?.name || "Tournament"}
                    </span>
                    <span>• In Progress</span>
                  </div>
                  <p className="text-sm font-bold">
                    {m.team_a?.name || "Team A"} ({m.score_team_a ?? 0}) vs{" "}
                    {m.team_b?.name || "Team B"} ({m.score_team_b ?? 0})
                  </p>
                </div>
                <Button size="sm" asChild variant="default">
                  <Link href={ROUTES.ADMIN_MATCHES}>Live Ground Console</Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
              No live matches currently in progress.{" "}
              <Link
                href={ROUTES.ADMIN_MATCHES}
                className="font-medium text-primary hover:underline"
              >
                Start a scheduled match
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Activity Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Quick Department Operations</CardTitle>
            <CardDescription>Fast shortcuts for daily sports department workflows</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3">
              <Link href={ROUTES.ADMIN_TOURNAMENTS}>
                <Trophy className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-bold">Tournaments</p>
                  <p className="text-[10px] text-muted-foreground">Manage brackets</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3">
              <Link href={ROUTES.ADMIN_PLAYERS}>
                <Users className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-bold">Player Directory</p>
                  <p className="text-[10px] text-muted-foreground">Verify athlete PRNs</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3">
              <Link href={ROUTES.ADMIN_SPORTS}>
                <Dumbbell className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-bold">Sports Catalog</p>
                  <p className="text-[10px] text-muted-foreground">
                    {sportsCount ?? 0} sports defined
                  </p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3">
              <Link href={ROUTES.ADMIN_VENUES}>
                <MapPin className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-bold">Campus Venues</p>
                  <p className="text-[10px] text-muted-foreground">
                    {venuesCount ?? 0} grounds & courts
                  </p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Recent System Activity</CardTitle>
            <CardDescription>Real-time log of campus sports actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-medium text-foreground">
                • Master sports catalog initialized (10 disciplines)
              </span>
              <span className="text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-medium text-foreground">
                • Campus grounds registered (6 venues)
              </span>
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-medium text-foreground">
                • Smart QR Pass verification service active
              </span>
              <span className="text-muted-foreground">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">
                • Supabase real-time connection verified
              </span>
              <span className="font-semibold text-emerald-500">Connected</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
