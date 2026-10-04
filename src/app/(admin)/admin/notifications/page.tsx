import { Bell, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Broadcast Announcements & Alerts
        </h1>
        <p className="text-sm text-muted-foreground">
          Send real-time alerts to registered players, captains, or the entire college campus.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Create New Announcement</span>
          </CardTitle>
          <CardDescription>Pushes live notifications via Supabase Realtime</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Announcement Headline</Label>
            <Input id="title" placeholder="e.g. Schedule Update: Cricket Semi-Finals Moved to 10 AM" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target Audience</Label>
            <select
              id="target"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="all">All Authenticated Users & Viewers</option>
              <option value="player">Registered Athletes & Captains Only</option>
              <option value="admin">Sports Department Staff Only</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Announcement Details</Label>
            <textarea
              id="message"
              rows={4}
              placeholder="Enter comprehensive message description..."
              className="w-full rounded-md border border-input bg-transparent p-3 text-sm shadow-sm"
            />
          </div>

          <Button className="gap-2">
            <Send className="h-4 w-4" />
            <span>Broadcast Announcement Now</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
