/**
 * Standings & Points Calculation Engine
 * Implements standard college tournament rules and sport-specific tiebreakers
 */

export interface TeamStandingRecord {
  teamId: string;
  teamName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  netScoreDiff: number;
  rank?: number;
}

/**
 * Calculates standard points awarded per match:
 * Win: 3 points, Draw: 1 point, Loss: 0 points
 */
export function calculateMatchPoints(isWin: boolean, isDraw: boolean): number {
  if (isWin) return 3;
  if (isDraw) return 1;
  return 0;
}

/**
 * Calculates Goal Difference for football / hockey / volleyball
 */
export function calculateGoalDifference(goalsFor: number, goalsAgainst: number): number {
  return goalsFor - goalsAgainst;
}

/**
 * Calculates Cricket Net Run Rate (NRR):
 * (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled)
 */
export function calculateNetRunRate(
  runsScored: number,
  oversFaced: number,
  runsConceded: number,
  oversBowled: number
): number {
  if (oversFaced <= 0 || oversBowled <= 0) return 0;
  const scoredRate = runsScored / oversFaced;
  const concededRate = runsConceded / oversBowled;
  return Number((scoredRate - concededRate).toFixed(4));
}

/**
 * Sorts standing records by points DESC, netScoreDiff DESC, and wins DESC,
 * and assigns 1-based ranks.
 */
export function rankStandings(records: TeamStandingRecord[]): TeamStandingRecord[] {
  const sorted = [...records].sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // 2. Net Score Difference / NRR / Goal Difference
    if (b.netScoreDiff !== a.netScoreDiff) {
      return b.netScoreDiff - a.netScoreDiff;
    }
    // 3. Wins
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }
    // 4. Alphabetical tiebreaker
    return a.teamName.localeCompare(b.teamName);
  });

  return sorted.map((record, index) => ({
    ...record,
    rank: index + 1,
  }));
}
