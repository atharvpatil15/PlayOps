import { getTournamentDetails } from "@/actions/tournaments";
import { TournamentDetailView } from "@/components/admin/tournament-detail-view";
import { notFound } from "next/navigation";

interface AdminTournamentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 0;

export default async function AdminTournamentDetailPage({ params }: AdminTournamentPageProps) {
  const { id } = await params;
  const { data: tournament, error } = await getTournamentDetails(id);

  if (!tournament || error) {
    notFound();
  }

  return <TournamentDetailView tournament={tournament} />;
}
