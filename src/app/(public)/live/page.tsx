import { Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getMatches } from "@/actions/matches";
import { createAdminClient } from "@/lib/supabase/admin";
import { LiveMatchCenter } from "@/components/live/live-match-center";

export const revalidate = 0; // Real-time feed

export default async function LivePage() {
  const [liveRes, upcomingRes] = await Promise.all([
    getMatches({ status: "live" }),
    getMatches({ status: "scheduled" }),
  ]);

  const admin = createAdminClient();
  const { data: sports } = await admin
    .from("sports")
    .select("id, name, icon")
    .eq("is_active", true)
    .order("name");

  const liveMatches = (liveRes.data as any) || [];
  const upcomingMatches = (upcomingRes.data as any) || [];

  return (
    <div className="container max-w-7xl space-y-8 px-4 py-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="live" className="flex items-center gap-1.5 px-3 py-1">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-white" />
              <span>LIVE MATCH CENTER</span>
            </Badge>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Real-Time Ground Scores &amp; Commentary
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Broadcasting live scores across all campus grounds powered by Supabase Realtime.
          </p>
        </div>
      </div>

      {/* Realtime Live Center Component */}
      <LiveMatchCenter
        initialLiveMatches={liveMatches}
        upcomingMatches={upcomingMatches}
        sports={sports || []}
      />
    </div>
  );
}
