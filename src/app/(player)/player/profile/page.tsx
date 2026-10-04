import { getCurrentPlayerProfile } from "@/actions/players";
import { createClient } from "@/lib/supabase/server";
import { PlayerProfileView } from "@/components/player/player-profile-view";

export const revalidate = 0;

export default async function PlayerProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: player } = await getCurrentPlayerProfile();

  // If no logged in user yet in dev, provide a mock user session so the page can be previewed
  const fallbackUser = user || {
    id: "dev-player-id",
    email: "student@kkwagh.edu.in",
    user_metadata: { full_name: "Student Athlete" },
  };

  return <PlayerProfileView initialPlayer={player} user={fallbackUser} />;
}
