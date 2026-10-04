import { describe, it, expect } from "vitest";
import {
  calculateMatchPoints,
  calculateGoalDifference,
  calculateNetRunRate,
  rankStandings,
  TeamStandingRecord,
} from "@/lib/utils/standings";

describe("Points and Tiebreaker Formulas", () => {
  it("calculates match points correctly for win, draw, loss", () => {
    expect(calculateMatchPoints(true, false)).toBe(3); // Win
    expect(calculateMatchPoints(false, true)).toBe(1); // Draw
    expect(calculateMatchPoints(false, false)).toBe(0); // Loss
  });

  it("calculates goal difference properly", () => {
    expect(calculateGoalDifference(5, 2)).toBe(3);
    expect(calculateGoalDifference(1, 4)).toBe(-3);
    expect(calculateGoalDifference(2, 2)).toBe(0);
  });

  it("calculates cricket Net Run Rate (NRR) accurately", () => {
    // 160 runs in 20 overs = 8.0000
    // 140 runs conceded in 20 overs = 7.0000
    // NRR = +1.0000
    expect(calculateNetRunRate(160, 20, 140, 20)).toBe(1.0);

    // Negative NRR
    // 120 in 20 (6.0), conceded 150 in 20 (7.5) -> -1.5
    expect(calculateNetRunRate(120, 20, 150, 20)).toBe(-1.5);

    // Division by zero safety
    expect(calculateNetRunRate(100, 0, 100, 0)).toBe(0);
  });

  it("ranks teams correctly with multi-level tiebreakers", () => {
    const teams: TeamStandingRecord[] = [
      {
        teamId: "team-c",
        teamName: "Computer Engg FC",
        matchesPlayed: 3,
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        netScoreDiff: 2,
      },
      {
        teamId: "team-m",
        teamName: "Mechanical Titans",
        matchesPlayed: 3,
        wins: 3,
        losses: 0,
        draws: 0,
        points: 9,
        netScoreDiff: 5,
      },
      {
        teamId: "team-e",
        teamName: "Electrical Strikers",
        matchesPlayed: 3,
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        netScoreDiff: 4, // Higher GD than team-c
      },
      {
        teamId: "team-i",
        teamName: "IT Knights",
        matchesPlayed: 3,
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        netScoreDiff: -11,
      },
    ];

    const ranked = rankStandings(teams);

    expect(ranked[0].teamName).toBe("Mechanical Titans");
    expect(ranked[0].rank).toBe(1);

    // Electrical Strikers and Computer Engg both have 6 points,
    // but Electrical has +4 GD vs +2 GD -> Electrical is 2nd, Computer is 3rd
    expect(ranked[1].teamName).toBe("Electrical Strikers");
    expect(ranked[1].rank).toBe(2);

    expect(ranked[2].teamName).toBe("Computer Engg FC");
    expect(ranked[2].rank).toBe(3);

    expect(ranked[3].teamName).toBe("IT Knights");
    expect(ranked[3].rank).toBe(4);
  });
});
