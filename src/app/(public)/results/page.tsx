import { Badge } from "@/components/ui/badge";
import { getMatches } from "@/actions/matches";
import { createAdminClient } from "@/lib/supabase/admin";
import { ResultsList } from "@/components/results/results-list";

export const revalidate = 60;

export default async function ResultsPage() {
  const [matchesRes, sportsRes] = await Promise.all([
    getMatches({ status: "completed" }),
    createAdminClient()
      .from("sports")
      .select("id, name, icon")
      .eq("is_active", true)
      .order("name"),
  ]);

  const matches = (matchesRes.data as any) || [];
  const sports = sportsRes.data || [];

  return (
    <div className="container max-w-7xl space-y-8 px-4 py-8 sm:px-8">
      <div className="border-b border-border pb-6">
        <span className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
          Match Archives
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-normal text-foreground">
          Completed Match Results
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Official scores, results, and winning scorecards of completed college sports encounters.
        </p>
      </div>

      <ResultsList initialMatches={matches} sports={sports} />
    </div>
  );
}
