import { BarChart, Activity, Award, Flame, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";

export default function PlayerPerformancePage() {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Performance Analytics & Radar
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your statistics, match ratings, runs, wickets, and tournament accomplishments.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Runs" value="384" icon={Flame} trend="Avg: 48.0" description="Cricket 2026 Season" />
        <StatCard title="Highest Score" value="86*" icon={Target} description="vs Civil Titans" />
        <StatCard title="Strike Rate" value="142.2" icon={Activity} trend="Top 5% in College" />
        <StatCard title="Player of the Match" value="2" icon={Award} description="2 Awards won" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Season Summary: 2026</CardTitle>
          <CardDescription>Breakdown by tournament performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2 text-sm">
            <span className="font-semibold">Inter-Dept Cricket Premier League</span>
            <span className="font-mono text-xs">8 Matches • 384 Runs • 4 Wickets</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Annual Badminton Shuttlers Trophy</span>
            <span className="font-mono text-xs">6 Matches • 5 Wins • Runner-Up</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
