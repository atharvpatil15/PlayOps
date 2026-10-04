import { describe, it, expect } from "vitest";
import { tournamentSchema } from "@/lib/validations/tournament.schema";
import { matchScheduleSchema, matchScoreUpdateSchema } from "@/lib/validations/match.schema";
import { playerRegistrationSchema } from "@/lib/validations/player.schema";

describe("Tournament Schema Validation", () => {
  const validPayload = {
    name: "Inter-Department Cricket 2026",
    sportId: "550e8400-e29b-41d4-a716-446655440000",
    format: "knockout",
    startDate: "2026-10-15",
    endDate: "2026-10-20",
    registrationDeadline: "2026-10-10",
    maxTeams: 8,
    entryFee: 0,
    rules: "20 overs per side",
  };

  it("accepts valid tournament payload", () => {
    const result = tournamentSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects tournament name shorter than 3 characters", () => {
    const result = tournamentSchema.safeParse({
      ...validPayload,
      name: "AB",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid format", () => {
    const result = tournamentSchema.safeParse({
      ...validPayload,
      format: "invalid_format",
    });
    expect(result.success).toBe(false);
  });

  it("rejects maxTeams less than 2", () => {
    const result = tournamentSchema.safeParse({
      ...validPayload,
      maxTeams: 1,
    });
    expect(result.success).toBe(false);
  });
});

describe("Match Schema Validation", () => {
  const validSchedule = {
    tournamentId: "550e8400-e29b-41d4-a716-446655440000",
    sportId: "550e8400-e29b-41d4-a716-446655440001",
    teamAId: "550e8400-e29b-41d4-a716-446655440002",
    teamBId: "550e8400-e29b-41d4-a716-446655440003",
    matchDate: "2026-10-16",
    startTime: "10:00:00",
    round: "semi_final",
    matchNumber: 1,
  };

  it("accepts valid match schedule payload", () => {
    const result = matchScheduleSchema.safeParse(validSchedule);
    expect(result.success).toBe(true);
  });

  it("rejects non-uuid team IDs", () => {
    const result = matchScheduleSchema.safeParse({
      ...validSchedule,
      teamAId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("validates score update payload with valid status", () => {
    const scorePayload = {
      matchId: "550e8400-e29b-41d4-a716-446655440000",
      scoreTeamA: "3",
      scoreTeamB: "1",
      status: "completed",
      winnerId: "550e8400-e29b-41d4-a716-446655440002",
    };
    const result = matchScoreUpdateSchema.safeParse(scorePayload);
    expect(result.success).toBe(true);
  });
});

describe("Player Registration Schema Validation", () => {
  const validPlayer = {
    registrationNumber: "KKW2024CS045",
    department: "Computer Engineering",
    year: "TE",
    dateOfBirth: "2004-05-15",
    bloodGroup: "O+",
    sportsInterested: ["Cricket", "Football"],
    emergencyContact: "9876543210",
  };

  it("accepts valid student athlete profile", () => {
    const result = playerRegistrationSchema.safeParse(validPlayer);
    expect(result.success).toBe(true);
  });

  it("rejects invalid date format", () => {
    const result = playerRegistrationSchema.safeParse({
      ...validPlayer,
      dateOfBirth: "15/05/2004", // Invalid: must be YYYY-MM-DD
    });
    expect(result.success).toBe(false);
  });

  it("requires at least one sport of interest", () => {
    const result = playerRegistrationSchema.safeParse({
      ...validPlayer,
      sportsInterested: [],
    });
    expect(result.success).toBe(false);
  });
});
