"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateMatchScoreAction({
  matchId,
  scoreTeamA,
  scoreTeamB,
  status,
  remarks,
}: {
  matchId: string;
  scoreTeamA: string;
  scoreTeamB: string;
  status: "scheduled" | "live" | "completed" | "cancelled" | "postponed";
  remarks?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("matches")
    .update({
      score_team_a: scoreTeamA,
      score_team_b: scoreTeamB,
      status,
      remarks: remarks || null,
    })
    .eq("id", matchId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/live");
  revalidatePath("/admin/matches");
  return { success: true };
}
