import { getReports } from "@/actions/reports";
import { createAdminClient } from "@/lib/supabase/admin";
import { ReportsManagement } from "@/components/admin/reports-management";

export const revalidate = 0;

export default async function AdminReportsPage() {
  const admin = createAdminClient();

  const [reportsRes, tournamentsRes] = await Promise.all([
    getReports(),
    admin.from("tournaments").select("id, name").order("name"),
  ]);

  return (
    <div className="space-y-6">
      <ReportsManagement
        initialReports={(reportsRes.data as any) || []}
        tournaments={tournamentsRes.data || []}
      />
    </div>
  );
}
