import { getAllPlayers } from "@/actions/players";
import { PlayersManagement } from "@/components/admin/players-management";

export const revalidate = 0;

export default async function AdminPlayersPage() {
  const { data: players, error } = await getAllPlayers();

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/15 text-destructive border border-destructive/30 text-sm">
          Warning: Could not fetch players directory: {error}
        </div>
      )}
      <PlayersManagement initialPlayers={(players as any) || []} />
    </div>
  );
}
