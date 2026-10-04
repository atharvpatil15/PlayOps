import { Suspense } from "react";
import { getCurrentPlayerProfile } from "@/actions/players";
import { createClient } from "@/lib/supabase/server";
import { PlayerProfileView } from "@/components/player/player-profile-view";

export const revalidate = 0;

interface PlayerProfilePageProps {
  searchParams?: Promise<{ edit?: string }>;
}

export default async function PlayerProfilePage({ searchParams }: PlayerProfilePageProps) {
  const params = await searchParams;
  const initialEditOpen = params?.edit === "true";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: player } = await getCurrentPlayerProfile();

  const fallbackUser = user || {
    id: "dev-player-id",
    email: "student@kkwagh.edu.in",
    user_metadata: { full_name: "Student Athlete" },
  };

  return (
    <Suspense fallback={<div className="h-64 w-full animate-pulse rounded-xl bg-muted/40" />}>
      <PlayerProfileView
        initialPlayer={player}
        user={fallbackUser}
        initialEditOpen={initialEditOpen}
      />
    </Suspense>
  );
}
