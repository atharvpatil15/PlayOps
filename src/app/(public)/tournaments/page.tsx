import Link from "next/link";
import { Trophy, Search, Calendar, Users, MapPin, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { getTournaments } from "@/actions/tournaments";

export const revalidate = 0;

export default async function TournamentsPage() {
  const { data: tournaments } = await getTournaments();

  return (
    <div className="container max-w-7xl space-y-8 px-4 py-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Tournaments & Championships
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore live college brackets, register squads, and track KK Wagh sports cups.
          </p>
        </div>
        <Button asChild>
          <Link href="/player/profile">Athlete ID Pass</Link>
        </Button>
      </div>

      {/* Tournament Cards Grid */}
      {tournaments && tournaments.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((t: any) => {
            const approvedTeams =
              t.tournament_registrations?.filter((r: any) => r.status === "approved").length || 0;

            return (
              <Card
                key={t.id}
                className="flex flex-col justify-between shadow-sm transition-colors hover:border-primary/50"
              >
                <CardHeader className="pb-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-3xl">{t.sports?.icon || "🏆"}</span>
                    <Badge
                      variant={
                        t.status === "ongoing"
                          ? "live"
                          : t.status === "completed"
                            ? "secondary"
                            : "default"
                      }
                      className="capitalize"
                    >
                      {t.status}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-1 text-lg text-foreground">{t.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 text-xs">
                    <span>{t.sports?.name}</span>
                    <span>•</span>
                    <span className="capitalize">{t.format}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>
                      {new Date(t.start_date).toLocaleDateString()} –{" "}
                      {new Date(t.end_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>
                      {approvedTeams} / {t.max_teams} Teams Approved
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="line-clamp-1">{t.venues?.name || "Campus Ground"}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                    <Button asChild size="sm" className="w-full gap-1.5">
                      <Link href={`/tournaments/${t.id}`}>
                        <Trophy className="h-3.5 w-3.5" />
                        <span>View Bracket & Fixtures</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No Tournaments Found"
          description="There are currently no active or upcoming tournaments in the system."
        />
      )}
    </div>
  );
}
