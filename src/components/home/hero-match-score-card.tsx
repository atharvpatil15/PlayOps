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
        <div className="rounded-lg border border-border bg-card text-card-foreground p-5 sm:p-6">
          {/* Top Bar: Live Badge, Sport, Tournament, Venue, Match Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="live" className="text-xs px-2.5 py-0.5 tracking-normal flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5" />
                <span>LIVE MATCH ONGOING</span>
              </Badge>

              <span className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground">
                <span>{currentLive.sports?.icon || "🏆"}</span>
                <span>{currentLive.sports?.name || "Sport"}</span>
              </span>

              {currentLive.tournaments?.name && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  • {currentLive.tournaments.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentLive.venues?.name && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{currentLive.venues.name}</span>
                </span>
              )}

              {/* Match switcher if multiple live games */}
              {isMultipleLive && (
                <div className="flex items-center gap-1 border border-border rounded px-1 py-0.5 bg-muted/30">
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
                  <span className="px-1 text-[11px] font-medium text-foreground">
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
          <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 py-5 sm:py-6">
            {/* Team A */}
            <div className="flex items-center justify-between md:justify-end gap-3.5 md:col-span-2">
              <div className="text-left md:text-right">
                <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-wide">
                  {currentLive.round.replace(/_/g, " ")}
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                  {currentLive.team_a?.name || "Team Alpha"}
                </h3>
                <p className="mt-0.5 font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
                  {currentLive.score_team_a ?? "0"}
                </p>
              </div>
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border border-border bg-muted/40">
                <AvatarImage src={currentLive.team_a?.logo_url || ""} />
                <AvatarFallback className="bg-muted text-foreground font-semibold text-sm sm:text-base">
                  {getInitials(currentLive.team_a?.name || "TA")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* VS Badge & Live Commentary Snippet */}
            <div className="flex flex-col items-center justify-center md:col-span-1 py-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                VS
              </span>
              {currentLive.remarks ? (
                <div className="mt-2 max-w-[200px] text-center text-xs text-foreground bg-muted/50 rounded px-2.5 py-1 border border-border">
                  {currentLive.remarks}
                </div>
              ) : (
                <span className="mt-1.5 text-[11px] text-muted-foreground">
                  Match in Progress
                </span>
              )}
            </div>

            {/* Team B */}
            <div className="flex items-center justify-between md:justify-start gap-3.5 md:col-span-2">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border border-border bg-muted/40">
                <AvatarImage src={currentLive.team_b?.logo_url || ""} />
                <AvatarFallback className="bg-muted text-foreground font-semibold text-sm sm:text-base">
                  {getInitials(currentLive.team_b?.name || "TB")}
                </AvatarFallback>
              </Avatar>
              <div className="text-right md:text-left">
                <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-wide">
                  {currentLive.round.replace(/_/g, " ")}
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                  {currentLive.team_b?.name || "Team Beta"}
                </h3>
                <p className="mt-0.5 font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
                  {currentLive.score_team_b ?? "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-3">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Realtime ground feed connected</span>
            </span>

            <Button asChild size="sm" variant="default">
              <Link href={ROUTES.LIVE}>
                <Radio className="mr-1.5 h-3.5 w-3.5" />
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
        <div className="rounded-lg border border-border bg-card text-card-foreground p-5 sm:p-6">
          {/* Top Bar: Past Result Badge, Sport, Date, Venue */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2.5 py-0.5 tracking-normal flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                <span>LATEST MATCH RESULT</span>
              </Badge>

              <span className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground">
                <span>{currentPast.sports?.icon || "🏆"}</span>
                <span>{currentPast.sports?.name || "Sport"}</span>
              </span>

              {currentPast.tournaments?.name && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  • {currentPast.tournaments.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{formatDate(currentPast.match_date)}</span>
                {currentPast.venues?.name && <span>• {currentPast.venues.name}</span>}
              </span>

              {/* Match switcher if multiple completed games */}
              {isMultiplePast && (
                <div className="flex items-center gap-1 border border-border rounded px-1 py-0.5 bg-muted/30">
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
                  <span className="px-1 text-[11px] font-medium text-foreground">
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
          <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 py-5 sm:py-6">
            {/* Team A */}
            <div className="flex items-center justify-between md:justify-end gap-3.5 md:col-span-2">
              <div className="text-left md:text-right">
                <div className="flex items-center md:justify-end gap-1.5">
                  {isTeamAWinner && (
                    <Badge variant="outline" className="border-primary/30 text-primary text-[10px] px-1.5 py-0 font-medium">
                      WINNER 🏆
                    </Badge>
                  )}
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                    {currentPast.team_a?.name || "Team Alpha"}
                  </h3>
                </div>
                <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-wide">
                  {currentPast.round.replace(/_/g, " ")}
                </span>
                <p className={`mt-0.5 font-mono text-3xl sm:text-4xl font-bold tracking-tight tabular-nums ${isTeamAWinner ? "text-primary" : "text-foreground"}`}>
                  {currentPast.score_team_a ?? "0"}
                </p>
              </div>
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border border-border bg-muted/40">
                <AvatarImage src={currentPast.team_a?.logo_url || ""} />
                <AvatarFallback className="bg-muted text-foreground font-semibold text-sm sm:text-base">
                  {getInitials(currentPast.team_a?.name || "TA")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Final Badge & Result Remarks */}
            <div className="flex flex-col items-center justify-center md:col-span-1 py-1">
              <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider">
                FINAL RESULT
              </Badge>
              {currentPast.remarks && (
                <div className="mt-2 text-center text-xs text-muted-foreground max-w-[200px] line-clamp-2 bg-muted/40 rounded px-2 py-0.5 border border-border">
                  {currentPast.remarks}
                </div>
              )}
            </div>

            {/* Team B */}
            <div className="flex items-center justify-between md:justify-start gap-3.5 md:col-span-2">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border border-border bg-muted/40">
                <AvatarImage src={currentPast.team_b?.logo_url || ""} />
                <AvatarFallback className="bg-muted text-foreground font-semibold text-sm sm:text-base">
                  {getInitials(currentPast.team_b?.name || "TB")}
                </AvatarFallback>
              </Avatar>
              <div className="text-right md:text-left">
                <div className="flex items-center md:justify-start gap-1.5">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                    {currentPast.team_b?.name || "Team Beta"}
                  </h3>
                  {isTeamBWinner && (
                    <Badge variant="outline" className="border-primary/30 text-primary text-[10px] px-1.5 py-0 font-medium">
                      WINNER 🏆
                    </Badge>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-wide">
                  {currentPast.round.replace(/_/g, " ")}
                </span>
                <p className={`mt-0.5 font-mono text-3xl sm:text-4xl font-bold tracking-tight tabular-nums ${isTeamBWinner ? "text-primary" : "text-foreground"}`}>
                  {currentPast.score_team_b ?? "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-3">
            <span className="text-xs text-muted-foreground">
              Official score verified by KK Wagh Sports Committee
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button asChild variant="outline" size="sm">
                <Link href={ROUTES.POINTS_TABLE}>Points Table</Link>
              </Button>
              <Button asChild size="sm" variant="default">
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
      <div className="rounded-lg border border-border bg-card p-6 sm:p-8 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded border border-border bg-muted/40 text-muted-foreground mb-3">
          <Calendar className="h-5 w-5" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground">
          No Matches Have Taken Place Yet
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground leading-relaxed">
          No matches have been played yet for this season. As soon as tournaments kick off and ground action begins, live scores and past match results will be displayed here in real time.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={ROUTES.TOURNAMENTS}>
              Explore Upcoming Tournaments <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="default">
            <Link href={ROUTES.REGISTER}>
              Get Sports Pass 2026
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
