import { getTournaments } from "@/actions/tournaments";
import { getSports } from "@/actions/sports";
import { getVenues } from "@/actions/venues";
import { TournamentsManagement } from "@/components/admin/tournaments-management";

export const revalidate = 0;

export default async function AdminTournamentsPage() {
  const [{ data: tournaments }, { data: sports }, { data: venues }] = await Promise.all([
    getTournaments(),
    getSports(),
    getVenues(),
  ]);

  return (
    <TournamentsManagement
      initialTournaments={(tournaments as any) || []}
      sports={(sports as any) || []}
      venues={(venues as any) || []}
    />
  );
}
