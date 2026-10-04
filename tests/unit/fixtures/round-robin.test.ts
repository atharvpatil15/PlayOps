import { describe, it, expect } from "vitest";
import { generateRoundRobinFixtures } from "@/lib/fixtures/round-robin";

describe("generateRoundRobinFixtures", () => {
  const tournamentId = "11111111-1111-1111-1111-111111111111";
  const sportId = "22222222-2222-2222-2222-222222222222";
  const venueId = "33333333-3333-3333-3333-333333333333";
  const startDate = "2026-10-20";

  it("throws an error when fewer than 2 teams are provided", () => {
    expect(() =>
      generateRoundRobinFixtures({
        tournamentId,
        sportId,
        teamIds: ["solo-team"],
        startDate,
      })
    ).toThrow("At least 2 teams are required to generate league fixtures.");
  });

  it("generates correct number of matches and points table for 4 teams (even count)", () => {
    const teamIds = ["team-A", "team-B", "team-C", "team-D"];
    // N * (N - 1) / 2 = 4 * 3 / 2 = 6 matches
    const { matches, pointsTable } = generateRoundRobinFixtures({
      tournamentId,
      sportId,
      teamIds,
      startDate,
      defaultVenueId: venueId,
    });

    expect(matches).toHaveLength(6);
    expect(pointsTable).toHaveLength(4);

    // Verify all teams are represented in initial points table
    expect(pointsTable.map((p) => p.team_id)).toEqual(
      expect.arrayContaining(teamIds)
    );

    // Initial points table invariants
    pointsTable.forEach((row) => {
      expect(row.matches_played).toBe(0);
      expect(row.wins).toBe(0);
      expect(row.losses).toBe(0);
      expect(row.draws).toBe(0);
      expect(row.points).toBe(0);
      expect(row.net_score_diff).toBe(0);
      expect(row.tournament_id).toBe(tournamentId);
    });

    // Check that every team plays every other team exactly once
    const matchups = new Set<string>();
    matches.forEach((m) => {
      expect(m.status).toBe("scheduled");
      expect(m.venue_id).toBe(venueId);
      expect(m.round).toBe("group");
      expect(m.team_a_id).not.toBe(m.team_b_id);

      const pairKey = [m.team_a_id, m.team_b_id].sort().join(" vs ");
      expect(matchups.has(pairKey)).toBe(false);
      matchups.add(pairKey);
    });

    expect(matchups.size).toBe(6);
  });

  it("handles odd number of teams with byes without creating dummy bye matches (e.g. 5 teams)", () => {
    const teamIds = ["team-1", "team-2", "team-3", "team-4", "team-5"];
    // 5 teams -> 5 * 4 / 2 = 10 matches total
    const { matches, pointsTable } = generateRoundRobinFixtures({
      tournamentId,
      sportId,
      teamIds,
      startDate,
    });

    expect(matches).toHaveLength(10);
    expect(pointsTable).toHaveLength(5);

    // Ensure no match contains the internal "__BYE__" string
    matches.forEach((m) => {
      expect(m.team_a_id).not.toBe("__BYE__");
      expect(m.team_b_id).not.toBe("__BYE__");
    });

    // Check uniqueness of matchups
    const matchups = new Set<string>();
    matches.forEach((m) => {
      const pairKey = [m.team_a_id, m.team_b_id].sort().join(" vs ");
      expect(matchups.has(pairKey)).toBe(false);
      matchups.add(pairKey);
    });
    expect(matchups.size).toBe(10);
  });
});
