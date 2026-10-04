import { getNotifications } from "@/actions/notifications";
import { createAdminClient } from "@/lib/supabase/admin";
import { NotificationsManagement } from "@/components/admin/notifications-management";

export const revalidate = 0;

export default async function AdminNotificationsPage() {
  const [notifsRes, tournamentsRes, sportsRes] = await Promise.all([
    getNotifications(),
    createAdminClient().from("tournaments").select("id, name").order("name"),
    createAdminClient().from("sports").select("id, name").order("name"),
  ]);

  return (
    <div className="space-y-6">
      <NotificationsManagement
        initialNotifications={(notifsRes.data as any) || []}
        tournaments={tournamentsRes.data || []}
        sports={sportsRes.data || []}
      />
    </div>
  );
}
