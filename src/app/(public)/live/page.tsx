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
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="live" className="flex items-center gap-2 px-2.5 py-0.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>LIVE MATCH CENTER</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              Ground Broadcast
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-foreground">
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
