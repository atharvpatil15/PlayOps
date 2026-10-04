"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface VenueInput {
  name: string;
  location: string;
  type: "indoor" | "outdoor" | "multipurpose";
  capacity?: number;
  facilities?: string[];
  is_available?: boolean;
}

export async function getVenues() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch venues" };
  }
}

export async function createVenue(input: VenueInput) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("venues")
      .insert([
        {
          name: input.name.trim(),
          location: input.location.trim(),
          type: input.type,
          capacity: input.capacity ? Number(input.capacity) : null,
          facilities: input.facilities || [],
          is_available: input.is_available ?? true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/venues");
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to create venue",
    };
  }
}

export async function updateVenue(id: string, input: Partial<VenueInput>) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("venues")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/venues");
    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to update venue",
    };
  }
}

export async function deleteVenue(id: string) {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("venues").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/venues");
    return { success: true, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to delete venue",
    };
  }
}
