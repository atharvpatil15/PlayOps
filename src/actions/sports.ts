"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface SportInput {
  name: string;
  type: "indoor" | "outdoor";
  max_players_per_team: number;
  min_players_per_team: number;
  description?: string;
  icon?: string;
  is_active?: boolean;
}

export async function getSports() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sports")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch sports" };
  }
}

export async function createSport(input: SportInput) {
  try {
    if (input.min_players_per_team > input.max_players_per_team) {
      return {
        success: false,
        error: "Min players cannot exceed max players per team.",
      };
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("sports")
      .insert([
        {
          name: input.name.trim(),
          type: input.type,
          max_players_per_team: Number(input.max_players_per_team),
          min_players_per_team: Number(input.min_players_per_team),
          description: input.description?.trim() || null,
          icon: input.icon?.trim() || "🏆",
          is_active: input.is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/sports");
    revalidatePath("/tournaments");
    revalidatePath("/");

    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to create sport",
    };
  }
}

export async function updateSport(id: string, input: Partial<SportInput>) {
  try {
    if (
      input.min_players_per_team &&
      input.max_players_per_team &&
      input.min_players_per_team > input.max_players_per_team
    ) {
      return {
        success: false,
        error: "Min players cannot exceed max players per team.",
      };
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("sports")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/sports");
    revalidatePath("/tournaments");
    revalidatePath("/");

    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to update sport",
    };
  }
}

export async function deleteSport(id: string) {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("sports").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/sports");
    return { success: true, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to delete sport",
    };
  }
}
