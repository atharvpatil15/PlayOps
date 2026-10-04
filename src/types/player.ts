import type { Database } from "./database.types";

export type Player = Database["public"]["Tables"]["players"]["Row"];
export type PlayerInsert = Database["public"]["Tables"]["players"]["Insert"];
export type PlayerUpdate = Database["public"]["Tables"]["players"]["Update"];

export interface PlayerWithUser extends Player {
  user: Database["public"]["Tables"]["users"]["Row"];
}

export interface PlayerStats {
  matchesPlayed: number;
  goals: number;
  runs: number;
  points: number;
  wickets: number;
  rating: number | null;
}
