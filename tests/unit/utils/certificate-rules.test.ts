import { describe, it, expect } from "vitest";
import { isGroupSport } from "@/lib/utils/helpers";

describe("Certificate Business Rules & Eligibility", () => {
  describe("isGroupSport Classification", () => {
    it("identifies team sports (min_players > 1) as group sports", () => {
      expect(isGroupSport({ min_players_per_team: 11 })).toBe(true); // Cricket / Football
      expect(isGroupSport({ min_players_per_team: 5 })).toBe(true);  // Basketball
      expect(isGroupSport({ min_players_per_team: 6 })).toBe(true);  // Volleyball
      expect(isGroupSport({ min_players_per_team: 7 })).toBe(true);  // Kabaddi
      expect(isGroupSport({ min_players_per_team: 9 })).toBe(true);  // Kho-Kho
    });

    it("identifies individual sports (min_players <= 1) as individual sports", () => {
      expect(isGroupSport({ min_players_per_team: 1 })).toBe(false); // Chess / Athletics / Singles
      expect(isGroupSport({ min_players_per_team: 0 })).toBe(false);
      expect(isGroupSport(null)).toBe(false);
      expect(isGroupSport(undefined)).toBe(false);
    });
  });

  describe("Group Game vs Individual Game Certificate Eligibility Logic", () => {
    interface EligibilityParams {
      sport: { name: string; min_players_per_team: number };
      playerId: string;
      tournamentId: string;
      playerTeamIds: string[]; // Teams the player belongs to
      tournamentTeamIds: string[]; // Teams registered in this tournament
    }

    function checkCertificateEligibility({
      sport,
      playerId,
      tournamentId,
      playerTeamIds,
      tournamentTeamIds,
    }: EligibilityParams): { eligible: boolean; reason?: string } {
      const isGroup = isGroupSport(sport);
      const isMemberOfTournamentTeam = playerTeamIds.some((teamId) =>
        tournamentTeamIds.includes(teamId)
      );

      if (isGroup && !isMemberOfTournamentTeam) {
        return {
          eligible: false,
          reason: `Cannot issue certificate: Athlete is not part of any registered team for group sport (${sport.name}).`,
        };
      }

      return { eligible: true };
    }

    it("rejects group game certificate when athlete has no team in the tournament", () => {
      const result = checkCertificateEligibility({
        sport: { name: "Cricket", min_players_per_team: 11 },
        playerId: "player-1",
        tournamentId: "tourney-cricket-2026",
        playerTeamIds: [], // Player is not in any team
        tournamentTeamIds: ["team-alpha", "team-beta"],
      });

      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("not part of any registered team");
    });

    it("rejects group game certificate when athlete is in a team from a DIFFERENT tournament", () => {
      const result = checkCertificateEligibility({
        sport: { name: "Football", min_players_per_team: 11 },
        playerId: "player-2",
        tournamentId: "tourney-football-2026",
        playerTeamIds: ["team-other-tournament"],
        tournamentTeamIds: ["team-fc-comp", "team-fc-it"],
      });

      expect(result.eligible).toBe(false);
      expect(result.reason).toContain("not part of any registered team");
    });

    it("permits group game certificate when athlete is part of an approved team in the tournament", () => {
      const result = checkCertificateEligibility({
        sport: { name: "Volleyball", min_players_per_team: 6 },
        playerId: "player-3",
        tournamentId: "tourney-volleyball-2026",
        playerTeamIds: ["team-spikers"],
        tournamentTeamIds: ["team-spikers", "team-blockers"],
      });

      expect(result.eligible).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it("permits individual game certificate even if athlete has no team", () => {
      const result = checkCertificateEligibility({
        sport: { name: "Chess", min_players_per_team: 1 },
        playerId: "player-solo",
        tournamentId: "tourney-chess-2026",
        playerTeamIds: [], // No team
        tournamentTeamIds: [],
      });

      expect(result.eligible).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it("permits athletics certificate directly to individual athlete", () => {
      const result = checkCertificateEligibility({
        sport: { name: "Athletics", min_players_per_team: 1 },
        playerId: "player-sprinter",
        tournamentId: "tourney-athletics-2026",
        playerTeamIds: [],
        tournamentTeamIds: [],
      });

      expect(result.eligible).toBe(true);
    });
  });
});
