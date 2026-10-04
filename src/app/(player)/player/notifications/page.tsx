import { Bell, Calendar, Trophy, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PlayerNotificationsPage() {
  const notifications = [
    {
      id: "n-1",
      title: "Semi-Final Match Fixture Confirmed",
      message:
        "Your match against Mech Warriors has been scheduled for 15 Oct at 10:00 AM on the Main Ground.",
      time: "2 hours ago",
      type: "match",
      isNew: true,
    },
    {
      id: "n-2",
      title: "Team Registration Approved",
      message:
        "Your squad registration for Inter-Dept Cricket Premier League 2026 has been approved by the Sports Admin.",
      time: "1 day ago",
      type: "registration",
      isNew: false,
    },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Sports Notifications & Alerts
        </h1>
        <p className="text-sm text-muted-foreground">
          Official tournament announcements, fixture changes, and department notices.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className={n.isNew ? "border-primary/40 bg-primary/5" : ""}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="mt-0.5 shrink-0 rounded-full bg-primary/10 p-2 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
