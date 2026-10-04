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

export async function issueCertificate(input: IssueCertificateInput) {
  try {
    const admin = createAdminClient();

    const certUrl = `/verify/cert-${input.player_id.slice(0, 8)}-${input.tournament_id.slice(0, 8)}`;

    const { data, error } = await admin
      .from("certificates")
      .insert([
        {
          player_id: input.player_id,
          tournament_id: input.tournament_id,
          type: input.type,
          issued_date: new Date().toISOString().split("T")[0],
          certificate_url: certUrl,
          metadata: input.metadata || {},
        },
      ])
      .select("*, players(user_id, users(full_name)), tournaments(name)")
      .single();

    if (error) throw error;

    // Send automatic congratulatory notification to the athlete
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
