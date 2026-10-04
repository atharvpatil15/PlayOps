import { describe, it, expect } from "vitest";
import { generateKnockoutFixtures } from "@/lib/fixtures/knockout";

describe("generateKnockoutFixtures", () => {
  const tournamentId = "11111111-1111-1111-1111-111111111111";
  const sportId = "22222222-2222-2222-2222-222222222222";
  const venueId = "33333333-3333-3333-3333-333333333333";
  const startDate = "2026-10-15";

  it("throws an error when fewer than 2 teams are provided", () => {
    expect(() =>
      generateKnockoutFixtures({
        tournamentId,
        sportId,
        teamIds: ["team-1"],
        startDate,
      })
    ).toThrow("At least 2 teams are required to generate knockout fixtures.");
  });

  it("correctly generates a 2-team final match with no byes", () => {
    const teamIds = ["team-a", "team-b"];
    const fixtures = generateKnockoutFixtures({
      tournamentId,
      sportId,
      teamIds,
      startDate,
      defaultVenueId: venueId,
    });

    expect(fixtures).toHaveLength(1);
    expect(fixtures[0].round).toBe("final");
    expect(fixtures[0].tournament_id).toBe(tournamentId);
    expect(fixtures[0].sport_id).toBe(sportId);
    expect(fixtures[0].venue_id).toBe(venueId);
    expect(fixtures[0].status).toBe("scheduled");
    expect(fixtures[0].match_number).toBe(1);
    expect([fixtures[0].team_a_id, fixtures[0].team_b_id]).toEqual(
      expect.arrayContaining(["team-a", "team-b"])
    );
  });

  it("correctly generates a 4-team bracket with 2 semi-final matches", () => {
    const teamIds = ["team-1", "team-2", "team-3", "team-4"];
    const fixtures = generateKnockoutFixtures({
      tournamentId,
      sportId,
      teamIds,
      startDate,
    });

    expect(fixtures).toHaveLength(2);
    fixtures.forEach((match) => {
      expect(match.round).toBe("semi_final");
      expect(match.status).toBe("scheduled");
    });
    // Check that all 4 teams are placed in round 1
    const scheduledTeams = fixtures.flatMap((m) => [m.team_a_id, m.team_b_id]);
    expect(scheduledTeams).toHaveLength(4);
    expect(scheduledTeams).toEqual(expect.arrayContaining(teamIds));
  });

  it("correctly generates an 8-team bracket with 4 quarter-final matches", () => {
    const teamIds = Array.from({ length: 8 }, (_, i) => `team-${i + 1}`);
    const fixtures = generateKnockoutFixtures({
      tournamentId,
      sportId,
      teamIds,
      startDate,
    });

    expect(fixtures).toHaveLength(4);
    fixtures.forEach((match) => {
      expect(match.round).toBe("quarter_final");
    });
  });

  it("handles non-power-of-2 team counts by allocating byes (e.g. 5 teams in bracket of 8)", () => {
    const teamIds = ["team-1", "team-2", "team-3", "team-4", "team-5"];
    const fixtures = generateKnockoutFixtures({
      tournamentId,
      sportId,
      teamIds,
      startDate,
      matchIntervalDays: 2,
    });

    // 5 teams with bracket size 8 -> 3 byes.
    // Round 1 matches count = (5 - 3) / 2 = 1 match between 2 teams.
    // Remaining 3 teams have byes, 2 of which get paired in the next round.
    expect(fixtures.length).toBeGreaterThanOrEqual(1);

    // Matches should be sequentially numbered
    fixtures.forEach((m, idx) => {
      expect(m.match_number).toBe(idx + 1);
      expect(m.status).toBe("scheduled");
    });
  });
});
