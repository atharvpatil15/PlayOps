"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";
import type { CertificateType } from "@/types/database.types";

export interface IssueCertificateInput {
  player_id: string;
  tournament_id: string;
  type: CertificateType;
  metadata?: {
    position?: string;
    sport_name?: string;
    department?: string;
    remarks?: string;
  };
}

export async function getCertificates(playerId?: string) {
  try {
    const admin = createAdminClient();

    let query = admin
      .from("certificates")
      .select(
        "*, players(id, registration_number, department, users(id, full_name, email)), tournaments(id, name, start_date, end_date, sports(name))"
      )
      .order("created_at", { ascending: false });

    if (playerId) {
      query = query.eq("player_id", playerId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || "Failed to load certificates" };
  }
}

export function isGroupSport(sport: { min_players_per_team?: number | null } | null | undefined): boolean {
  return (sport?.min_players_per_team ?? 1) > 1;
}

export async function issueCertificate(input: IssueCertificateInput) {
  try {
    const admin = createAdminClient();

    // 1. Fetch tournament details and associated sport configuration
    const { data: tournament, error: tourneyErr } = await admin
      .from("tournaments")
      .select("id, name, sports(id, name, min_players_per_team, max_players_per_team, type)")
      .eq("id", input.tournament_id)
      .single();

    if (tourneyErr || !tournament) {
      return { success: false, data: null, error: "Tournament not found" };
    }

    // 2. Fetch player details
    const { data: player, error: playerErr } = await admin
      .from("players")
      .select("id, registration_number, department, user_id, users(id, full_name, email)")
      .eq("id", input.player_id)
      .single();

    if (playerErr || !player) {
      return { success: false, data: null, error: "Athlete profile not found" };
    }

    const sport = tournament.sports as any;
    const isGroup = isGroupSport(sport);
    const playerName = (player.users as any)?.full_name || "Athlete";
    const sportName = sport?.name || "Sport";

    // 3. Check team membership for this tournament
    // Query teams that are part of this tournament directly or via tournament registrations
    const { data: directTeams } = await admin
      .from("teams")
      .select("id, name")
      .eq("tournament_id", input.tournament_id);

    const { data: regTeams } = await admin
      .from("tournament_registrations")
      .select("team_id, teams(id, name)")
      .eq("tournament_id", input.tournament_id);

    const allTeamIds = new Set<string>();
    const teamNameMap = new Map<string, string>();

    directTeams?.forEach((t) => {
      allTeamIds.add(t.id);
      teamNameMap.set(t.id, t.name);
    });

    regTeams?.forEach((r) => {
      if (r.team_id) {
        allTeamIds.add(r.team_id);
        if ((r.teams as any)?.name) {
          teamNameMap.set(r.team_id, (r.teams as any).name);
        }
      }
    });

    let matchedTeamName: string | null = null;
    let isMemberOfTeam = false;

    if (allTeamIds.size > 0) {
      const { data: membership } = await admin
        .from("team_players")
        .select("team_id")
        .eq("player_id", input.player_id)
        .in("team_id", Array.from(allTeamIds))
        .limit(1);

      if (membership && membership.length > 0) {
        isMemberOfTeam = true;
        matchedTeamName = teamNameMap.get(membership[0].team_id) || null;
      }
    }

    // 4. Enforce the team membership rule:
    // If it is a group game and the player is not part of any team in this tournament, block issuing!
    if (isGroup && !isMemberOfTeam) {
      return {
        success: false,
        data: null,
        error: `Cannot issue certificate: ${playerName} is not part of any registered team for this group sport (${sportName}). Group games require the athlete to be a member of a team.`,
      };
    }

    // 5. Verification code & URL
    const certCode = `cert-${input.player_id.slice(0, 8)}-${input.tournament_id.slice(0, 8)}-${input.type.slice(0, 3)}`;
    const certUrl = `/verify/${certCode}`;

    // 6. Enrich metadata
    const enrichedMetadata = {
      sport_name: sportName,
      department: player.department,
      registration_number: player.registration_number,
      tournament_name: tournament.name,
      team_name: matchedTeamName || null,
      is_group_game: isGroup,
      ...input.metadata,
    };

    const { data, error } = await admin
      .from("certificates")
      .insert([
        {
          player_id: input.player_id,
          tournament_id: input.tournament_id,
          type: input.type,
          issued_date: new Date().toISOString().split("T")[0],
          certificate_url: certUrl,
          metadata: enrichedMetadata,
        },
      ])
      .select(
        "*, players(id, registration_number, department, user_id, users(full_name, email)), tournaments(id, name, start_date, end_date, sports(name))"
      )
      .single();

    if (error) {
      if (error.code === "23505" || error.message?.includes("uq_certificate_per_player")) {
        return {
          success: false,
          data: null,
          error: `${playerName} has already been issued a "${input.type.replace(/_/g, " ")}" certificate for ${tournament.name}.`,
        };
      }
      throw error;
    }

    // 7. Send automatic congratulatory notification to the athlete
    const targetUserId = (data.players as any)?.user_id;
    if (targetUserId) {
      await createNotification({
        title: "Certificate Issued!",
        message: `Your official ${input.type.replace(/_/g, " ").toUpperCase()} certificate for ${(data.tournaments as any)?.name} has been generated. View and print it from your dashboard.`,
        type: "general",
        target_user_id: targetUserId,
      });
    }

    revalidatePath("/admin/certificates");
    revalidatePath("/player/certificates");
    revalidatePath("/player/dashboard");

    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to issue certificate",
    };
  }
}

export async function getCertificateByCode(code: string) {
  try {
    const admin = createAdminClient();

    let query = admin
      .from("certificates")
      .select(
        "*, players(id, registration_number, department, users(id, full_name, email)), tournaments(id, name, start_date, end_date, sports(name))"
      );

    if (code.includes("-") && code.length >= 32) {
      query = query.or(`id.eq.${code},certificate_url.ilike.%${code}%`);
    } else {
      query = query.ilike("certificate_url", `%${code}%`);
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Certificate not found" };
  }
}

export async function bulkIssueParticipationCertificates(tournamentId: string) {
  try {
    const admin = createAdminClient();

    // 1. Fetch tournament
    const { data: tournament, error: tErr } = await admin
      .from("tournaments")
      .select("id, name, sports(name)")
      .eq("id", tournamentId)
      .single();

    if (tErr || !tournament) throw new Error("Tournament not found");

    // 2. Fetch approved registrations
    const { data: regs } = await admin
      .from("tournament_registrations")
      .select("team_id")
      .eq("tournament_id", tournamentId)
      .eq("status", "approved");

    const teamIds = regs?.map((r) => r.team_id) || [];
    if (teamIds.length === 0) {
      return { success: false, error: "No approved teams found for this tournament" };
    }

    // 3. Fetch players in these teams
    const { data: teamPlayers } = await admin
      .from("team_players")
      .select("player_id, players(user_id, department)")
      .in("team_id", teamIds);

    const playerIds = Array.from(
      new Set(teamPlayers?.map((tp) => tp.player_id).filter(Boolean) || [])
    );

    let issuedCount = 0;
    for (const pid of playerIds) {
      const tp = teamPlayers?.find((p) => p.player_id === pid);
      const res = await issueCertificate({
        player_id: pid,
        tournament_id: tournamentId,
        type: "participation",
        metadata: {
          sport_name: (tournament.sports as any)?.name,
          department: (tp?.players as any)?.department,
        },
      });
      if (res.success) issuedCount++;
    }

    revalidatePath("/admin/certificates");
    revalidatePath("/player/certificates");

    return {
      success: true,
      error: null,
      message: `Successfully issued ${issuedCount} participation certificates!`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to bulk issue certificates",
    };
  }
}
