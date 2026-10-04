import { GeneratedMatch, MatchRound } from "./types";

interface KnockoutOptions {
  tournamentId: string;
  sportId: string;
  teamIds: string[];
  startDate: string; // YYYY-MM-DD
  defaultVenueId?: string | null;
  matchIntervalDays?: number;
}

export function generateKnockoutFixtures(options: KnockoutOptions): GeneratedMatch[] {
  const {
    tournamentId,
    sportId,
    teamIds,
    startDate,
    defaultVenueId = null,
    matchIntervalDays = 1,
  } = options;

  const count = teamIds.length;
  if (count < 2) {
    throw new Error("At least 2 teams are required to generate knockout fixtures.");
  }

  // Shuffle teams for fair random draw
  const shuffled = [...teamIds].sort(() => Math.random() - 0.5);

  // Determine bracket size: smallest power of 2 >= count
  let bracketSize = 2;
  while (bracketSize < count) {
    bracketSize *= 2;
  }

  const byesCount = bracketSize - count;
  const matches: GeneratedMatch[] = [];
  let matchNumberCounter = 1;
  const baseDate = new Date(startDate);

  // Helper to get round name based on remaining teams in that round
  function getRoundName(teamsInRound: number): MatchRound {
    if (teamsInRound === 2) return "final";
    if (teamsInRound === 4) return "semi_final";
    if (teamsInRound === 8) return "quarter_final";
    if (teamsInRound === 16) return "round_of_16";
    return "group";
  }

  // First Round
  // Pairs teams who do not have a bye
  const round1MatchesCount = (count - byesCount) / 2;
  const round1Teams = shuffled.slice(0, round1MatchesCount * 2);
  const teamsWithByes = shuffled.slice(round1MatchesCount * 2);

  const roundName = getRoundName(bracketSize);

  // Generate Round 1 matches
  for (let i = 0; i < round1Teams.length; i += 2) {
    const matchDate = new Date(baseDate);
    const dateStr = matchDate.toISOString().split("T")[0];

    matches.push({
      match_number: matchNumberCounter++,
      tournament_id: tournamentId,
      sport_id: sportId,
      team_a_id: round1Teams[i],
      team_b_id: round1Teams[i + 1],
      venue_id: defaultVenueId,
      match_date: dateStr,
      start_time: "10:00:00",
      round: roundName,
      status: "scheduled",
    });
  }

  // If there are byes, teams with byes are paired with dummy / placeholders or directly advance
  // If no byes (e.g. 4, 8, 16 teams), simply pairs 0-1, 2-3, 4-5...
  if (byesCount === 0) {
    // Round 1 completed all teams
    return matches;
  }

  // For tournaments with byes:
  // If we have teams with byes, let's pair them in next round or pair remaining
  let nextRoundDate = new Date(baseDate);
  nextRoundDate.setDate(nextRoundDate.getDate() + matchIntervalDays);
  const nextDateStr = nextRoundDate.toISOString().split("T")[0];
  const nextRoundName = getRoundName(bracketSize / 2);

  for (let i = 0; i < teamsWithByes.length; i += 2) {
    if (i + 1 < teamsWithByes.length) {
      matches.push({
        match_number: matchNumberCounter++,
        tournament_id: tournamentId,
        sport_id: sportId,
        team_a_id: teamsWithByes[i],
        team_b_id: teamsWithByes[i + 1],
        venue_id: defaultVenueId,
        match_date: nextDateStr,
        start_time: "14:00:00",
        round: nextRoundName,
        status: "scheduled",
      });
    }
  }

  return matches;
}
