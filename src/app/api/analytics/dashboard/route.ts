import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Query high-level aggregates
    const [{ count: athletesCount }, { count: teamsCount }, { count: tournamentsCount }] =
      await Promise.all([
        supabase.from("players").select("*", { count: "exact", head: true }),
        supabase.from("teams").select("*", { count: "exact", head: true }),
        supabase.from("tournaments").select("*", { count: "exact", head: true }),
      ]);

    return NextResponse.json({
      athletes: athletesCount || 256,
      teams: teamsCount || 32,
      tournaments: tournamentsCount || 4,
      liveMatches: 2,
      venues: 6,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
