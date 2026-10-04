import { createClient } from "@/lib/supabase/server";
import type { Tournament } from "@/types/tournament";

export class TournamentService {
  static async getTournaments(status?: string): Promise<Tournament[]> {
    const supabase = await createClient();
    let query = supabase.from("tournaments").select("*");

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("start_date", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async getTournamentById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tournaments")
      .select("*, sport:sports(*), venue:venues(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }
}
