"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateKnockoutFixtures, generateRoundRobinFixtures } from "@/lib/fixtures";

export interface TournamentInput {
  name: string;
  sport_id: string;
  format: "knockout" | "league" | "group+knockout";
  start_date: string;
  end_date: string;
  registration_deadline: string;
  venue_id?: string | null;
  max_teams: number;
  entry_fee?: number;
  rules?: string;
  status?: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export async function getTournaments(status?: string, sportId?: string) {
  try {
    const admin = createAdminClient();
    let query = admin
      .from("tournaments")
      .select("*, sports(name, icon), venues(name, location), tournament_registrations(id, status)")
      .order("start_date", { ascending: true });

    if (status && status !== "all") {
      query = query.eq("status", status as any);
    }
    if (sportId && sportId !== "all") {
      query = query.eq("sport_id", sportId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to load tournaments" };
  }
}

export async function getTournamentDetails(id: string) {
  try {
    const admin = createAdminClient();

    // 1. Fetch tournament info
    const { data: tournament, error: tourneyErr } = await admin
      .from("tournaments")
      .select("*, sports(name, type, icon), venues(name, location)")
      .eq("id", id)
      .single();

    if (tourneyErr) throw tourneyErr;

    // 2. Fetch registrations with teams and captains
    const { data: registrations, error: regErr } = await admin
      .from("tournament_registrations")
      .select(
        "*, teams(*, sports(name, icon), captain:players!teams_captain_id_fkey(registration_number, users(full_name)))"
      )
      .eq("tournament_id", id);

    if (regErr) throw regErr;

    // 3. Fetch fixtures / matches
    const { data: matches, error: matchErr } = await admin
      .from("matches")
      .select(
        "*, team_a:teams!matches_team_a_id_fkey(name, id), team_b:teams!matches_team_b_id_fkey(name, id), venues(name)"
      )
      .eq("tournament_id", id)
      .order("match_number", { ascending: true });

    if (matchErr) throw matchErr;

    // 4. Fetch points table
    const { data: pointsTable, error: ptErr } = await admin
      .from("points_table")
      .select("*, teams(name)")
      .eq("tournament_id", id)
      .order("points", { ascending: false });

    if (ptErr) throw ptErr;

    return {
      data: {
        ...tournament,
        registrations: registrations || [],
        matches: matches || [],
        pointsTable: pointsTable || [],
      },
      error: null,
    };
  } catch (err: any) {
    return { data: null, error: err.message || "Tournament details not found" };
  }
}

export async function createTournament(input: TournamentInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const admin = createAdminClient();

    let creatorId = user?.id;
    if (!creatorId) {
      const { data: defaultAdmin } = await admin.from("users").select("id").limit(1).single();
      creatorId = defaultAdmin?.id;
    }

    const { data, error } = await admin
      .from("tournaments")
      .insert([
        {
          name: input.name.trim(),
          sport_id: input.sport_id,
          format: input.format,
          start_date: input.start_date,
          end_date: input.end_date,
          registration_deadline: input.registration_deadline,
          venue_id: input.venue_id || null,
          max_teams: Number(input.max_teams),
          entry_fee: input.entry_fee ? Number(input.entry_fee) : 0,
          rules: input.rules?.trim() || null,
          status: "upcoming",
          created_by: creatorId!,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/tournaments");
    revalidatePath("/tournaments");
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to create tournament",
    };
  }
}

export async function updateTournament(id: string, input: Partial<TournamentInput>) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("tournaments")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/tournaments");
    revalidatePath(`/admin/tournaments/${id}`);
    revalidatePath(`/tournaments/${id}`);
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to update tournament",
    };
  }
}

export async function deleteTournament(id: string) {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("tournaments").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/tournaments");
    revalidatePath("/tournaments");
    return { success: true, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to delete tournament",
    };
  }
}

export async function registerTeamForTournament(tournamentId: string, teamId: string) {
  try {
    const admin = createAdminClient();

    // Check if tournament has room
    const { data: tourney } = await admin
      .from("tournaments")
      .select("max_teams")
      .eq("id", tournamentId)
      .single();

    const { count: approvedCount } = await admin
      .from("tournament_registrations")
      .select("*", { count: "exact", head: true })
      .eq("tournament_id", tournamentId)
      .eq("status", "approved");

    if (tourney && approvedCount && approvedCount >= tourney.max_teams) {
      return {
        success: false,
        error: "Tournament is fully booked.",
      };
    }

    const { data, error } = await admin
      .from("tournament_registrations")
      .insert([
        {
          tournament_id: tournamentId,
          team_id: teamId,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/tournaments/${tournamentId}`);
    revalidatePath(`/admin/tournaments/${tournamentId}`);
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to register team",
    };
  }
}

export async function reviewRegistration(
  registrationId: string,
  status: "approved" | "rejected",
  remarks?: string
) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("tournament_registrations")
      .update({
        status,
        remarks: remarks || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", registrationId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/tournaments");
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to review registration",
    };
  }
}

export async function generateTournamentFixtures(tournamentId: string) {
  try {
    const admin = createAdminClient();

    // 1. Get tournament details
    const { data: tournament, error: tErr } = await admin
      .from("tournaments")
      .select("*, sports(id)")
      .eq("id", tournamentId)
      .single();

    if (tErr || !tournament) throw new Error("Tournament not found");

    // 2. Fetch approved teams
    const { data: regs, error: rErr } = await admin
      .from("tournament_registrations")
      .select("team_id")
      .eq("tournament_id", tournamentId)
      .eq("status", "approved");

    if (rErr) throw rErr;

    const teamIds = regs ? regs.map((r) => r.team_id) : [];
    if (teamIds.length < 2) {
      return {
        success: false,
        error: "Need at least 2 approved teams to generate fixtures.",
      };
    }

    // 3. Clear existing matches if regenerating
    await admin.from("matches").delete().eq("tournament_id", tournamentId);
    await admin.from("points_table").delete().eq("tournament_id", tournamentId);

    // 4. Generate fixtures based on tournament format
    if (tournament.format === "knockout") {
      const generated = generateKnockoutFixtures({
        tournamentId,
        sportId: tournament.sport_id,
        teamIds,
        startDate: tournament.start_date,
        defaultVenueId: tournament.venue_id,
      });

      const { error: insertErr } = await admin.from("matches").insert(generated);
      if (insertErr) throw insertErr;
    } else {
      // League or Group+Knockout
      const { matches: generatedMatches, pointsTable: generatedPoints } =
        generateRoundRobinFixtures({
          tournamentId,
          sportId: tournament.sport_id,
          teamIds,
          startDate: tournament.start_date,
          defaultVenueId: tournament.venue_id,
        });

      const { error: mErr } = await admin.from("matches").insert(generatedMatches);
      if (mErr) throw mErr;

      const { error: ptErr } = await admin.from("points_table").insert(generatedPoints);
      if (ptErr) throw ptErr;
    }

    // 5. Update tournament status to ongoing
    await admin.from("tournaments").update({ status: "ongoing" }).eq("id", tournamentId);

    revalidatePath("/admin/tournaments");
    revalidatePath(`/admin/tournaments/${tournamentId}`);
    revalidatePath(`/tournaments/${tournamentId}`);
    revalidatePath("/points-table");
    revalidatePath("/live");

    return {
      success: true,
      error: null,
      message: "Fixtures successfully generated and tournament is now ongoing!",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to generate fixtures",
    };
  }
}
