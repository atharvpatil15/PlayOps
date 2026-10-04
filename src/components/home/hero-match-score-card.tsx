"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Radio,
  Trophy,
  Calendar,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils/format";
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

export interface HeroMatchScoreCardProps {
  initialLiveMatches?: ScoreboardMatch[];
  initialPastMatches?: ScoreboardMatch[];
  upcomingMatches?: ScoreboardMatch[];
}

export function HeroMatchScoreCard({
  initialLiveMatches = [],
  initialPastMatches = [],
}: HeroMatchScoreCardProps) {
  const [liveMatches, setLiveMatches] = useState<ScoreboardMatch[]>(initialLiveMatches);
  const [pastMatches, setPastMatches] = useState<ScoreboardMatch[]>(initialPastMatches);
  const [activeLiveIdx, setActiveLiveIdx] = useState(0);
  const [activePastIdx, setActivePastIdx] = useState(0);

  // Setup Supabase Realtime Subscription for instant score broadcast
  useEffect(() => {
    const supabase = createClient();

    async function fetchFreshMatches() {
      const { data: fresh } = await supabase
        .from("matches")
        .select(
          "*, tournaments(id, name, format), sports(id, name, icon), team_a:teams!matches_team_a_id_fkey(id, name, logo_url), team_b:teams!matches_team_b_id_fkey(id, name, logo_url), venues(id, name, location)"
        )
        .order("match_date", { ascending: false });

      if (fresh) {
        const live = fresh.filter((m) => m.status === "live");
        const completed = fresh.filter((m) => m.status === "completed");
        setLiveMatches(live as unknown as ScoreboardMatch[]);
        setPastMatches(completed as unknown as ScoreboardMatch[]);
      }
    }

    const channel = supabase
      .channel("hero-match-score-card")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
        },
        async () => {
          fetchFreshMatches();
        }
      )
      .subscribe();

    // If no initial matches were passed from the server, query Supabase
    if (initialLiveMatches.length === 0 && initialPastMatches.length === 0) {
      fetchFreshMatches();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialLiveMatches.length, initialPastMatches.length]);

  const hasLive = liveMatches.length > 0;
  const currentLive = hasLive ? liveMatches[activeLiveIdx] || liveMatches[0] : null;

  const hasPast = pastMatches.length > 0;
  const currentPast = hasPast ? pastMatches[activePastIdx] || pastMatches[0] : null;

  // =========================================================================
  // CASE 1: LIVE MATCH IS ONGOING -> SHOW LIVE MATCH SCORE CARD ONLY
  // =========================================================================
  if (hasLive && currentLive) {
    const isMultipleLive = liveMatches.length > 1;

    return (
      <div className="w-full">
        <div className="relative overflow-hidden rounded-2xl border-2 border-red-500/50 bg-gradient-to-b from-red-500/10 via-card to-background p-5 sm:p-6 shadow-xl transition-all">
          {/* Top Bar: Live Badge, Sport, Tournament, Venue, Match Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-red-600 text-white font-extrabold text-xs px-3 py-1 tracking-wider animate-pulse flex items-center gap-1.5 shadow-sm">
                <Radio className="h-3.5 w-3.5" />
                <span>LIVE MATCH ONGOING</span>
              </Badge>

              <Badge variant="outline" className="border-border text-xs sm:text-sm font-semibold">
                <span>{currentLive.sports?.icon || "🏆"}</span>
                <span className="ml-1.5">{currentLive.sports?.name || "Sport"}</span>
              </Badge>

              {currentLive.tournaments?.name && (
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                  • {currentLive.tournaments.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentLive.venues?.name && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{currentLive.venues.name}</span>
                </span>
              )}

              {/* Match switcher if multiple live games */}
              {isMultipleLive && (
                <div className="flex items-center gap-1 border border-border rounded-md px-1 py-0.5 bg-background/50">
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
                  <span className="px-1 text-[11px] font-bold">
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

          {/* Central Live Match Scoreboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 py-6 sm:py-7">
            {/* Team A */}
            <div className="flex items-center justify-between md:justify-end gap-3 md:col-span-2">
              <div className="text-left md:text-right">
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {currentLive.team_a?.name || "Team Alpha"}
                </h3>
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  {currentLive.round.replace(/_/g, " ")}
                </span>
                <p className="mt-1 font-mono text-2xl sm:text-4xl font-black tracking-tight text-primary">
                  {currentLive.score_team_a ?? "0"}
                </p>
              </div>
              <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-border shadow-md">
                <AvatarImage src={currentLive.team_a?.logo_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-black text-base sm:text-lg">
                  {getInitials(currentLive.team_a?.name || "TA")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* VS Badge & Live Commentary Snippet */}
            <div className="flex flex-col items-center justify-center md:col-span-1 py-1">
              <div className="rounded-full border border-border bg-muted/80 px-4 py-1 text-xs font-black uppercase tracking-widest text-muted-foreground shadow-inner">
                VS
              </div>
              {currentLive.remarks ? (
                <div className="mt-2.5 max-w-[200px] text-center text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 rounded-md px-2.5 py-1 border border-red-500/20">
                  {currentLive.remarks}
                </div>
              ) : (
                <span className="mt-2 text-[11px] text-muted-foreground font-semibold">
                  Match in Progress
                </span>
              )}
            </div>

            {/* Team B */}
            <div className="flex items-center justify-between md:justify-start gap-3 md:col-span-2">
              <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-border shadow-md">
                <AvatarImage src={currentLive.team_b?.logo_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-black text-base sm:text-lg">
                  {getInitials(currentLive.team_b?.name || "TB")}
                </AvatarFallback>
              </Avatar>
              <div className="text-right md:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {currentLive.team_b?.name || "Team Beta"}
                </h3>
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  {currentLive.round.replace(/_/g, " ")}
                </span>
                <p className="mt-1 font-mono text-2xl sm:text-4xl font-black tracking-tight text-primary">
                  {currentLive.score_team_b ?? "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/50 pt-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>Realtime ground WebSocket feed active</span>
            </span>

            <Button asChild size="sm" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm">
              <Link href={ROUTES.LIVE}>
                <Radio className="mr-1.5 h-3.5 w-3.5 animate-pulse" />
                Go to Live Match Center ❯
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 2: NO LIVE MATCH ONGOING -> SHOW LATEST PAST MATCH SCORE
  // =========================================================================
  if (hasPast && currentPast) {
    const isMultiplePast = pastMatches.length > 1;
    const isTeamAWinner = currentPast.winner_id === currentPast.team_a_id;
    const isTeamBWinner = currentPast.winner_id === currentPast.team_b_id;

    return (
      <div className="w-full">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-muted/40 via-card to-background p-5 sm:p-6 shadow-lg transition-all">
          {/* Top Bar: Past Result Badge, Sport, Date, Venue */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-extrabold text-xs px-3 py-1 tracking-wider flex items-center gap-1.5 shadow-sm">
                <Trophy className="h-3.5 w-3.5 text-amber-300" />
                <span>LATEST MATCH RESULT</span>
              </Badge>

              <Badge variant="outline" className="border-border text-xs sm:text-sm font-semibold">
                <span>{currentPast.sports?.icon || "🏆"}</span>
                <span className="ml-1.5">{currentPast.sports?.name || "Sport"}</span>
              </Badge>

              {currentPast.tournaments?.name && (
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                  • {currentPast.tournaments.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{formatDate(currentPast.match_date)}</span>
                {currentPast.venues?.name && <span>• {currentPast.venues.name}</span>}
              </span>

              {/* Match switcher if multiple completed games */}
              {isMultiplePast && (
                <div className="flex items-center gap-1 border border-border rounded-md px-1 py-0.5 bg-background/50">
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
                  <span className="px-1 text-[11px] font-bold">
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

          {/* Central Completed Scoreboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 py-6 sm:py-7">
            {/* Team A */}
            <div className="flex items-center justify-between md:justify-end gap-3 md:col-span-2">
              <div className="text-left md:text-right">
                <div className="flex items-center md:justify-end gap-1.5">
                  {isTeamAWinner && (
                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-black text-[10px] px-1.5 py-0.5">
                      WINNER 🏆
                    </Badge>
                  )}
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                    {currentPast.team_a?.name || "Team Alpha"}
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  {currentPast.round.replace(/_/g, " ")}
                </span>
                <p className={`mt-1 font-mono text-2xl sm:text-4xl font-black tracking-tight ${isTeamAWinner ? "text-primary" : "text-foreground"}`}>
                  {currentPast.score_team_a ?? "0"}
                </p>
              </div>
              <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-border shadow-md">
                <AvatarImage src={currentPast.team_a?.logo_url || ""} />
                <AvatarFallback className="bg-muted text-foreground font-black text-base sm:text-lg">
                  {getInitials(currentPast.team_a?.name || "TA")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Final Badge & Result Remarks */}
            <div className="flex flex-col items-center justify-center md:col-span-1 py-1">
              <Badge variant="secondary" className="px-3 py-1 text-xs font-black uppercase tracking-wider">
                FINAL RESULT
              </Badge>
              {currentPast.remarks && (
                <div className="mt-2 text-center text-xs font-semibold text-muted-foreground max-w-[200px] line-clamp-2">
                  {currentPast.remarks}
                </div>
              )}
            </div>

            {/* Team B */}
            <div className="flex items-center justify-between md:justify-start gap-3 md:col-span-2">
              <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-border shadow-md">
                <AvatarImage src={currentPast.team_b?.logo_url || ""} />
                <AvatarFallback className="bg-muted text-foreground font-black text-base sm:text-lg">
                  {getInitials(currentPast.team_b?.name || "TB")}
                </AvatarFallback>
              </Avatar>
              <div className="text-right md:text-left">
                <div className="flex items-center md:justify-start gap-1.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                    {currentPast.team_b?.name || "Team Beta"}
                  </h3>
                  {isTeamBWinner && (
                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-black text-[10px] px-1.5 py-0.5">
                      WINNER 🏆
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  {currentPast.round.replace(/_/g, " ")}
                </span>
                <p className={`mt-1 font-mono text-2xl sm:text-4xl font-black tracking-tight ${isTeamBWinner ? "text-primary" : "text-foreground"}`}>
                  {currentPast.score_team_b ?? "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/50 pt-3">
            <span className="text-xs text-muted-foreground font-medium">
              Official score verified by KK Wagh Sports Committee
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button asChild variant="outline" size="sm" className="font-bold text-xs">
                <Link href={ROUTES.POINTS_TABLE}>Points Table</Link>
              </Button>
              <Button asChild size="sm" className="font-bold text-xs shadow-sm">
                <Link href={ROUTES.RESULTS}>
                  All Match Results ❯
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE 3: NOTHING HAS HAPPENED YET (NO LIVE AND NO PAST MATCHES)
  // Display a clear sentence informing visitors that no matches have taken place.
  // =========================================================================
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-border/80 bg-card/50 p-6 sm:p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
          <Calendar className="h-7 w-7" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground">
          No Matches Have Taken Place Yet
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed">
          No matches have been played yet for this season. As soon as tournaments kick off and ground action begins, live scores and past match results will be displayed here in real time.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline" size="sm" className="font-semibold text-xs">
            <Link href={ROUTES.TOURNAMENTS}>
              Explore Upcoming Tournaments <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm" className="font-semibold text-xs">
            <Link href={ROUTES.REGISTER}>
              Get Sports Pass 2026
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
