import { z } from "zod";

export const matchScheduleSchema = z.object({
  tournamentId: z.string().uuid(),
  sportId: z.string().uuid(),
  teamAId: z.string().uuid(),
  teamBId: z.string().uuid(),
  venueId: z.string().uuid().optional().nullable(),
  matchDate: z.string().min(1, "Match date is required"),
  startTime: z.string().optional(),
  round: z.enum([
    "group",
    "round_of_16",
    "quarter_final",
    "semi_final",
    "third_place",
    "final",
  ]),
  matchNumber: z.coerce.number().min(1),
});

export type MatchScheduleInput = z.infer<typeof matchScheduleSchema>;

export const matchScoreUpdateSchema = z.object({
  matchId: z.string().uuid(),
  scoreTeamA: z.string().min(1, "Score for Team A is required"),
  scoreTeamB: z.string().min(1, "Score for Team B is required"),
  status: z.enum(["scheduled", "live", "completed", "cancelled", "postponed"]),
  winnerId: z.string().uuid().optional().nullable(),
  remarks: z.string().optional(),
});

export type MatchScoreUpdateInput = z.infer<typeof matchScoreUpdateSchema>;
