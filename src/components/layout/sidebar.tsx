"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  Trophy,
  Calendar,
  Award,
  Bell,
  BarChart,
  Shield,
  MapPin,
  FileText,
  Settings,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

interface SidebarProps {
  role: "player" | "admin";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const playerNavItems = [
    { title: "Dashboard", href: ROUTES.PLAYER_DASHBOARD, icon: LayoutDashboard },
    { title: "My Profile & QR", href: ROUTES.PLAYER_PROFILE, icon: User },
    { title: "My Team", href: ROUTES.PLAYER_TEAM, icon: Users },
    { title: "Matches Schedule", href: ROUTES.PLAYER_MATCHES, icon: Calendar },
    { title: "Performance Radar", href: ROUTES.PLAYER_PERFORMANCE, icon: BarChart },
    { title: "Notifications", href: ROUTES.PLAYER_NOTIFICATIONS, icon: Bell },
    { title: "Certificates", href: ROUTES.PLAYER_CERTIFICATES, icon: Award },
  ];

  const adminNavItems = [
    { title: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    { title: "Tournaments", href: ROUTES.ADMIN_TOURNAMENTS, icon: Trophy },
    { title: "Matches & Live", href: ROUTES.ADMIN_MATCHES, icon: Flame },
    { title: "Sports Catalog", href: ROUTES.ADMIN_SPORTS, icon: Shield },
    { title: "Teams", href: ROUTES.ADMIN_TEAMS, icon: Users },
    { title: "Player Directory", href: ROUTES.ADMIN_PLAYERS, icon: User },
    { title: "Venues & Grounds", href: ROUTES.ADMIN_VENUES, icon: MapPin },
    { title: "Announcements", href: ROUTES.ADMIN_NOTIFICATIONS, icon: Bell },
    { title: "Certificates", href: ROUTES.ADMIN_CERTIFICATES, icon: Award },
    { title: "Reports & Analytics", href: ROUTES.ADMIN_REPORTS, icon: FileText },
    { title: "Settings", href: ROUTES.ADMIN_SETTINGS, icon: Settings },
  ];

  const navItems = role === "admin" ? adminNavItems : playerNavItems;

  return (
    <aside className="w-64 border-r border-border bg-card/60 backdrop-blur min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {role === "admin" ? "Administration" : "Player Portal"}
          </h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3 border-t text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">KK Wagh Sports</p>
        <p>PlayOps v1.0 Enterprise</p>
      </div>
    </aside>
  );
}
