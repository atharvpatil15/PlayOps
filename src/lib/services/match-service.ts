import { createClient } from "@/lib/supabase/server";

export class MatchService {
  static async getLiveMatches() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("matches")
      .select("*, team_a:teams!matches_team_a_id_fkey(*), team_b:teams!matches_team_b_id_fkey(*), sport:sports(*), venue:venues(*)")
      .eq("status", "live");

    if (error) throw error;
    return data || [];
  }
}
