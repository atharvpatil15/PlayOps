"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Trophy, Calendar, Award, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNotifications, markAsRead, markAllAsRead } from "@/actions/notifications";
import { useUser } from "@/hooks/use-user";
import { formatDate } from "@/lib/utils/format";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const { user, isAdmin } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNotifs() {
      try {
        const res = await getNotifications(user?.id);
        if (res.data) {
          setNotifications(res.data as any);
        }
      } catch {
        // silently fail if user is offline or not logged in
      }
    }
    fetchNotifs();
  }, [user?.id]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    await markAllAsRead(user?.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "match_update":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "tournament_update":
        return <Trophy className="h-4 w-4 text-amber-500" />;
      case "certificate":
        return <Award className="h-4 w-4 text-emerald-500" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const targetLink = isAdmin ? "/admin/notifications" : "/player/notifications";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <DropdownMenuLabel className="p-0 font-bold">Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={loading}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto divide-y">
          {notifications.slice(0, 5).map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-3 transition-colors hover:bg-muted/50 ${
                !n.is_read ? "bg-primary/5" : ""
              }`}
            >
              <div className="mt-0.5">{getTypeIcon(n.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-foreground leading-tight">{n.title}</p>
                  {!n.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      title="Mark as read"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{n.message}</p>
                <p className="text-[10px] text-muted-foreground/80">
                  {formatDate(n.created_at)}
                </p>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No notifications at this time
            </div>
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <div className="p-2 text-center">
          <Link
            href={targetLink}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View all alerts &rarr;
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
