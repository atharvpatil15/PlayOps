"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { tournamentSchema } from "@/lib/validations/tournament.schema";

export async function createTournamentAction(formData: FormData) {
  const supabase = await createClient();

  const raw = {
    name: formData.get("name") as string,
    sportId: formData.get("sportId") as string,
    format: formData.get("format") as "knockout" | "league" | "group+knockout",
    startDate: formData.get("startDate") as string,
    endDate: formData.get("endDate") as string,
    registrationDeadline: formData.get("registrationDeadline") as string,
    venueId: (formData.get("venueId") as string) || null,
    maxTeams: formData.get("maxTeams") as string,
    entryFee: formData.get("entryFee") as string,
    rules: (formData.get("rules") as string) || undefined,
  };

  const parsed = tournamentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required to create tournament" };
  }

  const { data, error } = await supabase.from("tournaments").insert({
    name: parsed.data.name,
    sport_id: parsed.data.sportId,
    format: parsed.data.format,
    start_date: parsed.data.startDate,
    end_date: parsed.data.endDate,
    registration_deadline: parsed.data.registrationDeadline,
    venue_id: parsed.data.venueId || null,
    max_teams: parsed.data.maxTeams,
    entry_fee: parsed.data.entryFee,
    rules: parsed.data.rules || null,
    created_by: user.id,
    status: "upcoming",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/tournaments");
  revalidatePath("/admin/tournaments");
  return { success: true, data };
}
