import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SUPPORTED_SPORTS } from "@/lib/constants/sport";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: sports, error } = await supabase.from("sports").select("*").eq("is_active", true);

    if (error || !sports || sports.length === 0) {
      // Fallback to catalog constants during local initial setup
      return NextResponse.json({ data: SUPPORTED_SPORTS, source: "default-catalog" });
    }

    return NextResponse.json({ data: sports, source: "database" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
