"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface ScheduleMatchInput {
  tournament_id: string;
  sport_id: string;
  team_a_id: string;
  team_b_id: string;
  venue_id?: string | null;
  match_date: string;
  start_time?: string;
  round:
    | "group"
    | "round_of_16"
    | "quarter_final"
    | "semi_final"
    | "third_place"
    | "final";
  match_number?: number;
}

export interface MatchEventInput {
  match_id: string;
  event_type:
    | "goal"
    | "assist"
    | "wicket"
    | "run"
    | "foul"
    | "yellow_card"
    | "red_card"
    | "timeout"
    | "substitution"
    | "injury"
    | "penalty"
    | "point"
    | "ace"
    | "smash"
    | "other";
  player_id?: string | null;
  team_id?: string | null;
  description?: string;
}

export async function getMatches(filters?: {
  tournamentId?: string;
  status?: string;
  sportId?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
}) {
  try {
    const admin = createAdminClient();
    let query = admin
      .from("matches")
      .select(
        "*, tournaments(id, name, format), sports(id, name, icon), team_a:teams!matches_team_a_id_fkey(id, name, logo_url), team_b:teams!matches_team_b_id_fkey(id, name, logo_url), venues(id, name, location)"
      );

    const isDesc = filters?.sortOrder === "desc";
    query = query
      .order("match_date", { ascending: !isDesc })
      .order(isDesc ? "created_at" : "match_number", { ascending: !isDesc });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.tournamentId && filters.tournamentId !== "all") {
      query = query.eq("tournament_id", filters.tournamentId);
    }
    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status as any);
    }
    if (filters?.sportId && filters.sportId !== "all") {
      query = query.eq("sport_id", filters.sportId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to load matches" };
  }
}

export async function getMatchDetails(matchId: string) {
  try {
    const admin = createAdminClient();

    // 1. Fetch match with teams, tournament, sport, venue
    const { data: match, error: mErr } = await admin
      .from("matches")
      .select(
        "*, tournaments(*), sports(*), team_a:teams!matches_team_a_id_fkey(*), team_b:teams!matches_team_b_id_fkey(*), venues(*)"
      )
      .eq("id", matchId)
      .single();

    if (mErr) throw mErr;

    // 2. Fetch rosters for Team A and Team B
    const [{ data: teamAPlayers }, { data: teamBPlayers }, { data: events }] =
      await Promise.all([
        admin
          .from("team_players")
          .select("*, player:players(*, users(full_name))")
          .eq("team_id", match.team_a_id),
        admin
          .from("team_players")
          .select("*, player:players(*, users(full_name))")
          .eq("team_id", match.team_b_id),
        admin
          .from("match_events")
          .select("*, player:players(users(full_name)), teams(name)")
          .eq("match_id", matchId)
          .order("created_at", { ascending: false }),
      ]);

    return {
      data: {
        ...match,
        team_a_players: teamAPlayers || [],
        team_b_players: teamBPlayers || [],
        events: events || [],
      },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err.message || "Match details not found" };
  }
}

export async function scheduleMatch(input: ScheduleMatchInput) {
  try {
    const admin = createAdminClient();

    let matchNumber = input.match_number;
    if (!matchNumber) {
      const { data: maxMatch } = await admin
        .from("matches")
        .select("match_number")
        .eq("tournament_id", input.tournament_id)
        .order("match_number", { ascending: false })
        .limit(1)
        .maybeSingle();

      matchNumber = (maxMatch?.match_number || 0) + 1;
    }

    const { data, error } = await admin
      .from("matches")
      .insert([
        {
          tournament_id: input.tournament_id,
          sport_id: input.sport_id,
          team_a_id: input.team_a_id,
          team_b_id: input.team_b_id,
          venue_id: input.venue_id || null,
          match_date: input.match_date,
          start_time: input.start_time || "10:00:00",
          round: input.round,
          match_number: matchNumber,
          status: "scheduled",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/matches");
    revalidatePath(`/admin/tournaments/${input.tournament_id}`);
    revalidatePath("/live");
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to schedule match",
    };
  }
}

export async function startMatch(matchId: string) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("matches")
      .update({
        status: "live",
        score_team_a: "0",
        score_team_b: "0",
      })
      .eq("id", matchId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/matches");
    revalidatePath("/live");
    revalidatePath("/admin/dashboard");
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to start match",
    };
  }
}

export async function updateLiveScore(
  matchId: string,
  scoreTeamA: string,
  scoreTeamB: string,
  remarks?: string
) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("matches")
      .update({
        score_team_a: scoreTeamA,
        score_team_b: scoreTeamB,
        remarks: remarks || null,
      })
      .eq("id", matchId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/live");
    revalidatePath("/admin/matches");
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to update score",
    };
  }
}

export async function addMatchEvent(input: MatchEventInput) {
  try {
    const admin = createAdminClient();
    const nowTime = new Date().toTimeString().split(" ")[0];

    const { data, error } = await admin
      .from("match_events")
      .insert([
        {
          match_id: input.match_id,
          event_type: input.event_type,
          player_id: input.player_id || null,
          team_id: input.team_id || null,
          event_time: nowTime,
          description: input.description || null,
        },
      ])
      .select("*, player:players(users(full_name)), teams(name)")
      .single();

    if (error) throw error;

    revalidatePath("/live");
    revalidatePath(`/admin/matches`);
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to record match event",
    };
  }
}

export async function endMatch(
  matchId: string,
  winnerId: string | null,
  scoreTeamA: string,
  scoreTeamB: string
) {
  try {
    const admin = createAdminClient();

    // 1. Fetch match to check tournament
    const { data: match, error: mErr } = await admin
      .from("matches")
      .select("*, tournaments(format)")
      .eq("id", matchId)
      .single();

    if (mErr || !match) throw new Error("Match not found");

    // 2. Mark match completed
    const { error: updateErr } = await admin
      .from("matches")
      .update({
        status: "completed",
        winner_id: winnerId || null,
        score_team_a: scoreTeamA,
        score_team_b: scoreTeamB,
      })
      .eq("id", matchId);

    if (updateErr) throw updateErr;

    // 3. If tournament is league / round-robin, update points table
    if (match.tournaments?.format !== "knockout") {
      const isDraw = !winnerId;
      const teamAWon = winnerId === match.team_a_id;
      const teamBWon = winnerId === match.team_b_id;

      // Update Team A
      const { data: ptA } = await admin
        .from("points_table")
        .select("*")
        .eq("tournament_id", match.tournament_id)
        .eq("team_id", match.team_a_id)
        .maybeSingle();

      if (ptA) {
        await admin
          .from("points_table")
          .update({
            matches_played: ptA.matches_played + 1,
            wins: ptA.wins + (teamAWon ? 1 : 0),
            losses: ptA.losses + (teamBWon ? 1 : 0),
            draws: ptA.draws + (isDraw ? 1 : 0),
            points: ptA.points + (teamAWon ? 3 : isDraw ? 1 : 0),
          })
          .eq("id", ptA.id);
      }

      // Update Team B
      const { data: ptB } = await admin
        .from("points_table")
        .select("*")
        .eq("tournament_id", match.tournament_id)
        .eq("team_id", match.team_b_id)
        .maybeSingle();

      if (ptB) {
        await admin
          .from("points_table")
          .update({
            matches_played: ptB.matches_played + 1,
            wins: ptB.wins + (teamBWon ? 1 : 0),
            losses: ptB.losses + (teamAWon ? 1 : 0),
            draws: ptB.draws + (isDraw ? 1 : 0),
            points: ptB.points + (teamBWon ? 3 : isDraw ? 1 : 0),
          })
          .eq("id", ptB.id);
      }
    }

    revalidatePath("/live");
    revalidatePath("/points-table");
    revalidatePath("/results");
    revalidatePath("/admin/matches");
    revalidatePath(`/admin/tournaments/${match.tournament_id}`);
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      error: null,
      message: "Match finalized and points table updated!",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to finalize match",
    };
  }
}

export async function cancelMatch(matchId: string, reason?: string) {
  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("matches")
      .update({
        status: "cancelled",
        remarks: reason || "Match cancelled by referee/admin",
      })
      .eq("id", matchId);

    if (error) throw error;

    revalidatePath("/live");
    revalidatePath("/admin/matches");
    return { success: true, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to cancel match",
    };
  }
}

export async function getPointsTable(tournamentId?: string) {
  try {
    const admin = createAdminClient();

    // Fetch tournaments to allow dropdown selection
    const { data: tournaments, error: tErr } = await admin
      .from("tournaments")
      .select("id, name, format, status")
      .order("created_at", { ascending: false });

    if (tErr) throw tErr;

    // Pick target tournament: if tournamentId provided, use that; else pick the first tournament
    const targetTournamentId =
      tournamentId || (tournaments && tournaments.length > 0 ? tournaments[0].id : null);

    if (!targetTournamentId) {
      return {
        data: [],
        tournaments: tournaments || [],
        selectedTournamentId: null,
        error: null,
      };
    }

    const { data: standings, error: sErr } = await admin
      .from("points_table")
      .select("*, teams(id, name, logo_url), tournaments(id, name, format)")
      .eq("tournament_id", targetTournamentId)
      .order("points", { ascending: false })
      .order("net_score_diff", { ascending: false })
      .order("wins", { ascending: false });

    if (sErr) throw sErr;

    return {
      data: standings || [],
      tournaments: tournaments || [],
      selectedTournamentId: targetTournamentId,
      error: null,
    };
  } catch (err: any) {
    return {
      data: [],
      tournaments: [],
      selectedTournamentId: null,
      error: err.message || "Failed to load points table",
    };
  }
}
