import { Calendar, Plus, Radio, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminMatchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Matches & Live Ground Console
          </h1>
          <p className="text-sm text-muted-foreground">
            Schedule fixtures, assign venues, and broadcast ball-by-ball / goal score updates.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Schedule New Match</span>
        </Button>
      </div>

      {/* Live Scoring Console Widget */}
      <Card className="border-red-500/40">
        <CardHeader className="bg-red-500/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <span>Ground Scorekeeper Console: Cricket Semi-Final</span>
            </CardTitle>
            <Badge variant="live">LIVE SCORING</Badge>
          </div>
          <CardDescription>
            Main Cricket Ground • Computer Strikers vs Mech Warriors
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">Computer Strikers (Batting)</p>
              <p className="text-3xl font-extrabold text-foreground font-mono">152 / 4</p>
              <p className="text-xs text-muted-foreground">17.2 Overs (Current RR: 8.76)</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">Mech Warriors (Bowling)</p>
              <p className="text-3xl font-extrabold text-muted-foreground font-mono">Yet to Bat</p>
              <p className="text-xs text-muted-foreground">Target: TBD</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Quick Score Controls
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline">+ 0 (Dot)</Button>
              <Button size="sm" variant="outline">+ 1 Run</Button>
              <Button size="sm" variant="outline">+ 2 Runs</Button>
              <Button size="sm" variant="outline" className="font-bold">+ 4 Boundary</Button>
              <Button size="sm" variant="outline" className="font-bold">+ 6 Maximum</Button>
              <Button size="sm" variant="destructive" className="font-bold">🔴 Wicket</Button>
              <Button size="sm" variant="secondary">Wide (+1)</Button>
              <Button size="sm" variant="secondary">No Ball (+1)</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
