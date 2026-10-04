import { createClient } from "@/lib/supabase/server";

export class PlayerService {
  static async getPlayerProfile(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("players")
      .select("*, user:users(*)")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getPlayerByQr(qrCode: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("players")
      .select("*, user:users(*)")
      .eq("qr_code", qrCode)
      .single();

    if (error) throw error;
    return data;
  }
}
