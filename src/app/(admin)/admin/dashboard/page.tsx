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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { ROUTES } from "@/lib/constants/routes";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
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

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Athletes" value="256" icon={Users} trend="+12 new" />
        <StatCard title="Teams" value="32" icon={Users} trend="+3 squads" />
        <StatCard title="Tournaments" value="4" icon={Trophy} description="1 Upcoming" />
        <StatCard title="Live In-Play" value="2" icon={Flame} trend="● Active" />
        <StatCard title="Grounds" value="6" icon={MapPin} description="2 Booked" />
        <StatCard title="Pending" value="15" icon={ShieldAlert} trend="Needs review" />
      </div>

      {/* Ongoing Live Matches Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <span>Ongoing In-Play Matches</span>
            </CardTitle>
            <CardDescription>Live ground scoring console</CardDescription>
          </div>
          <Badge variant="live">2 Matches Live</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border bg-muted/20">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span className="font-semibold text-primary">Cricket</span>
                <span>• Semi-Final • Main Ground</span>
              </div>
              <p className="font-bold text-sm">Computer Strikers (152/4) vs Mech Warriors (Yet to bat)</p>
            </div>
            <Button size="sm" asChild variant="default">
              <Link href={ROUTES.ADMIN_MATCHES}>Live Ground Console</Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border bg-muted/20">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span className="font-semibold text-primary">Football</span>
                <span>• Group A • Football Field North</span>
              </div>
              <p className="font-bold text-sm">IT Tigers FC (2) vs Civil Dynamos (1)</p>
            </div>
            <Button size="sm" asChild variant="default">
              <Link href={ROUTES.ADMIN_MATCHES}>Live Ground Console</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Quick Department Operations</CardTitle>
            <CardDescription>Fast shortcuts for daily sports department workflows</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="justify-start gap-2 h-auto py-3">
              <Link href={ROUTES.ADMIN_TOURNAMENTS}>
                <Trophy className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-bold">Tournaments</p>
                  <p className="text-[10px] text-muted-foreground">Manage brackets</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="justify-start gap-2 h-auto py-3">
              <Link href={ROUTES.ADMIN_PLAYERS}>
                <Users className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-bold">Player Directory</p>
                  <p className="text-[10px] text-muted-foreground">Approve PRNs</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="justify-start gap-2 h-auto py-3">
              <Link href={ROUTES.ADMIN_VENUES}>
                <MapPin className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-bold">Venues</p>
                  <p className="text-[10px] text-muted-foreground">Campus facilities</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="justify-start gap-2 h-auto py-3">
              <Link href={ROUTES.ADMIN_NOTIFICATIONS}>
                <Bell className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-bold">Announcements</p>
                  <p className="text-[10px] text-muted-foreground">Broadcast alerts</p>
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
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-foreground font-medium">• Atharva Joshi registered Computer Strikers</span>
              <span className="text-muted-foreground">10m ago</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-foreground font-medium">• Match score updated: Computer Strikers 152/4</span>
              <span className="text-muted-foreground">25m ago</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-foreground font-medium">• Main Cricket Ground booked for 15 Oct</span>
              <span className="text-muted-foreground">1h ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">• Monsoon Football Tournament announced</span>
              <span className="text-muted-foreground">3h ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
