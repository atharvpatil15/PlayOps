import { Trophy, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ResultsPage() {
  const completedMatches = [
    {
      id: "res-1",
      tournament: "KK Wagh Monsoon Football Championship",
      round: "Quarter-Final",
      teamA: "Computer FC",
      scoreA: "3",
      teamB: "Mech United",
      scoreB: "1",
      winner: "Computer FC won by 3-1",
      date: "03 Oct 2026",
    },
    {
      id: "res-2",
      tournament: "Inter-Department Cricket Premier League",
      round: "League Match 12",
      teamA: "Civil Titans",
      scoreA: "135/8 (20 ov)",
      teamB: "IT Blasters",
      scoreB: "136/3 (16.4 ov)",
      winner: "IT Blasters won by 7 wickets",
      date: "02 Oct 2026",
    },
  ];

  return (
    <div className="container max-w-7xl space-y-8 px-4 py-8 sm:px-8">
      <div className="border-b pb-6">
        <Badge variant="outline" className="mb-2">
          Archives
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Completed Match Results
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Official scores, results, and winning scorecards of completed college sports encounters.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {completedMatches.map((m) => (
          <Card key={m.id} className="overflow-hidden">
            <div className="flex items-center justify-between border-b bg-muted/40 p-4">
              <div>
                <p className="text-xs font-semibold text-primary">{m.tournament}</p>
                <p className="text-xs text-muted-foreground">
                  {m.round} • {m.date}
                </p>
              </div>
              <Badge variant="secondary">Final Result</Badge>
            </div>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{m.teamA}</span>
                <span className="font-mono text-lg font-bold">{m.scoreA}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{m.teamB}</span>
                <span className="font-mono text-lg font-bold">{m.scoreB}</span>
              </div>
              <div className="flex items-center gap-1.5 border-t pt-2 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>{m.winner}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
