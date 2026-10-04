import Link from "next/link";
import { Trophy, Calendar, Users, Award, QrCode, ArrowRight, Activity, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { ROUTES } from "@/lib/constants/routes";
import { createClient } from "@/lib/supabase/server";
import { getPlayerAnalytics } from "@/actions/analytics";
import { formatDate, formatTime } from "@/lib/utils/format";
import { QRCodeSVG } from "qrcode.react";

export const revalidate = 0;

export default async function PlayerDashboardPage() {
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
  const upcomingMatches = data?.upcomingMatches || [];
  const nextMatch = upcomingMatches[0] || null;

  const qrValue = player?.qr_code || (user ? `PLAYOPS-${user.id}` : "PLAYOPS-GUEST");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">Verified Athlete</Badge>
            {player?.registration_number && (
              <span className="text-xs text-muted-foreground font-mono">
                Reg No: {player.registration_number}
              </span>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {player?.users?.full_name || user?.user_metadata?.full_name || "Athlete"}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Department of {player?.department || "Engineering"} • Year: {player?.year || "FE/SE/TE/BE"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="gap-2">
            <Link href={ROUTES.PLAYER_PROFILE}>
              <QrCode className="h-4 w-4" />
              <span>Digital Sports Pass</span>
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href={ROUTES.TOURNAMENTS}>
              <Trophy className="h-4 w-4" />
              <span>Browse Tournaments</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          title="Matches Scheduled"
          value={stats.totalMatches}
          icon={Activity}
          description={`${stats.completedMatches} Completed`}
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate}%`}
          icon={Trophy}
          description={`${stats.wins} Wins • ${stats.losses} Losses`}
        />
        <StatCard
          title="Active Teams"
          value={teams.length}
          icon={Users}
          description={teams.length > 0 ? teams.map((t: any) => t.name).join(", ") : "No squad yet"}
        />
        <StatCard
          title="Certificates"
          value={stats.certificatesCount}
          icon={Award}
          description="Podium & Participation"
        />
      </div>

      {/* Main Grid: Upcoming Matches & Team Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Next Match Widget */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">Upcoming Match</CardTitle>
              <CardDescription>Your next scheduled college fixture</CardDescription>
            </div>
            {nextMatch && <Badge variant="default">Scheduled</Badge>}
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {nextMatch ? (
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="mb-3 flex items-center justify-between border-b pb-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">
                    {nextMatch.tournaments?.name || "Tournament"}
                  </span>
                  <span>
                    Match #{nextMatch.match_number} • {nextMatch.round?.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                    <span className="text-base font-bold">{nextMatch.team_a?.name || "Team A"}</span>
                    <span className="text-xs text-muted-foreground">Team A</span>
                  </div>
                  <span className="rounded bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                    VS
                  </span>
                  <div className="flex flex-col text-right">
                    <span className="text-base font-bold">{nextMatch.team_b?.name || "Team B"}</span>
                    <span className="text-xs text-muted-foreground">Team B</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(nextMatch.match_date)}{" "}
                    {nextMatch.start_time ? `• ${formatTime(nextMatch.start_time)}` : ""}
                  </span>
                  {nextMatch.venues && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {nextMatch.venues.name}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No upcoming fixtures scheduled for your squad right now. Check back once draws are announced!
              </div>
            )}

            <div className="flex justify-end">
              <Button asChild variant="ghost" size="sm">
                <Link href={ROUTES.PLAYER_MATCHES} className="gap-1.5">
                  <span>View All Scheduled Fixtures</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Digital Sports Pass Preview */}
        <Card className="bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <QrCode className="h-5 w-5 text-primary" />
              <span>Smart Sports Pass</span>
            </CardTitle>
            <CardDescription>Scan at venue for match check-in</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-xl border-2 border-dashed border-primary/40 bg-white p-3 text-black shadow-inner">
              <QRCodeSVG value={qrValue} size={130} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">
                {player?.users?.full_name || "Athlete"}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                Pass ID: {qrValue.slice(0, 16)}
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link href={ROUTES.PLAYER_PROFILE}>View Full ID Pass</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
