"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface PlayerProfileInput {
  registration_number: string; // PRN
  department: string;
  year: string;
  date_of_birth: string;
  blood_group?: string;
  height?: number;
  weight?: number;
  sports_interested?: string[];
  emergency_contact: string;
  medical_info?: string;
}

export async function getCurrentPlayerProfile() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return { data: null, error: "Not authenticated" };
    }

    const { data: player, error: playerErr } = await supabase
      .from("players")
      .select("*, users!inner(full_name, email, phone, avatar_url)")
      .eq("user_id", user.id)
      .maybeSingle();

    if (playerErr) throw playerErr;
    return { data: player, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to load player profile" };
  }
}

export async function registerPlayerProfile(input: PlayerProfileInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return { success: false, error: "Not authenticated" };
    }

    const admin = createAdminClient();

    // Check if user record exists in users table, create if missing
    const { data: existingUser } = await admin
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingUser) {
      await admin.from("users").insert([
        {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Student Player",
          role: "player",
        },
      ]);
    }

    const { data, error } = await admin
      .from("players")
      .insert([
        {
          user_id: user.id,
          registration_number: input.registration_number.trim().toUpperCase(),
          department: input.department,
          year: input.year,
          date_of_birth: input.date_of_birth,
          blood_group: input.blood_group || null,
          height: input.height ? Number(input.height) : null,
          weight: input.weight ? Number(input.weight) : null,
          sports_interested: input.sports_interested || [],
          emergency_contact: input.emergency_contact.trim(),
          medical_info: input.medical_info?.trim() || null,
        },
      ])
      .select("*, users(full_name, email)")
      .single();

    if (error) throw error;

    revalidatePath("/player/profile");
    revalidatePath("/player/dashboard");
    revalidatePath("/admin/players");

    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to register player profile",
    };
  }
}

export async function updatePlayerProfile(playerId: string, input: Partial<PlayerProfileInput>) {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("players")
      .update(input)
      .eq("id", playerId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/player/profile");
    revalidatePath("/player/dashboard");
    revalidatePath("/admin/players");

    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to update profile",
    };
  }
}

export async function getAllPlayers(search?: string, department?: string) {
  try {
    const admin = createAdminClient();
    let query = admin
      .from("players")
      .select("*, users!inner(full_name, email, phone, avatar_url)")
      .order("created_at", { ascending: false });

    if (department && department !== "all") {
      query = query.eq("department", department);
    }

    if (search) {
      query = query.or(`registration_number.ilike.%${search}%,users.full_name.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch players" };
  }
}

export async function getPlayerByQR(codeOrPRN: string) {
  try {
    const admin = createAdminClient();
    const searchVal = codeOrPRN.trim();

    const { data, error } = await admin
      .from("players")
      .select("*, users!inner(full_name, email, phone, avatar_url)")
      .or(`qr_code.eq.${searchVal},registration_number.ilike.${searchVal}`)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Player not found" };
  }
}
