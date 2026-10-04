import { GeneratedMatch, GeneratedPointsTableEntry } from "./types";

interface RoundRobinOptions {
  tournamentId: string;
  sportId: string;
  teamIds: string[];
  startDate: string; // YYYY-MM-DD
  defaultVenueId?: string | null;
  matchIntervalDays?: number;
}

export interface RoundRobinResult {
  matches: GeneratedMatch[];
  pointsTable: GeneratedPointsTableEntry[];
}

export function generateRoundRobinFixtures(options: RoundRobinOptions): RoundRobinResult {
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
    throw new Error("At least 2 teams are required to generate league fixtures.");
  }

  // Work with a copy of teams
  const teams = [...teamIds];
  const hasBye = count % 2 !== 0;

  if (hasBye) {
    teams.push("__BYE__");
  }

  const numTeams = teams.length;
  const numRounds = numTeams - 1;
  const matchesPerRound = numTeams / 2;

  const matches: GeneratedMatch[] = [];
  let matchNumberCounter = 1;
  const baseDate = new Date(startDate);

  // Berger circle method
  for (let round = 0; round < numRounds; round++) {
    const roundDate = new Date(baseDate);
    roundDate.setDate(roundDate.getDate() + round * matchIntervalDays);
    const dateStr = roundDate.toISOString().split("T")[0];

    for (let match = 0; match < matchesPerRound; match++) {
      const home = teams[match];
      const away = teams[numTeams - 1 - match];

      // Ignore BYE match
      if (home === "__BYE__" || away === "__BYE__") {
        continue;
      }

      matches.push({
        match_number: matchNumberCounter++,
        tournament_id: tournamentId,
        sport_id: sportId,
        team_a_id: home,
        team_b_id: away,
        venue_id: defaultVenueId,
        match_date: dateStr,
        start_time: match % 2 === 0 ? "10:00:00" : "14:00:00",
        round: "group",
        status: "scheduled",
      });
    }

    // Rotate teams keeping team 0 fixed
    const last = teams.pop()!;
    teams.splice(1, 0, last);
  }

  // Generate initial points table for all teams
  const pointsTable: GeneratedPointsTableEntry[] = teamIds.map((teamId, idx) => ({
    tournament_id: tournamentId,
    team_id: teamId,
    matches_played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    points: 0,
    net_score_diff: 0,
    rank: idx + 1,
    group_name: "Group A",
  }));

  return { matches, pointsTable };
}
