import { z } from "zod";

export const tournamentSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters"),
  sportId: z.string().uuid("Please select a valid sport"),
  format: z.enum(["knockout", "league", "group+knockout"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  registrationDeadline: z.string().min(1, "Registration deadline is required"),
  venueId: z.string().uuid().optional().nullable(),
  maxTeams: z.coerce.number().min(2, "At least 2 teams required"),
  entryFee: z.coerce.number().min(0).default(0),
  rules: z.string().optional(),
});

export type TournamentInput = z.infer<typeof tournamentSchema>;
