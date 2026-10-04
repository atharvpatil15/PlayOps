"use client";

import Link from "next/link";
import Image from "next/image";
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
  Radio,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

interface SidebarProps {
  role: "player" | "admin";
}

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const playerNavItems: NavItem[] = [
    { title: "Dashboard", href: ROUTES.PLAYER_DASHBOARD, icon: LayoutDashboard },
    { title: "My Profile & QR", href: ROUTES.PLAYER_PROFILE, icon: User },
    { title: "My Team", href: ROUTES.PLAYER_TEAM, icon: Users },
    { title: "Matches Schedule", href: ROUTES.PLAYER_MATCHES, icon: Calendar },
    { title: "Performance Radar", href: ROUTES.PLAYER_PERFORMANCE, icon: BarChart },
    { title: "Notifications", href: ROUTES.PLAYER_NOTIFICATIONS, icon: Bell },
    { title: "Certificates", href: ROUTES.PLAYER_CERTIFICATES, icon: Award },
  ];

  const adminSections: { group: string; items: NavItem[] }[] = [
    {
      group: "Live Operations",
      items: [
        { title: "Governance Hub", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
        { title: "Matches & Live Feed", href: ROUTES.ADMIN_MATCHES, icon: Flame, badge: "LIVE" },
        { title: "Tournaments & Cups", href: ROUTES.ADMIN_TOURNAMENTS, icon: Trophy },
      ],
    },
    {
      group: "Roster & Infrastructure",
      items: [
        { title: "Department Teams", href: ROUTES.ADMIN_TEAMS, icon: Users },
        { title: "Player Directory", href: ROUTES.ADMIN_PLAYERS, icon: User },
        { title: "Sports Disciplines", href: ROUTES.ADMIN_SPORTS, icon: Shield },
        { title: "Campus Grounds", href: ROUTES.ADMIN_VENUES, icon: MapPin },
      ],
    },
    {
      group: "Records & Communication",
      items: [
        { title: "Announcements", href: ROUTES.ADMIN_NOTIFICATIONS, icon: Bell },
        { title: "Merit Certificates", href: ROUTES.ADMIN_CERTIFICATES, icon: Award },
        { title: "Reports & Analytics", href: ROUTES.ADMIN_REPORTS, icon: FileText },
        { title: "Portal Settings", href: ROUTES.ADMIN_SETTINGS, icon: Settings },
      ],
    },
  ];

  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r border-border/60 bg-card/60 p-4 backdrop-blur-md md:flex">
      <div className="space-y-4">
        {/* Institutional Branding Header */}
        <div className="border-b border-border/50 pb-3 px-2">
          <Link href="/" className="block">
            <Image
              src="/kk-wagh-logo.png"
              alt="KK Wagh Logo"
              width={220}
              height={62}
              priority
              className="h-11 w-auto object-contain dark:brightness-0 dark:invert transition-all"
            />
          </Link>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
              {role === "admin" ? "Directorate Console" : "Athlete Portal"}
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Navigation Items */}
        {role === "admin" ? (
          <div className="space-y-4">
            {adminSections.map((section) => (
              <div key={section.group}>
                <h3 className="mb-1.5 px-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  {section.group}
                </h3>
                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== ROUTES.ADMIN_DASHBOARD && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <span className={cn(
                            "rounded px-1.5 py-0.2 text-[9px] font-extrabold uppercase",
                            isActive ? "bg-white/20 text-white" : "bg-red-500/10 text-red-600 dark:text-red-400"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-1 py-1">
            <h2 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Player Portal
            </h2>
            <nav className="space-y-1">
              {playerNavItems.map((item) => {
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
        )}
      </div>

      {/* Bottom Attribution */}
      <div className="border-t border-border/50 p-2.5 text-xs text-muted-foreground">
        <p className="font-serif font-bold text-foreground">KK Wagh Education Society</p>
        <p className="text-[10px] font-mono text-muted-foreground">PlayOps Athletic Engine v1.0</p>
      </div>
    </aside>
  );
}
