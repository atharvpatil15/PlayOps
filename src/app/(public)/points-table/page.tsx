import { Trophy, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PointsTablePage() {
  const standings = [
    { rank: 1, team: "Computer Strikers", played: 4, won: 4, lost: 0, draw: 0, nrr: "+2.450", points: 12 },
    { rank: 2, team: "IT Blasters", played: 4, won: 3, lost: 1, draw: 0, nrr: "+1.120", points: 9 },
    { rank: 3, team: "Mech Warriors", played: 4, won: 2, lost: 2, draw: 0, nrr: "-0.150", points: 6 },
    { rank: 4, team: "Civil Titans", played: 4, won: 1, lost: 3, draw: 0, nrr: "-1.200", points: 3 },
    { rank: 5, team: "E&TC Sparks", played: 4, won: 0, lost: 4, draw: 0, nrr: "-2.220", points: 0 },
  ];

  return (
    <div className="container max-w-7xl px-4 py-8 sm:px-8 space-y-8">
      <div className="border-b pb-6">
        <Badge variant="outline" className="mb-2">
          Standings
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Tournament Points Table
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time tournament standings, net run rates, wins, and group leaderboards.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">
              Inter-Department Cricket Premier League 2026 — Group A
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Top 2 teams qualify for the semi-finals</p>
          </div>
          <Badge variant="success">Auto-Updated</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">P</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">D</TableHead>
                <TableHead className="text-center">NRR / Diff</TableHead>
                <TableHead className="text-right font-bold text-foreground">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((row) => (
                <TableRow key={row.rank} className={row.rank <= 2 ? "bg-primary/5 font-medium" : ""}>
                  <TableCell className="font-bold">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        row.rank === 1
                          ? "bg-amber-400 text-amber-950 font-extrabold"
                          : row.rank === 2
                          ? "bg-slate-300 text-slate-900 font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {row.rank}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">{row.team}</TableCell>
                  <TableCell className="text-center">{row.played}</TableCell>
                  <TableCell className="text-center text-emerald-600 font-semibold">{row.won}</TableCell>
                  <TableCell className="text-center text-red-500">{row.lost}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{row.draw}</TableCell>
                  <TableCell className="text-center font-mono text-xs">{row.nrr}</TableCell>
                  <TableCell className="text-right font-extrabold text-foreground text-base">
                    {row.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
