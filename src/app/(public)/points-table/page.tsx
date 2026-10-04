import { Badge } from "@/components/ui/badge";
import { getPointsTable } from "@/actions/matches";
import { PointsTableView } from "@/components/points-table/points-table-view";

interface PointsTablePageProps {
  searchParams: Promise<{ tournament?: string }>;
}

export default async function PointsTablePage({ searchParams }: PointsTablePageProps) {
  const params = await searchParams;
  const res = await getPointsTable(params.tournament);

  return (
    <div className="container max-w-7xl space-y-8 px-4 py-8 sm:px-8">
      <div className="border-b pb-6">
        <Badge variant="outline" className="mb-2">
          Standings
        </Badge>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Tournament Points Table
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time tournament standings, net score rates, wins, and group leaderboards.
        </p>
      </div>

      <PointsTableView
        initialStandings={(res.data as any) || []}
        tournaments={res.tournaments || []}
        selectedTournamentId={res.selectedTournamentId}
      />
    </div>
  );
}
