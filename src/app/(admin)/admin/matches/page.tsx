import { getMatches } from "@/actions/matches";
import { getTournaments } from "@/actions/tournaments";
import { getSports } from "@/actions/sports";
import { getVenues } from "@/actions/venues";
import { getTeams } from "@/actions/teams";
import { MatchesManagement } from "@/components/admin/matches-management";

export const revalidate = 0;

export default async function AdminMatchesPage() {
  const [
    { data: matches },
    { data: tournaments },
    { data: sports },
    { data: venues },
    { data: teams },
  ] = await Promise.all([
    getMatches(),
    getTournaments(),
    getSports(),
    getVenues(),
    getTeams(),
  ]);

  return (
    <MatchesManagement
      initialMatches={(matches as any) || []}
      tournaments={(tournaments as any) || []}
      sports={(sports as any) || []}
      venues={(venues as any) || []}
      teams={(teams as any) || []}
    />
  );
}
