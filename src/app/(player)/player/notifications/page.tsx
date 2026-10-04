import { createClient } from "@/lib/supabase/server";
import { getNotifications } from "@/actions/notifications";
import { PlayerNotificationsList } from "@/components/player/player-notifications-list";

export const revalidate = 0;

export default async function PlayerNotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const notifsRes = await getNotifications(user?.id);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Sports Notifications &amp; Alerts
        </h1>
        <p className="text-sm text-muted-foreground">
          Official tournament announcements, fixture changes, and department notices.
        </p>
      </div>

      <PlayerNotificationsList
        initialNotifications={(notifsRes.data as any) || []}
        userId={user?.id}
      />
    </div>
  );
}
