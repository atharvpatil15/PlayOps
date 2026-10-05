import { getCertificates } from "@/actions/certificates";
import { createAdminClient } from "@/lib/supabase/admin";
import { CertificatesManagement } from "@/components/admin/certificates-management";

export const revalidate = 0;

export default async function AdminCertificatesPage() {
  const admin = createAdminClient();

  const [certsRes, tournamentsRes, playersRes, teamPlayersRes, teamsRes, regRes] = await Promise.all([
    getCertificates(),
    admin
      .from("tournaments")
      .select("id, name, sport_id, sports(id, name, min_players_per_team, max_players_per_team, type)")
      .order("name"),
    admin
      .from("players")
      .select("id, registration_number, department, users(full_name, email)")
      .order("registration_number"),
    admin
      .from("team_players")
      .select("player_id, team_id, teams(id, name, tournament_id)"),
    admin
      .from("teams")
      .select("id, name, tournament_id"),
    admin
      .from("tournament_registrations")
      .select("tournament_id, team_id"),
  ]);

  // Construct lookup of team memberships by tournament
  const teamMemberships: Array<{
    player_id: string;
    tournament_id: string;
    team_name: string;
  }> = [];

  const teamToTournaments = new Map<string, { name: string; tournamentIds: Set<string> }>();

  teamsRes.data?.forEach((t) => {
    const s = new Set<string>();
    if (t.tournament_id) s.add(t.tournament_id);
    teamToTournaments.set(t.id, { name: t.name, tournamentIds: s });
  });

  regRes.data?.forEach((r) => {
    if (r.team_id && r.tournament_id) {
      const entry = teamToTournaments.get(r.team_id);
      if (entry) {
        entry.tournamentIds.add(r.tournament_id);
      }
    }
  });

  teamPlayersRes.data?.forEach((tp: any) => {
    const entry = teamToTournaments.get(tp.team_id);
    if (entry) {
      entry.tournamentIds.forEach((tourneyId) => {
        teamMemberships.push({
          player_id: tp.player_id,
          tournament_id: tourneyId,
          team_name: entry.name,
        });
      });
    }
  });

  return (
    <div className="space-y-6">
      <CertificatesManagement
        initialCertificates={(certsRes.data as any) || []}
        tournaments={(tournamentsRes.data as any) || []}
        players={(playersRes.data as any) || []}
        teamMemberships={teamMemberships}
      />
    </div>
  );
}
