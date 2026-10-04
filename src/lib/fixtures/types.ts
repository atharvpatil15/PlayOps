export type MatchRound =
  "group" | "round_of_16" | "quarter_final" | "semi_final" | "third_place" | "final";

export interface GeneratedMatch {
  match_number: number;
  tournament_id: string;
  sport_id: string;
  team_a_id: string;
  team_b_id: string;
  venue_id?: string | null;
  match_date: string; // YYYY-MM-DD
  start_time?: string;
  round: MatchRound;
  status: "scheduled";
}

export interface GeneratedPointsTableEntry {
  tournament_id: string;
  team_id: string;
  matches_played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  net_score_diff: number;
  rank: number;
  group_name?: string;
}
