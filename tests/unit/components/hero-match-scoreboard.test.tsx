import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroMatchScoreboard, ScoreboardMatch } from "@/components/home/hero-match-scoreboard";

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    channel: () => ({
      on: () => ({
        subscribe: () => ({}),
      }),
    }),
    removeChannel: vi.fn(),
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [] }),
      }),
    }),
  }),
}));

describe("HeroMatchScoreboard Component", () => {
  const mockLiveMatch: ScoreboardMatch = {
    id: "match-live-1",
    tournament_id: "tourney-1",
    sport_id: "sport-1",
    team_a_id: "team-a",
    team_b_id: "team-b",
    venue_id: "venue-1",
    match_date: "2026-10-15",
    start_time: "14:00:00",
    round: "semi_final",
    match_number: 1,
    status: "live",
    score_team_a: "145/4",
    score_team_b: "112/3",
    remarks: "Over 16.4 • Team B needs 34 runs to win",
    winner_id: null,
    sports: { id: "sport-1", name: "Cricket", icon: "🏏" },
    tournaments: { id: "tourney-1", name: "KK Wagh Premier League", format: "knockout" },
    team_a: { id: "team-a", name: "Computer Super Kings", logo_url: null },
    team_b: { id: "team-b", name: "Mechanical Warriors", logo_url: null },
    venues: { id: "venue-1", name: "Main Cricket Ground", location: "Campus East" },
  };

  const mockPastMatch: ScoreboardMatch = {
    id: "match-past-1",
    tournament_id: "tourney-1",
    sport_id: "sport-2",
    team_a_id: "team-c",
    team_b_id: "team-d",
    venue_id: "venue-2",
    match_date: "2026-10-14",
    start_time: "16:00:00",
    round: "final",
    match_number: 10,
    status: "completed",
    score_team_a: "3",
    score_team_b: "1",
    remarks: "Computer FC won by 2 goals in extra time",
    winner_id: "team-c",
    sports: { id: "sport-2", name: "Football", icon: "⚽" },
    tournaments: { id: "tourney-1", name: "Inter-Dept Football Cup", format: "knockout" },
    team_a: { id: "team-c", name: "Computer FC", logo_url: null },
    team_b: { id: "team-d", name: "Civil Strikers", logo_url: null },
    venues: { id: "venue-2", name: "Main Football Turf", location: "Campus West" },
  };

  it("directly renders live match score when an ongoing live match exists", () => {
    render(
      <HeroMatchScoreboard
        initialLiveMatches={[mockLiveMatch]}
        initialPastMatches={[mockPastMatch]}
        upcomingMatches={[]}
      />
    );

    // Live Badge must be visible
    expect(screen.getByText(/LIVE MATCH ONGOING/i)).toBeDefined();

    // Teams must be visible
    expect(screen.getByText("Computer Super Kings")).toBeDefined();
    expect(screen.getByText("Mechanical Warriors")).toBeDefined();

    // Scores must be directly displayed
    expect(screen.getByText("145/4")).toBeDefined();
    expect(screen.getByText("112/3")).toBeDefined();

    // Remarks must be visible
    expect(screen.getByText(/Team B needs 34 runs to win/i)).toBeDefined();
  });

  it("directly renders recent past match score when no match is live", () => {
    render(
      <HeroMatchScoreboard
        initialLiveMatches={[]}
        initialPastMatches={[mockPastMatch]}
        upcomingMatches={[]}
      />
    );

    // Past match badge must be visible
    expect(screen.getByText(/LATEST MATCH RESULT/i)).toBeDefined();

    // Final result indicator must be visible
    expect(screen.getByText(/FINAL RESULT/i)).toBeDefined();

    // Teams must be visible
    expect(screen.getByText("Computer FC")).toBeDefined();
    expect(screen.getByText("Civil Strikers")).toBeDefined();

    // Scores must be directly visible
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("1")).toBeDefined();

    // Winner badge should be displayed
    expect(screen.getByText(/WINNER/i)).toBeDefined();
  });

  it("renders sentence when no matches have taken place yet", () => {
    render(
      <HeroMatchScoreboard
        initialLiveMatches={[]}
        initialPastMatches={[]}
      />
    );

    expect(screen.getByText(/No Matches Have Taken Place Yet/i)).toBeDefined();
    expect(screen.getByText(/No matches have been played yet for this season/i)).toBeDefined();
  });
});
