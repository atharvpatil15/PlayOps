"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface TeamInput {
  name: string;
  sport_id: string;
  tournament_id?: string | null;
  captain_id?: string | null;
  logo_url?: string | null;
}

export async function getTeams(sportId?: string, tournamentId?: string) {
  try {
    const admin = createAdminClient();
    let query = admin
      .from("teams")
      .select(
        "*, sports(name, icon), captain:players!teams_captain_id_fkey(registration_number, users(full_name)), team_players(id)"
      )
      .order("created_at", { ascending: false });

    if (sportId && sportId !== "all") {
      query = query.eq("sport_id", sportId);
    }
    if (tournamentId && tournamentId !== "all") {
      query = query.eq("tournament_id", tournamentId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch teams" };
  }
}

export async function getTeamDetails(teamId: string) {
  try {
    const admin = createAdminClient();
    const { data: team, error: teamErr } = await admin
      .from("teams")
      .select(
        "*, sports(name, type, icon, max_players_per_team, min_players_per_team), captain:players!teams_captain_id_fkey(*, users(full_name, email, avatar_url))"
      )
      .eq("id", teamId)
      .single();

    if (teamErr) throw teamErr;

    const { data: players, error: playersErr } = await admin
      .from("team_players")
      .select("*, player:players(*, users(full_name, email, avatar_url))")
      .eq("team_id", teamId)
      .order("jersey_number", { ascending: true, nullsFirst: false });

    if (playersErr) throw playersErr;

    return { data: { ...team, players }, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to load team details" };
  }
}

export async function createTeam(input: TeamInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const admin = createAdminClient();

    // Use current user id or first admin user
    let creatorId = user?.id;
    if (!creatorId) {
      const { data: defaultUser } = await admin.from("users").select("id").limit(1).single();
      creatorId = defaultUser?.id;
    }

    const { data, error } = await admin
      .from("teams")
      .insert([
        {
          name: input.name.trim(),
          sport_id: input.sport_id,
          tournament_id: input.tournament_id || null,
          captain_id: input.captain_id || null,
          logo_url: input.logo_url || null,
          created_by: creatorId!,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // If captain was provided, automatically add them to team_players
    if (input.captain_id && data?.id) {
      await admin.from("team_players").insert([
        {
          team_id: data.id,
          player_id: input.captain_id,
          position: "Captain",
        },
      ]);
    }

    revalidatePath("/admin/teams");
    revalidatePath("/tournaments");
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to create team",
    };
  }
}

export async function updateTeam(id: string, input: Partial<TeamInput>) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("teams").update(input).eq("id", id).select().single();

    if (error) throw error;

    revalidatePath("/admin/teams");
    revalidatePath(`/admin/teams/${id}`);
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to update team",
    };
  }
}

export async function deleteTeam(id: string) {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("teams").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/teams");
    return { success: true, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to delete team",
    };
  }
}

export async function addPlayerToTeam(
  teamId: string,
  playerId: string,
  jerseyNumber?: number,
  position?: string
) {
  try {
    const admin = createAdminClient();

    // Check if player already on team
    const { data: existing } = await admin
      .from("team_players")
      .select("id")
      .eq("team_id", teamId)
      .eq("player_id", playerId)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "Player is already registered in this squad." };
    }

    const { data, error } = await admin
      .from("team_players")
      .insert([
        {
          team_id: teamId,
          player_id: playerId,
          jersey_number: jerseyNumber || null,
          position: position?.trim() || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/teams");
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to add player to squad",
    };
  }
}

export async function removePlayerFromTeam(teamId: string, playerId: string) {
  try {
    const admin = createAdminClient();

    // Check if player is captain
    const { data: team } = await admin.from("teams").select("captain_id").eq("id", teamId).single();

    if (team?.captain_id === playerId) {
      return {
        success: false,
        error: "Cannot remove captain. Please assign a new captain first.",
      };
    }

    const { error } = await admin
      .from("team_players")
      .delete()
      .eq("team_id", teamId)
      .eq("player_id", playerId);

    if (error) throw error;

    revalidatePath("/admin/teams");
    return { success: true, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to remove player from squad",
    };
  }
}

export async function setTeamCaptain(teamId: string, playerId: string) {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("teams").update({ captain_id: playerId }).eq("id", teamId);

    if (error) throw error;

    revalidatePath("/admin/teams");
    return { success: true, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to assign captain",
    };
  }
}
