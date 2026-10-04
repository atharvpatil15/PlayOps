import type { Database } from "./database.types";

export type Match = Database["public"]["Tables"]["matches"]["Row"];
export type MatchInsert = Database["public"]["Tables"]["matches"]["Insert"];
export type MatchUpdate = Database["public"]["Tables"]["matches"]["Update"];

export interface MatchWithTeams extends Match {
  team_a: Database["public"]["Tables"]["teams"]["Row"];
  team_b: Database["public"]["Tables"]["teams"]["Row"];
  sport: Database["public"]["Tables"]["sports"]["Row"];
  venue?: Database["public"]["Tables"]["venues"]["Row"] | null;
}
