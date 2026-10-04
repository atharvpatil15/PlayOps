import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PlayerMatchesPage() {
  const matches = [
    {
      id: "pm-1",
      tournament: "Inter-Dept Cricket Premier League",
      opponent: "Mech Warriors",
      date: "15 Oct 2026",
      time: "10:00 AM",
      venue: "Main Cricket Ground",
      status: "Scheduled",
      stage: "Semi-Final",
    },
    {
      id: "pm-2",
      tournament: "Inter-Dept Cricket Premier League",
      opponent: "Civil Titans",
      date: "02 Oct 2026",
      time: "02:00 PM",
      venue: "Main Cricket Ground",
      status: "Won by 38 runs",
      stage: "League Stage",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Match Schedule
        </h1>
        <p className="text-sm text-muted-foreground">
          View past and upcoming fixtures scheduled for your squad.
        </p>
      </div>

      <div className="space-y-4">
        {matches.map((m) => (
          <Card key={m.id} className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 mb-3">
              <span className="text-xs font-semibold text-primary">{m.tournament} • {m.stage}</span>
              <Badge variant={m.status === "Scheduled" ? "default" : "success"}>{m.status}</Badge>
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="font-bold text-base text-foreground">Computer Strikers vs {m.opponent}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {m.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {m.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {m.venue}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
