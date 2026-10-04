import Link from "next/link";
import { Trophy, Calendar, Users, Award, QrCode, ArrowRight, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { ROUTES } from "@/lib/constants/routes";

export default function PlayerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default">Verified Athlete</Badge>
            <span className="text-xs text-muted-foreground">PRN: 202301048821</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, Atharva!
          </h1>
          <p className="text-sm text-muted-foreground">
            Department of Computer Engineering • Third Year (TE)
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
          title="Matches Played"
          value="14"
          icon={Activity}
          trend="+3 this month"
          description="Across Cricket & Badminton"
        />
        <StatCard
          title="Win Rate"
          value="71%"
          icon={Trophy}
          trend="+5%"
          description="10 Wins • 4 Losses"
        />
        <StatCard
          title="Active Teams"
          value="2"
          icon={Users}
          description="Computer Strikers, Comp FC"
        />
        <StatCard
          title="Certificates"
          value="3"
          icon={Award}
          trend="1 Gold"
          description="2 Participation • 1 Winner"
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
            <Badge variant="default">Scheduled</Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="mb-3 flex items-center justify-between border-b pb-2 text-xs text-muted-foreground">
                <span className="font-semibold text-primary">
                  Inter-Dept Cricket Premier League
                </span>
                <span>Match #14 • Semi-Final</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col">
                  <span className="text-base font-bold">Computer Strikers</span>
                  <span className="text-xs text-muted-foreground">Your Team (Batting)</span>
                </div>
                <span className="rounded bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                  VS
                </span>
                <div className="flex flex-col text-right">
                  <span className="text-base font-bold">Mech Warriors</span>
                  <span className="text-xs text-muted-foreground">Mechanical Dept</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                <span>📅 15 Oct 2026 • 10:00 AM</span>
                <span>📍 Main Cricket Ground</span>
              </div>
            </div>

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
              <span>Smart Sports ID</span>
            </CardTitle>
            <CardDescription>Scan at venue for match check-in</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-xl border-2 border-dashed border-primary/40 bg-white p-4 text-black shadow-inner">
              <div className="flex h-36 w-36 items-center justify-center font-mono text-xs text-slate-800">
                [QR PASS: PLAYOPS-KKW-2026]
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">Atharva Joshi</p>
              <p className="font-mono text-[11px] text-muted-foreground">ID: PLAYOPS-7F3A29B</p>
            </div>
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link href={ROUTES.PLAYER_PROFILE}>Download Full Pass PDF</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
