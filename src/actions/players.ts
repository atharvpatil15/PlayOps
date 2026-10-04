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

    const admin = createAdminClient();
    const { data: player, error: playerErr } = await admin
      .from("players")
      .select("*, users(full_name, email, phone, avatar_url)")
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

    // Check if player record already exists for this user_id (prevent duplicate key errors)
    const { data: existingPlayer } = await admin
      .from("players")
      .select("id, qr_code")
      .eq("user_id", user.id)
      .maybeSingle();

    const normalizedData = {
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
      updated_at: new Date().toISOString(),
    };

    let result;
    if (existingPlayer) {
      result = await admin
        .from("players")
        .update(normalizedData)
        .eq("id", existingPlayer.id)
        .select("*, users(full_name, email, phone, avatar_url)")
        .single();
    } else {
      result = await admin
        .from("players")
        .insert([normalizedData])
        .select("*, users(full_name, email, phone, avatar_url)")
        .single();
    }

    if (result.error) throw result.error;

    revalidatePath("/player/profile");
    revalidatePath("/player/dashboard");
    revalidatePath("/admin/players");
    revalidatePath(`/verify/${result.data.qr_code || result.data.registration_number}`);

    return { success: true, data: result.data, error: null };
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
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (input.registration_number !== undefined) {
      updatePayload.registration_number = input.registration_number.trim().toUpperCase();
    }
    if (input.department !== undefined) updatePayload.department = input.department;
    if (input.year !== undefined) updatePayload.year = input.year;
    if (input.date_of_birth !== undefined) updatePayload.date_of_birth = input.date_of_birth;
    if (input.blood_group !== undefined) updatePayload.blood_group = input.blood_group || null;
    if (input.height !== undefined) {
      updatePayload.height = input.height ? Number(input.height) : null;
    }
    if (input.weight !== undefined) {
      updatePayload.weight = input.weight ? Number(input.weight) : null;
    }
    if (input.sports_interested !== undefined) {
      updatePayload.sports_interested = input.sports_interested;
    }
    if (input.emergency_contact !== undefined) {
      updatePayload.emergency_contact = input.emergency_contact.trim();
    }
    if (input.medical_info !== undefined) {
      updatePayload.medical_info = input.medical_info?.trim() || null;
    }

    const { data, error } = await admin
      .from("players")
      .update(updatePayload)
      .eq("id", playerId)
      .select("*, users(full_name, email, phone, avatar_url)")
      .single();

    if (error) throw error;

    revalidatePath("/player/profile");
    revalidatePath("/player/dashboard");
    revalidatePath("/admin/players");
    if (data.qr_code || data.registration_number) {
      revalidatePath(`/verify/${data.qr_code || data.registration_number}`);
    }

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
