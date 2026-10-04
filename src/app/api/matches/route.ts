import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get("tournamentId");
    const status = searchParams.get("status");

    let query = supabase
      .from("matches")
      .select(
        "*, team_a:teams!matches_team_a_id_fkey(*), team_b:teams!matches_team_b_id_fkey(*), sport:sports(*), venue:venues(*)"
      );

    if (tournamentId) query = query.eq("tournament_id", tournamentId);
    if (status) query = query.eq("status", status);

    const { data: matches, error } = await query.order("match_date", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: matches || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
