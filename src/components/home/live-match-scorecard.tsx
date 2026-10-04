"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Radio,
  Trophy,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Volume2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatTime } from "@/lib/utils/format";
import { getInitials } from "@/lib/utils/helpers";
import { ROUTES } from "@/lib/constants/routes";

export interface ScoreboardMatch {
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
  team_a?: { id: string; name: string; logo_url?: string | null } | null;
  team_b?: { id: string; name: string; logo_url?: string | null } | null;
  venues?: { id: string; name: string; location?: string } | null;
}

interface LiveMatchScorecardProps {
  initialLiveMatches: ScoreboardMatch[];
  initialPastMatches: ScoreboardMatch[];
  initialUpcomingMatches: ScoreboardMatch[];
}

export function LiveMatchScorecard({
  initialLiveMatches,
  initialPastMatches,
  initialUpcomingMatches,
}: LiveMatchScorecardProps) {
  const [liveMatches, setLiveMatches] = useState<ScoreboardMatch[]>(initialLiveMatches);
  const [pastMatches, setPastMatches] = useState<ScoreboardMatch[]>(initialPastMatches);
  const [upcomingMatches, setUpcomingMatches] = useState<ScoreboardMatch[]>(initialUpcomingMatches);
  const [activeLiveIdx, setActiveLiveIdx] = useState(0);
  const [activePastIdx, setActivePastIdx] = useState(0);

  // Setup Realtime WebSocket Listener for Matches
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("landing-live-scorecard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
        },
        async () => {
          // Re-fetch fresh state on match update
          const { data: fresh } = await supabase
            .from("matches")
            .select(
              "*, tournaments(id, name, format), sports(id, name, icon), team_a:teams!matches_team_a_id_fkey(id, name, logo_url), team_b:teams!matches_team_b_id_fkey(id, name, logo_url), venues(id, name, location)"
            )
            .order("match_date", { ascending: false });

          if (fresh) {
            const live = fresh.filter((m) => m.status === "live");
            const completed = fresh.filter((m) => m.status === "completed");
            const scheduled = fresh.filter((m) => m.status === "scheduled");
            setLiveMatches(live as unknown as ScoreboardMatch[]);
            setPastMatches(completed as unknown as ScoreboardMatch[]);
            setUpcomingMatches(scheduled as unknown as ScoreboardMatch[]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const hasLive = liveMatches.length > 0;
  const currentLive = hasLive ? liveMatches[activeLiveIdx] || liveMatches[0] : null;

  const hasPast = pastMatches.length > 0;
  const currentPast = hasPast ? pastMatches[activePastIdx] || pastMatches[0] : null;

  const hasUpcoming = upcomingMatches.length > 0;
  const currentUpcoming = hasUpcoming ? upcomingMatches[0] : null;

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-muted/30 via-background to-muted/10 py-12 md:py-16">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              {hasLive ? (
                <Badge variant="live" className="flex items-center gap-1.5 px-3 py-1 font-bold">
                  <span className="flex h-2 w-2 animate-pulse rounded-full bg-white" />
                  <span>LIVE IN-PLAY GROUND BROADCAST</span>
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1.5 border border-primary/20 bg-primary/5 px-3 py-1 text-primary">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  <span>OFFICIAL TOURNAMENT SCORECARD</span>
                </Badge>
              )}
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Live Ground Arena &amp; Scorecard
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Minute-by-minute scores, ground commentary, and live fixture updates directly from KK Wagh sports grounds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
              <Link href={ROUTES.POINTS_TABLE}>Points Table</Link>
            </Button>
            <Button asChild size="sm" className="text-xs font-semibold">
              <Link href={ROUTES.LIVE}>
                <Radio className="mr-1.5 h-3.5 w-3.5 animate-pulse text-red-500" />
                Live Match Center
              </Link>
            </Button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CASE 1: ONGOING LIVE MATCH DISPLAY                      */}
        {/* ======================================================== */}
        {hasLive && currentLive ? (
          <div className="w-full">
            <div className="relative overflow-hidden rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-card via-background to-card p-6 shadow-xl backdrop-blur-md transition-all sm:p-8">
              {/* Subtle Ambient Red Glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

              {/* Top Bar: Indicators & Metadata */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="live" className="flex items-center gap-2 px-3 py-1 font-bold text-xs uppercase tracking-wider">
                    <span className="flex h-2 w-2 animate-ping rounded-full bg-white" />
                    <span className="flex h-2 w-2 rounded-full bg-white" />
                    <span>GROUND MATCH IN-PLAY</span>
                  </Badge>

                  <Badge variant="outline" className="border-border/60 bg-muted/60 text-xs sm:text-sm font-semibold">
                    <span>{currentLive.sports?.icon || "🏆"}</span>
                    <span className="ml-1.5">{currentLive.sports?.name || "Sport"}</span>
                  </Badge>

                  {currentLive.tournaments?.name && (
                    <span className="hidden text-xs font-medium text-muted-foreground sm:inline-block">
                      • {currentLive.tournaments.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {currentLive.venues?.name && (
                    <div className="flex items-center gap-1 font-semibold text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{currentLive.venues.name}</span>
                    </div>
                  )}

                  {/* Multi-match switcher if >1 live matches */}
                  {liveMatches.length > 1 && (
                    <div className="flex items-center gap-1 rounded-md border border-border/60 bg-muted/60 p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          setActiveLiveIdx((prev) => (prev > 0 ? prev - 1 : liveMatches.length - 1))
                        }
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </Button>
                      <span className="px-1 text-[11px] font-bold text-foreground">
                        {activeLiveIdx + 1}/{liveMatches.length}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          setActiveLiveIdx((prev) => (prev < liveMatches.length - 1 ? prev + 1 : 0))
                        }
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Central Stadium Scoreboard */}
              <div className="relative z-10 grid grid-cols-1 items-center gap-6 py-6 md:grid-cols-5 md:py-8">
                {/* Team Alpha */}
                <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                  <div className="text-left md:text-right">
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                      {currentLive.team_a?.name || "Team Alpha"}
                    </h3>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      {currentLive.round.replace(/_/g, " ")} • Host Side
                    </span>
                  </div>
                  <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-md sm:h-18 sm:w-18">
                    <AvatarImage src={currentLive.team_a?.logo_url || ""} />
                    <AvatarFallback className="bg-primary/10 text-base font-black text-primary sm:text-xl">
                      {getInitials(currentLive.team_a?.name || "TA")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* LED Score Centerpiece */}
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-border/80 bg-muted/40 p-4 shadow-inner md:col-span-1">
                  <div className="flex items-center gap-3 font-mono text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
                    <span className="text-primary">{currentLive.score_team_a ?? "0"}</span>
                    <span className="text-muted-foreground/40">:</span>
                    <span className="text-primary">{currentLive.score_team_b ?? "0"}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-red-500 uppercase">
                    <Radio className="h-3 w-3 animate-pulse" />
                    <span>Live Action</span>
                  </div>
                </div>

                {/* Team Beta */}
                <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-start">
                  <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-md sm:h-18 sm:w-18">
                    <AvatarImage src={currentLive.team_b?.logo_url || ""} />
                    <AvatarFallback className="bg-primary/10 text-base font-black text-primary sm:text-xl">
                      {getInitials(currentLive.team_b?.name || "TB")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-right md:text-left">
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                      {currentLive.team_b?.name || "Team Beta"}
                    </h3>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      {currentLive.round.replace(/_/g, " ")} • Challenger
                    </span>
                  </div>
                </div>
              </div>

              {/* Remarks Ticker */}
              {currentLive.remarks && (
                <div className="relative z-10 mb-4 flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-center text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300">
                  <Volume2 className="h-4 w-4 shrink-0 animate-pulse text-amber-500" />
                  <span>{currentLive.remarks}</span>
                </div>
              )}

              {/* Action Footer */}
              <div className="relative z-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-4 sm:flex-row">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Realtime Supabase Ground Telemetry Feed active</span>
                </span>

                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                  <Button asChild size="sm" className="font-semibold shadow-md">
                    <Link href={ROUTES.LIVE}>
                      <Radio className="mr-1.5 h-3.5 w-3.5 animate-pulse text-white" />
                      Full Commentary &amp; Live Timeline ❯
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* CASE 2: NO CURRENT LIVE MATCH -> LATEST VERIFIED RESULT  */
          /* ======================================================== */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            {/* Recent Match Result Card */}
            <div className="lg:col-span-8">
              {currentPast ? (
                <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card/90 to-background p-6 shadow-md transition-all sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1.5 border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary">
                        <Trophy className="h-3.5 w-3.5 text-amber-500" />
                        <span>LATEST VERIFIED RESULT</span>
                      </Badge>

                      <Badge variant="outline" className="border-border/60 text-xs font-semibold">
                        <span>{currentPast.sports?.icon || "🏆"}</span>
                        <span className="ml-1.5">{currentPast.sports?.name || "Sport"}</span>
                      </Badge>

                      {currentPast.tournaments?.name && (
                        <span className="hidden text-xs text-muted-foreground sm:inline-block">
                          • {currentPast.tournaments.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>{formatDate(currentPast.match_date)}</span>
                      </div>

                      {/* Past match pagination */}
                      {pastMatches.length > 1 && (
                        <div className="flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              setActivePastIdx((prev) => (prev > 0 ? prev - 1 : pastMatches.length - 1))
                            }
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </Button>
                          <span className="px-1 text-[11px] font-bold text-foreground">
                            {activePastIdx + 1}/{pastMatches.length}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              setActivePastIdx((prev) => (prev < pastMatches.length - 1 ? prev + 1 : 0))
                            }
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teams & Score */}
                  <div className="grid grid-cols-1 items-center gap-6 py-6 md:grid-cols-5 md:py-8">
                    {/* Team A */}
                    <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                      <div className="text-left md:text-right">
                        <div className="flex items-center gap-2 md:justify-end">
                          {currentPast.winner_id === currentPast.team_a_id && (
                            <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30 text-[10px] px-1.5 py-0.5">
                              WINNER 🏆
                            </Badge>
                          )}
                          <h3 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                            {currentPast.team_a?.name || "Team Alpha"}
                          </h3>
                        </div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {currentPast.round.replace(/_/g, " ")}
                        </span>
                      </div>
                      <Avatar className="h-14 w-14 border border-border shadow-sm">
                        <AvatarImage src={currentPast.team_a?.logo_url || ""} />
                        <AvatarFallback className="bg-primary/10 text-base font-bold text-primary">
                          {getInitials(currentPast.team_a?.name || "TA")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Final Score */}
                    <div className="flex flex-col items-center justify-center rounded-xl bg-muted/40 p-4 shadow-inner md:col-span-1">
                      <div className="flex items-center gap-2 font-mono text-3xl font-extrabold tracking-tight sm:text-4xl">
                        <span className={currentPast.winner_id === currentPast.team_a_id ? "text-primary font-black" : "text-foreground"}>
                          {currentPast.score_team_a ?? "0"}
                        </span>
                        <span className="text-muted-foreground/40">-</span>
                        <span className={currentPast.winner_id === currentPast.team_b_id ? "text-primary font-black" : "text-foreground"}>
                          {currentPast.score_team_b ?? "0"}
                        </span>
                      </div>
                      <Badge variant="outline" className="mt-1 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        FINAL RESULT
                      </Badge>
                    </div>

                    {/* Team B */}
                    <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-start">
                      <Avatar className="h-14 w-14 border border-border shadow-sm">
                        <AvatarImage src={currentPast.team_b?.logo_url || ""} />
                        <AvatarFallback className="bg-primary/10 text-base font-bold text-primary">
                          {getInitials(currentPast.team_b?.name || "TB")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-right md:text-left">
                        <div className="flex items-center gap-2 md:justify-start">
                          <h3 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                            {currentPast.team_b?.name || "Team Beta"}
                          </h3>
                          {currentPast.winner_id === currentPast.team_b_id && (
                            <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30 text-[10px] px-1.5 py-0.5">
                              WINNER 🏆
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {currentPast.round.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary / Remarks */}
                  {currentPast.remarks && (
                    <div className="mb-4 rounded-xl border border-border/50 bg-muted/30 px-4 py-2 text-center text-xs sm:text-sm text-muted-foreground">
                      📝 <span className="font-medium text-foreground">{currentPast.remarks}</span>
                    </div>
                  )}

                  {/* Action Footer */}
                  <div className="flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-4 sm:flex-row">
                    <span className="text-xs text-muted-foreground">
                      Certified by KK Wagh Physical Education Directorate
                    </span>
                    <Button asChild size="sm" variant="outline" className="font-semibold">
                      <Link href={ROUTES.RESULTS}>
                        All Match Archives
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
                  <Trophy className="h-10 w-10 text-muted-foreground/60" />
                  <h4 className="mt-3 text-base font-bold text-foreground">Upcoming Athletic Season</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Matches and live scorecards will stream live as tournaments kick off.
                  </p>
                </div>
              )}
            </div>

            {/* Upcoming Fixture Card Spotlight */}
            <div className="lg:col-span-4">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card/90 to-background p-6 shadow-md sm:p-8">
                <div>
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                      <Clock className="mr-1.5 h-3.5 w-3.5" />
                      NEXT FIXTURE
                    </Badge>
                    {currentUpcoming && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatDate(currentUpcoming.match_date)}
                      </span>
                    )}
                  </div>

                  {currentUpcoming ? (
                    <div className="space-y-4 py-6">
                      <div className="text-center">
                        <span className="text-2xl">{currentUpcoming.sports?.icon || "🏆"}</span>
                        <p className="text-xs font-semibold text-muted-foreground mt-1">
                          {currentUpcoming.tournaments?.name || "Tournament Encounter"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-muted/40 p-4">
                        <div className="text-left">
                          <p className="font-serif text-base font-bold text-foreground">
                            {currentUpcoming.team_a?.name || "Team Alpha"}
                          </p>
                          <span className="text-[11px] text-muted-foreground">Squad A</span>
                        </div>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-black text-primary">
                          VS
                        </span>
                        <div className="text-right">
                          <p className="font-serif text-base font-bold text-foreground">
                            {currentUpcoming.team_b?.name || "Team Beta"}
                          </p>
                          <span className="text-[11px] text-muted-foreground">Squad B</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        {currentUpcoming.venues && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            <span>{currentUpcoming.venues.name}</span>
                          </div>
                        )}
                        {currentUpcoming.start_time && (
                          <div className="flex items-center gap-1.5 font-mono">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span>Kickoff at {formatTime(currentUpcoming.start_time)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-muted-foreground">
                      No scheduled matches in queue for today.
                    </div>
                  )}
                </div>

                <div className="border-t border-border/50 pt-4">
                  <Button asChild size="sm" className="w-full font-semibold">
                    <Link href={ROUTES.TOURNAMENTS}>
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                      Browse All Brackets
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
