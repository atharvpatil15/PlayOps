"use client";

import { useState } from "react";
import {
  Bell,
  Calendar,
  Trophy,
  Award,
  CheckCircle2,
  Info,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { markAsRead, markAllAsRead } from "@/actions/notifications";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface PlayerNotificationsListProps {
  initialNotifications: NotificationItem[];
  userId?: string;
}

export function PlayerNotificationsList({
  initialNotifications,
  userId,
}: PlayerNotificationsListProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filterType, setFilterType] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const handleMarkOne = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    toast.success("Notification marked as read");
  };

  const handleMarkAll = async () => {
    setLoading(true);
    try {
      await markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setLoading(false);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "all") return true;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "match_update":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "tournament_update":
        return <Trophy className="h-5 w-5 text-amber-500" />;
      case "certificate":
        return <Award className="h-5 w-5 text-emerald-500" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filterType === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilterType("match_update")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filterType === "match_update"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Matches
          </button>
          <button
            onClick={() => setFilterType("tournament_update")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filterType === "tournament_update"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Tournaments
          </button>
          <button
            onClick={() => setFilterType("certificate")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filterType === "certificate"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Certificates
          </button>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAll}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Mark All As Read ({unreadCount})</span>
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((n) => (
            <Card
              key={n.id}
              className={`transition-colors ${
                !n.is_read
                  ? "border-primary/50 bg-primary/[0.03] shadow-sm"
                  : "border-border/60 hover:border-border"
              }`}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className="mt-1 shrink-0 rounded-xl bg-muted/60 p-2.5">
                  {getTypeIcon(n.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-sm sm:text-base">
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <Badge variant="live" className="text-[10px] px-1.5 py-0">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(n.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>
                </div>
                {!n.is_read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 h-8 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => handleMarkOne(n.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="Inbox Zero"
          description="You do not have any sports notifications matching the selected filter."
        />
      )}
    </div>
  );
}
