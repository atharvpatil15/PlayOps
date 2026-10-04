import { getTeams } from "@/actions/teams";
import { getSports } from "@/actions/sports";
import { getAllPlayers } from "@/actions/players";
import { getTournaments } from "@/actions/tournaments";
import { TeamsManagement } from "@/components/admin/teams-management";

export const revalidate = 0;

export default async function AdminTeamsPage() {
  const [{ data: teams }, { data: sports }, { data: players }, { data: tournaments }] =
    await Promise.all([getTeams(), getSports(), getAllPlayers(), getTournaments()]);

  return (
    <TeamsManagement
      initialTeams={(teams as any) || []}
      sports={(sports as any) || []}
      players={(players as any) || []}
      tournaments={(tournaments as any) || []}
    />
  );
}
