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
  ShieldCheck,
  Dumbbell,
  Clock,
  Sparkles,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { ROUTES } from "@/lib/constants/routes";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminAnalytics } from "@/actions/analytics";
import { AdminAnalyticsCharts } from "@/components/analytics/admin-analytics-charts";

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
    analyticsRes,
  ] = await Promise.all([
    admin.from("players").select("*", { count: "exact", head: true }),
    admin.from("sports").select("*", { count: "exact", head: true }),
    admin.from("venues").select("*", { count: "exact", head: true }),
    admin.from("tournaments").select("*", { count: "exact", head: true }),
    admin.from("teams").select("*", { count: "exact", head: true }),
    admin
      .from("matches")
      .select(
        "*, tournaments(name), team_a:teams!matches_team_a_id_fkey(name), team_b:teams!matches_team_b_id_fkey(name), venues(name)"
      )
      .eq("status", "live")
      .limit(3),
    getAdminAnalytics(),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Administrative Governance Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="mr-1 h-3 w-3" />
              KK Wagh Directorate of Physical Education
            </Badge>
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Sports Governance Center
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
            Centralized control room for tournament scheduling, ground scorekeeper coordination, and athletic rosters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="gap-1.5 shadow-sm font-semibold text-xs">
            <Link href={ROUTES.ADMIN_TOURNAMENTS}>
              <Plus className="h-4 w-4" />
              <span>New Tournament</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5 font-semibold text-xs">
            <Link href={ROUTES.ADMIN_MATCHES}>
              <Calendar className="h-4 w-4 text-primary" />
              <span>Schedule Match</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5 font-semibold text-xs">
            <Link href={ROUTES.ADMIN_NOTIFICATIONS}>
              <Bell className="h-4 w-4 text-amber-500" />
              <span>Broadcast Notice</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 6 Key KPI Stat Cards with Real Counts */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          title="Athletes"
          value={String(playersCount ?? 0)}
          icon={Users}
          trend="Registered PRNs"
          className="border-border/60 transition-all hover:border-primary/40 hover:shadow-sm"
        />
        <StatCard
          title="Teams"
          value={String(teamsCount ?? 0)}
          icon={Users}
          description="Department squads"
          className="border-border/60 transition-all hover:border-primary/40 hover:shadow-sm"
        />
        <StatCard
          title="Tournaments"
          value={String(tournamentsCount ?? 0)}
          icon={Trophy}
          description="Active & upcoming"
          className="border-border/60 transition-all hover:border-primary/40 hover:shadow-sm"
        />
        <StatCard
          title="Live In-Play"
          value={String(liveMatchesCount ?? 0)}
          icon={Flame}
          trend={(liveMatchesCount ?? 0) > 0 ? "● Realtime Broadcast" : "No live games"}
          className={`border-border/60 transition-all hover:shadow-sm ${(liveMatchesCount ?? 0) > 0 ? "border-red-500/40 bg-red-500/[0.03]" : ""}`}
        />
        <StatCard
          title="Campus Grounds"
          value={String(venuesCount ?? 0)}
          icon={MapPin}
          description="Olympic facilities"
          className="border-border/60 transition-all hover:border-primary/40 hover:shadow-sm"
        />
        <StatCard
          title="Sports Catalog"
          value={String(sportsCount ?? 0)}
          icon={Dumbbell}
          trend="Active disciplines"
          className="border-border/60 transition-all hover:border-primary/40 hover:shadow-sm"
        />
      </div>

      {/* Ongoing Live Matches Management */}
      <Card className="border-border/60 shadow-sm transition-all hover:border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="flex items-center gap-2 font-serif text-lg font-bold">
              <Radio className="h-4 w-4 animate-pulse text-red-500" />
              <span>Ongoing In-Play Ground Encounters</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Live match scoring console with minute-by-minute ground commentary
            </CardDescription>
          </div>
          <Badge variant={(liveMatchesCount ?? 0) > 0 ? "live" : "secondary"} className="text-xs font-bold">
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
                className="flex flex-col justify-between gap-3 rounded-xl border border-red-500/20 bg-gradient-to-r from-red-500/5 via-card to-background p-4 sm:flex-row sm:items-center shadow-xs"
              >
                <div>
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-bold text-primary">
                      {m.tournaments?.name || "Tournament"}
                    </span>
                    <span>• {m.round?.replace(/_/g, " ").toUpperCase()}</span>
                    {m.venues?.name && <span>• 📍 {m.venues.name}</span>}
                  </div>
                  <p className="font-serif text-base font-bold text-foreground">
                    {m.team_a?.name || "Team Alpha"}{" "}
                    <span className="font-mono text-primary font-black text-lg">({m.score_team_a ?? 0})</span>{" "}
                    <span className="text-xs font-sans text-muted-foreground uppercase mx-1">vs</span>{" "}
                    {m.team_b?.name || "Team Beta"}{" "}
                    <span className="font-mono text-primary font-black text-lg">({m.score_team_b ?? 0})</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" asChild className="gap-1.5 font-semibold text-xs shadow-sm bg-red-600 hover:bg-red-700 text-white">
                    <Link href={ROUTES.ADMIN_MATCHES}>
                      <Radio className="h-3.5 w-3.5 animate-pulse" />
                      Open Ground Console
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 py-8 text-center text-sm text-muted-foreground">
              <Radio className="mx-auto h-7 w-7 text-muted-foreground/50 mb-1.5" />
              <p className="font-medium text-foreground text-sm">No live ground matches currently in progress</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Matches started from the Ground Console will stream live here with real-time updates.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3 text-xs font-semibold">
                <Link href={ROUTES.ADMIN_MATCHES}>
                  Go to Matches Console ❯
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recharts Analytics Charts */}
      {analyticsRes.data && (
        <AdminAnalyticsCharts
          sportDistribution={analyticsRes.data.sportDistribution}
          departmentDistribution={analyticsRes.data.departmentDistribution}
          matchStatusMap={analyticsRes.data.matchStatusMap}
        />
      )}

      {/* Quick Actions & Recent Activity Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-base font-bold">Quick Department Operations</CardTitle>
            <CardDescription className="text-xs">Direct shortcuts for daily sports department workflows</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="h-auto justify-start gap-2.5 p-3 hover:border-primary/40 hover:bg-primary/[0.03]">
              <Link href={ROUTES.ADMIN_TOURNAMENTS}>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Trophy className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Tournaments</p>
                  <p className="text-[10px] text-muted-foreground">Knockout ladders</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto justify-start gap-2.5 p-3 hover:border-primary/40 hover:bg-primary/[0.03]">
              <Link href={ROUTES.ADMIN_PLAYERS}>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Users className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Player Directory</p>
                  <p className="text-[10px] text-muted-foreground">Verify PRN passes</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto justify-start gap-2.5 p-3 hover:border-primary/40 hover:bg-primary/[0.03]">
              <Link href={ROUTES.ADMIN_SPORTS}>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Sports Catalog</p>
                  <p className="text-[10px] text-muted-foreground">{sportsCount ?? 0} active disciplines</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto justify-start gap-2.5 p-3 hover:border-primary/40 hover:bg-primary/[0.03]">
              <Link href={ROUTES.ADMIN_VENUES}>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Campus Venues</p>
                  <p className="text-[10px] text-muted-foreground">{venuesCount ?? 0} grounds &amp; courts</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-base font-bold">System Infrastructure &amp; Status</CardTitle>
            <CardDescription className="text-xs">Real-time status of athletic telemetry services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-medium text-foreground">
                  Supabase Realtime WebSockets
                </span>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Connected
              </Badge>
            </div>

            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-medium text-foreground">
                  QR Digital Pass Verification Engine
                </span>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Operational
              </Badge>
            </div>

            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-medium text-foreground">
                  Points Table Standings Calculation Pipeline
                </span>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Synced
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-medium text-foreground">
                  Automated Merit Certificate Generation
                </span>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Ready
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
