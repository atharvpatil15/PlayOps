"use client";

import { useState } from "react";
import {
  Bell,
  Send,
  Users,
  Trophy,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { broadcastNotification, type BroadcastNotificationInput } from "@/actions/notifications";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  target_role: string | null;
  target_user_id: string | null;
  is_read: boolean;
  created_at: string;
  users?: { full_name: string; email: string } | null;
}

interface NotificationsManagementProps {
  initialNotifications: NotificationItem[];
  tournaments: Array<{ id: string; name: string }>;
  sports: Array<{ id: string; name: string }>;
}

export function NotificationsManagement({
  initialNotifications,
  tournaments,
  sports,
}: NotificationsManagementProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<BroadcastNotificationInput>({
    title: "",
    message: "",
    type: "general",
    target_audience: "all",
    tournament_id: tournaments[0]?.id || "",
    sport_id: sports[0]?.id || "",
  });

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error("Please fill in both title and message.");
      return;
    }

    setLoading(true);
    try {
      const res = await broadcastNotification(formData);
      if (!res.success) throw new Error(res.error || "Failed to broadcast");

      toast.success("Broadcast notification dispatched successfully!");
      setIsComposeOpen(false);

      // Optimistically append announcement to notifications list
      const newNotif: NotificationItem = {
        id: `temp-${Date.now()}`,
        title: formData.title,
        message: formData.message,
        type: formData.type,
        target_role:
          formData.target_audience === "players"
            ? "player"
            : formData.target_audience === "admins"
              ? "admin"
              : null,
        target_user_id: null,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);

      setFormData({
        title: "",
        message: "",
        type: "general",
        target_audience: "all",
        tournament_id: tournaments[0]?.id || "",
        sport_id: sports[0]?.id || "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notification Center</h2>
          <p className="text-sm text-muted-foreground">
            Send announcements, match updates, and alerts to athletes and committee members.
          </p>
        </div>

        <Button onClick={() => setIsComposeOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Compose Broadcast</span>
        </Button>
      </div>

      {/* Broadcast History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Dispatched Alerts</CardTitle>
          <CardDescription>
            Audit log of all sent system alerts, tournament reminders, and broadcasts.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead className="font-bold">Type</TableHead>
                <TableHead className="font-bold">Title &amp; Message</TableHead>
                <TableHead className="font-bold">Audience</TableHead>
                <TableHead className="font-bold">Date Sent</TableHead>
                <TableHead className="text-right font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>
                    <Badge variant="outline" className="text-xs uppercase">
                      {n.type.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="font-semibold text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                  </TableCell>
                  <TableCell>
                    {n.target_role ? (
                      <Badge variant="secondary" className="capitalize text-xs">
                        {n.target_role}s
                      </Badge>
                    ) : n.users?.full_name ? (
                      <span className="text-xs font-medium text-foreground">
                        {n.users.full_name}
                      </span>
                    ) : (
                      <Badge variant="default" className="text-xs">
                        All Campus
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(n.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    {n.is_read ? (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Read
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px]">
                        Delivered
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {notifications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    No notifications sent yet. Click &quot;Compose Broadcast&quot; to send your first alert.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Compose Broadcast Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                <span>Compose Broadcast Notification</span>
              </DialogTitle>
              <DialogDescription>
                Dispatch an instant in-app notification to students, captains, or tournament participants.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <Label htmlFor="title">Notification Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Schedule Change: Football Match Rescheduled"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Notification Category</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Announcement</SelectItem>
                    <SelectItem value="match_update">Match Update</SelectItem>
                    <SelectItem value="tournament_update">Tournament Notice</SelectItem>
                    <SelectItem value="team_update">Team / Captain Alert</SelectItem>
                    <SelectItem value="certificate">Certificate Issued</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Select
                  value={formData.target_audience}
                  onValueChange={(val: any) =>
                    setFormData({ ...formData, target_audience: val })
                  }
                >
                  <SelectTrigger id="audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone (Public Broadcast)</SelectItem>
                    <SelectItem value="players">All Registered Athletes</SelectItem>
                    <SelectItem value="admins">Sports Committee &amp; Admins</SelectItem>
                    <SelectItem value="tournament">Specific Tournament Participants</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.target_audience === "tournament" && (
                <div>
                  <Label htmlFor="tournament_id">Select Tournament</Label>
                  <Select
                    value={formData.tournament_id}
                    onValueChange={(val) => setFormData({ ...formData, tournament_id: val })}
                  >
                    <SelectTrigger id="tournament_id">
                      <SelectValue placeholder="Choose tournament" />
                    </SelectTrigger>
                    <SelectContent>
                      {tournaments.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="message">Message Content *</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Type the message body here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsComposeOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-1.5">
                <Send className="h-4 w-4" />
                <span>{loading ? "Sending..." : "Dispatch Broadcast"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
