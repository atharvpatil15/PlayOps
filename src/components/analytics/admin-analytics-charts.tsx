"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Users, Activity, BarChart2 } from "lucide-react";

interface AdminAnalyticsChartsProps {
  sportDistribution: Array<{ name: string; tournaments: number; icon: string }>;
  departmentDistribution: Array<{ department: string; count: number }>;
  matchStatusMap: {
    scheduled: number;
    live: number;
    completed: number;
    cancelled: number;
  };
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export function AdminAnalyticsCharts({
  sportDistribution,
  departmentDistribution,
  matchStatusMap,
}: AdminAnalyticsChartsProps) {
  const matchStatusData = [
    { name: "Scheduled", value: matchStatusMap.scheduled, color: "#3b82f6" },
    { name: "Live In-Play", value: matchStatusMap.live, color: "#ef4444" },
    { name: "Completed", value: matchStatusMap.completed, color: "#10b981" },
    { name: "Cancelled", value: matchStatusMap.cancelled, color: "#6b7280" },
  ].filter((item) => item.value > 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Tournaments per Sport Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span>Tournaments by Sport</span>
          </CardTitle>
          <CardDescription>Active championships hosted across college sporting codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sportDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="tournaments" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {sportDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Athlete Participation by Department */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Users className="h-5 w-5 text-primary" />
            <span>Athletes by Department</span>
          </CardTitle>
          <CardDescription>Verified student athletes enrolled per engineering stream</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentDistribution}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
              >
                <XAxis type="number" allowDecimals={false} fontSize={11} />
                <YAxis
                  dataKey="department"
                  type="category"
                  fontSize={11}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Matches Pipeline Distribution */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span>Campus Fixtures &amp; Ground Pipeline</span>
          </CardTitle>
          <CardDescription>
            Live status of campus fixtures across all sports grounds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border bg-blue-500/10 p-4 text-center">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Scheduled Fixtures
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">
                {matchStatusMap.scheduled}
              </p>
            </div>
            <div className="rounded-lg border bg-red-500/10 p-4 text-center">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                Live In-Play
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">{matchStatusMap.live}</p>
            </div>
            <div className="rounded-lg border bg-emerald-500/10 p-4 text-center">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Completed Results
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">
                {matchStatusMap.completed}
              </p>
            </div>
            <div className="rounded-lg border bg-slate-500/10 p-4 text-center">
              <span className="text-xs font-semibold text-muted-foreground">
                Cancelled / Postponed
              </span>
              <p className="mt-1 text-2xl font-black text-foreground">
                {matchStatusMap.cancelled}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
