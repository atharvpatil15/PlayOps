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
      <div className="border-b pb-6">
        <Badge variant="outline" className="mb-2">
          Archives
        </Badge>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
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
