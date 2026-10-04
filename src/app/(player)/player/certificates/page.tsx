import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCertificates } from "@/actions/certificates";
import { PlayerCertificatesView } from "@/components/player/player-certificates-view";

export const revalidate = 0;

export default async function PlayerCertificatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let certs: any[] = [];

  if (user) {
    const admin = createAdminClient();
    const { data: player } = await admin
      .from("players")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (player) {
      const res = await getCertificates(player.id);
      certs = res.data || [];
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Digital Merit &amp; Participation Certificates
        </h1>
        <p className="text-sm text-muted-foreground">
          Download and verify official cryptographically verifiable certificates for your college portfolio.
        </p>
      </div>

      <PlayerCertificatesView certificates={certs} />
    </div>
  );
}
