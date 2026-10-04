"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { ReportType } from "@/types/database.types";

export interface GenerateReportInput {
  type: ReportType;
  tournament_id?: string;
  parameters?: Record<string, any>;
}

export async function getReports() {
  try {
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("reports")
      .select("*, tournaments(id, name, sports(name)), users(full_name, email)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || "Failed to load reports" };
  }
}

export async function generateTournamentReport(input: GenerateReportInput) {
  try {
    const admin = createAdminClient();

    // 1. Get current logged-in user or first admin
    let currentUserId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      currentUserId = user?.id || null;
    } catch {
      // fallback
    }

    if (!currentUserId) {
      const { data: firstAdmin } = await admin
        .from("users")
        .select("id")
        .eq("role", "admin")
        .limit(1)
        .single();
      currentUserId = firstAdmin?.id || null;
    }

    if (!currentUserId) {
      throw new Error("No authorized user available to generate report");
    }

    // 2. Fetch tournament details if tournament_id is provided
    let summaryData: any = {};
    if (input.tournament_id) {
      const [
        { data: tournament },
        { data: matches },
        { data: registrations },
        { data: standings },
      ] = await Promise.all([
        admin.from("tournaments").select("*, sports(name)").eq("id", input.tournament_id).single(),
        admin.from("matches").select("*").eq("tournament_id", input.tournament_id),
        admin
          .from("tournament_registrations")
          .select("*, teams(name)")
          .eq("tournament_id", input.tournament_id),
        admin
          .from("points_table")
          .select("*, teams(name)")
          .eq("tournament_id", input.tournament_id)
          .order("points", { ascending: false }),
      ]);

      const completedCount = matches?.filter((m) => m.status === "completed").length || 0;
      const championTeam = standings && standings.length > 0 ? standings[0].teams?.name : "TBD";

      summaryData = {
        tournament_name: tournament?.name,
        sport: (tournament?.sports as any)?.name,
        total_teams: registrations?.length || 0,
        total_matches: matches?.length || 0,
        completed_matches: completedCount,
        champion: championTeam,
        generated_at: new Date().toISOString(),
      };
    }

    const fileUrl = `/reports/institutional-sports-summary-${Date.now()}.pdf`;

    const { data, error } = await admin
      .from("reports")
      .insert([
        {
          type: input.type,
          tournament_id: input.tournament_id || null,
          generated_by: currentUserId,
          file_url: fileUrl,
          parameters: {
            ...input.parameters,
            ...summaryData,
          },
        },
      ])
      .select("*, tournaments(name), users(full_name)")
      .single();

    if (error) throw error;

    revalidatePath("/admin/reports");

    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to generate report",
    };
  }
}
