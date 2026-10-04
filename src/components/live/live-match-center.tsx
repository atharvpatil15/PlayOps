"use client";

import { useEffect, useState } from "react";
import {
  Radio,
  Flame,
  Clock,
  MapPin,
  Trophy,
  Activity,
  AlertCircle,
  Eye,
  Volume2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { getMatchDetails } from "@/actions/matches";
import { formatDate, formatTime } from "@/lib/utils/format";
import { toast } from "sonner";

interface Match {
  id: string;
  tournament_id: string;
  sport_id: string;
  team_a_id: string;
  team_b_id: string;
  venue_id: string | null;
  match_date: string;
  start_time: string | null;
  round: string;
  match_number: number;
  status: "scheduled" | "live" | "completed" | "cancelled" | "postponed";
  score_team_a: string | null;
  score_team_b: string | null;
  remarks: string | null;
  winner_id: string | null;
  tournaments?: { id: string; name: string; format: string } | null;
  sports?: { id: string; name: string; icon: string | null } | null;
  team_a?: { id: string; name: string } | null;
  team_b?: { id: string; name: string } | null;
  venues?: { id: string; name: string; location?: string } | null;
}

interface MatchEvent {
  id: string;
  match_id: string;
  event_type: string;
  player_id: string | null;
  team_id: string | null;
  event_time: string | null;
  description: string | null;
  created_at: string;
  player?: { users?: { full_name: string } | null } | null;
  teams?: { name: string } | null;
}

interface LiveMatchCenterProps {
  initialLiveMatches: Match[];
  upcomingMatches: Match[];
  sports: Array<{ id: string; name: string; icon: string | null }>;
}

export function LiveMatchCenter({
  initialLiveMatches,
  upcomingMatches,
  sports,
}: LiveMatchCenterProps) {
  const [liveMatches, setLiveMatches] = useState<Match[]>(initialLiveMatches);
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Match Details / Events modal
  const [viewingMatch, setViewingMatch] = useState<Match | null>(null);
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);

  // Setup Realtime Subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("live-matches-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
        },
        (payload) => {
          setLastUpdated(new Date());
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Match;

            setLiveMatches((prev) => {
              // If match is still live, update it in place
              if (updated.status === "live") {
                const exists = prev.some((m) => m.id === updated.id);
                if (exists) {
                  return prev.map((m) =>
                    m.id === updated.id
                      ? {
                          ...m,
                          score_team_a: updated.score_team_a,
                          score_team_b: updated.score_team_b,
                          remarks: updated.remarks,
                          status: updated.status,
                        }
                      : m
                  );
                } else {
                  return [updated, ...prev];
                }
              } else {
                // If it completed or was cancelled, remove from live list
                return prev.filter((m) => m.id !== updated.id);
              }
            });

            // Update viewing modal if it's open for this match
            setViewingMatch((current) => {
              if (current && current.id === updated.id) {
                return {
                  ...current,
                  score_team_a: updated.score_team_a,
                  score_team_b: updated.score_team_b,
                  remarks: updated.remarks,
                  status: updated.status,
                };
              }
              return current;
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_events",
        },
        (payload) => {
          const newEvent = payload.new as MatchEvent;
          toast.info(`Match Event: ${newEvent.event_type.replace(/_/g, " ").toUpperCase()}`, {
            description: newEvent.description || "Score or match state updated.",
          });

          // If currently viewing this match, prepend event
          setMatchEvents((prev) => {
            if (viewingMatch && viewingMatch.id === newEvent.match_id) {
              return [newEvent, ...prev];
            }
            return prev;
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [viewingMatch]);

  const handleOpenMatchDetails = async (match: Match) => {
    setViewingMatch(match);
    setLoadingEvents(true);
    try {
      const res = await getMatchDetails(match.id);
      if (res.data) {
        setMatchEvents((res.data.events as any) || []);
      }
    } catch {
      toast.error("Could not load match commentary.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const filteredLiveMatches = liveMatches.filter((m) => {
    if (selectedSport === "all") return true;
    return m.sport_id === selectedSport;
  });

  return (
    <div className="space-y-8">
      {/* Realtime Status Indicator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card/60 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3.5 w-3.5">
            {isConnected ? (
              <>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-amber-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                {isConnected ? "Live WebSocket Connected" : "Connecting to Live Feed..."}
              </span>
              <Badge variant="outline" className="text-[10px]">
                Supabase Realtime
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Last synched: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Sport Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedSport("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              selectedSport === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Sports
          </button>
          {sports.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSport(s.id)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                selectedSport === s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <span>{s.icon || "🏅"}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Matches Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Flame className="h-5 w-5 text-red-500" />
            <span>Active Matches In-Play ({filteredLiveMatches.length})</span>
          </h2>
          {filteredLiveMatches.length > 0 && (
            <Badge variant="live" className="flex items-center gap-1">
              <Radio className="h-3 w-3 animate-pulse" />
              <span>LIVE BROADCAST</span>
            </Badge>
          )}
        </div>

        {filteredLiveMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredLiveMatches.map((m) => (
              <Card
                key={m.id}
                className="overflow-hidden border-red-500/20 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center justify-between border-b bg-red-500/10 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{m.sports?.icon || "🏅"}</span>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {m.tournaments?.name || "Tournament"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {m.round.replace(/_/g, " ").toUpperCase()} • Match #{m.match_number}
                      </p>
                    </div>
                  </div>
                  <Badge variant="live" className="flex items-center gap-1 text-xs">
                    <Radio className="h-3 w-3 animate-pulse" />
                    <span>LIVE</span>
                  </Badge>
                </div>

                <CardContent className="space-y-4 p-5">
                  {/* Team vs Team with Score Display */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground sm:text-lg">
                          {m.team_a?.name || "Team A"}
                        </span>
                      </div>
                      <span className="font-mono text-xl font-extrabold text-primary sm:text-2xl">
                        {m.score_team_a ?? "0"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground sm:text-lg">
                          {m.team_b?.name || "Team B"}
                        </span>
                      </div>
                      <span className="font-mono text-xl font-extrabold text-primary sm:text-2xl">
                        {m.score_team_b ?? "0"}
                      </span>
                    </div>
                  </div>

                  {/* Status / Remarks */}
                  {m.remarks && (
                    <div className="flex items-start gap-2 rounded-md bg-amber-500/10 p-2.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                      <Volume2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                      <span>{m.remarks}</span>
                    </div>
                  )}

                  {/* Metadata & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {m.venues && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{m.venues.name}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs font-semibold"
                      onClick={() => handleOpenMatchDetails(m)}
                    >
                      <Eye className="h-3.5 w-3.5 text-primary" />
                      <span>Match Timeline & Events</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Radio}
            title="No Live Matches At This Moment"
            description="There are currently no ground matches in play. Check the upcoming schedule below."
          />
        )}
      </div>

      {/* Upcoming Matches Section */}
      <div className="space-y-4 border-t pt-8">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Clock className="h-5 w-5 text-primary" />
          <span>Upcoming Scheduled Matches ({upcomingMatches.length})</span>
        </h2>

        {upcomingMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches.map((m) => (
              <Card key={m.id} className="transition-colors hover:border-primary/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 p-3">
                  <span className="text-xs font-bold text-muted-foreground">
                    {m.sports?.icon || "🏅"} {m.tournaments?.name || "Tournament"}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {m.round.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  <div className="text-sm font-semibold text-foreground">
                    <div className="flex justify-between">
                      <span>{m.team_a?.name || "TBD"}</span>
                      <span className="text-xs text-muted-foreground">vs</span>
                    </div>
                    <div>{m.team_b?.name || "TBD"}</div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDate(m.match_date)} • {m.start_time ? formatTime(m.start_time) : "TBD"}
                      </span>
                    </div>
                    {m.venues && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{m.venues.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            No further matches scheduled for today.
          </p>
        )}
      </div>

      {/* Match Details & Commentary Modal */}
      <Dialog open={!!viewingMatch} onOpenChange={(open) => !open && setViewingMatch(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Live Commentary & Timeline</span>
            </DialogTitle>
            <DialogDescription>
              {viewingMatch?.tournaments?.name} • {viewingMatch?.team_a?.name} vs{" "}
              {viewingMatch?.team_b?.name}
            </DialogDescription>
          </DialogHeader>

          {viewingMatch && (
            <div className="space-y-5">
              {/* Score summary in modal */}
              <div className="flex items-center justify-around rounded-xl bg-muted/60 p-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Team A</p>
                  <p className="text-base font-bold text-foreground">
                    {viewingMatch.team_a?.name}
                  </p>
                  <p className="mt-1 font-mono text-2xl font-extrabold text-primary">
                    {viewingMatch.score_team_a ?? "0"}
                  </p>
                </div>
                <div className="text-sm font-black text-muted-foreground">VS</div>
                <div>
                  <p className="text-xs text-muted-foreground">Team B</p>
                  <p className="text-base font-bold text-foreground">
                    {viewingMatch.team_b?.name}
                  </p>
                  <p className="mt-1 font-mono text-2xl font-extrabold text-primary">
                    {viewingMatch.score_team_b ?? "0"}
                  </p>
                </div>
              </div>

              {/* Event Timeline */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground">Key Match Events</h4>
                {loadingEvents ? (
                  <p className="text-xs text-muted-foreground">Loading commentary...</p>
                ) : matchEvents.length > 0 ? (
                  <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                    {matchEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="flex items-start gap-3 rounded-lg border bg-card p-2.5 text-xs shadow-sm"
                      >
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {evt.event_time ? formatTime(evt.event_time) : "LIVE"}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {evt.event_type.replace(/_/g, " ").toUpperCase()}
                            {evt.player?.users?.full_name && ` — ${evt.player.users.full_name}`}
                            {evt.teams?.name && ` (${evt.teams.name})`}
                          </p>
                          {evt.description && (
                            <p className="mt-0.5 text-muted-foreground">{evt.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No events recorded yet. Ground scorekeeper updates will stream here.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
