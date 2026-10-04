import { getCertificates } from "@/actions/certificates";
import { createAdminClient } from "@/lib/supabase/admin";
import { CertificatesManagement } from "@/components/admin/certificates-management";

export const revalidate = 0;

export default async function AdminCertificatesPage() {
  const admin = createAdminClient();

  const [certsRes, tournamentsRes, playersRes] = await Promise.all([
    getCertificates(),
    admin.from("tournaments").select("id, name").order("name"),
    admin
      .from("players")
      .select("id, registration_number, users(full_name, email)")
      .order("registration_number"),
  ]);

  return (
    <div className="space-y-6">
      <CertificatesManagement
        initialCertificates={(certsRes.data as any) || []}
        tournaments={tournamentsRes.data || []}
        players={(playersRes.data as any) || []}
      />
    </div>
  );
}
