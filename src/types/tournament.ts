import type { Database } from "./database.types";

export type Tournament = Database["public"]["Tables"]["tournaments"]["Row"];
export type TournamentInsert = Database["public"]["Tables"]["tournaments"]["Insert"];
export type TournamentUpdate = Database["public"]["Tables"]["tournaments"]["Update"];

export interface TournamentWithSportVenue extends Tournament {
  sport?: Database["public"]["Tables"]["sports"]["Row"];
  venue?: Database["public"]["Tables"]["venues"]["Row"] | null;
  registeredTeamsCount?: number;
}
