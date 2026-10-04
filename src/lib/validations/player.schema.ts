import { z } from "zod";

export const playerRegistrationSchema = z.object({
  registrationNumber: z.string().min(3, "Valid registration/PRN number is required"),
  department: z.string().min(2, "Department is required"),
  year: z.enum(["FE", "SE", "TE", "BE"]),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  bloodGroup: z.string().optional(),
  height: z.coerce.number().positive().optional(),
  weight: z.coerce.number().positive().optional(),
  sportsInterested: z.array(z.string()).min(1, "Select at least one sport"),
  emergencyContact: z.string().min(10, "Emergency contact must be at least 10 digits"),
  medicalInfo: z.string().optional(),
});

export type PlayerRegistrationInput = z.infer<typeof playerRegistrationSchema>;
