"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { NotificationType } from "@/types/database.types";

export interface CreateNotificationInput {
  title: string;
  message: string;
  type: NotificationType;
  target_role?: "admin" | "player" | null;
  target_user_id?: string | null;
}

export interface BroadcastNotificationInput {
  title: string;
  message: string;
  type: NotificationType;
  target_audience: "all" | "players" | "admins" | "sport" | "tournament";
  sport_id?: string;
  tournament_id?: string;
}

export async function getNotifications(userId?: string) {
  try {
    const admin = createAdminClient();

    let query = admin
      .from("notifications")
      .select("*, users(full_name, email)")
      .order("created_at", { ascending: false });

    if (userId) {
      // User can see broadcast notifications (target_user_id IS NULL) or specifically targeted to them
      query = query.or(`target_user_id.is.null,target_user_id.eq.${userId}`);
    }

    const { data, error } = await query.limit(50);
    if (error) throw error;

    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || "Failed to fetch notifications" };
  }
}

export async function createNotification(input: CreateNotificationInput) {
  try {
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("notifications")
      .insert([
        {
          title: input.title,
          message: input.message,
          type: input.type,
          target_role: input.target_role || null,
          target_user_id: input.target_user_id || null,
          is_read: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/notifications");
    revalidatePath("/player/notifications");
    revalidatePath("/player/dashboard");

    return { success: true, data, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Failed to create notification",
    };
  }
}

export async function broadcastNotification(input: BroadcastNotificationInput) {
  try {
    const admin = createAdminClient();

    if (input.target_audience === "all") {
      return await createNotification({
        title: input.title,
        message: input.message,
        type: input.type,
        target_role: null,
        target_user_id: null,
      });
    }

    if (input.target_audience === "players") {
      return await createNotification({
        title: input.title,
        message: input.message,
        type: input.type,
        target_role: "player",
        target_user_id: null,
      });
    }

    if (input.target_audience === "admins") {
      return await createNotification({
        title: input.title,
        message: input.message,
        type: input.type,
        target_role: "admin",
        target_user_id: null,
      });
    }

    if (input.target_audience === "tournament" && input.tournament_id) {
      // Find all players in this tournament
      const { data: teams } = await admin
        .from("tournament_registrations")
        .select("team_id")
        .eq("tournament_id", input.tournament_id)
        .eq("status", "approved");

      const teamIds = teams?.map((t) => t.team_id) || [];
      if (teamIds.length > 0) {
        const { data: teamPlayers } = await admin
          .from("team_players")
          .select("player:players(user_id)")
          .in("team_id", teamIds);

        const userIds = Array.from(
          new Set(
            teamPlayers
              ?.map((tp) => (tp.player as any)?.user_id)
              .filter(Boolean) || []
          )
        );

        if (userIds.length > 0) {
          const rows = userIds.map((uid) => ({
            title: input.title,
            message: input.message,
            type: input.type,
            target_user_id: uid,
            is_read: false,
          }));

          const { error } = await admin.from("notifications").insert(rows);
          if (error) throw error;
        }
      }

      revalidatePath("/admin/notifications");
      revalidatePath("/player/notifications");
      return { success: true, error: null };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to broadcast notification",
    };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const admin = createAdminClient();

    const { error } = await admin
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) throw error;

    revalidatePath("/player/notifications");
    revalidatePath("/admin/notifications");
    revalidatePath("/player/dashboard");

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update notification" };
  }
}

export async function markAllAsRead(userId?: string) {
  try {
    const admin = createAdminClient();

    let query = admin.from("notifications").update({ is_read: true }).eq("is_read", false);

    if (userId) {
      query = query.or(`target_user_id.eq.${userId},target_user_id.is.null`);
    }

    const { error } = await query;
    if (error) throw error;

    revalidatePath("/player/notifications");
    revalidatePath("/admin/notifications");
    revalidatePath("/player/dashboard");

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to mark all as read" };
  }
}
