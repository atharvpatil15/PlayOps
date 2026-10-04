"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Radio, BarChart3, User, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import { useUser } from "@/hooks/use-user";
import { NotificationBell } from "@/components/layout/notification-bell";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin } = useUser();

  const navLinks = [
    { title: "Tournaments", href: ROUTES.TOURNAMENTS, icon: Trophy },
    {
      title: "Live Scores",
      href: ROUTES.LIVE,
      icon: Radio,
      badge: "LIVE",
    },
    { title: "Results", href: ROUTES.RESULTS, icon: Trophy },
    { title: "Points Table", href: ROUTES.POINTS_TABLE, icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-black text-primary-foreground shadow-sm">
              PO
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
                PlayOps
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                KK Wagh Sports
              </span>
            </div>
          </Link>

          <nav className="hidden items-center space-x-1 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center space-x-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.title}</span>
                  {link.badge && (
                    <span className="relative ml-1 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center space-x-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <NotificationBell />
              {isAdmin ? (
                <Button asChild variant="default" size="sm">
                  <Link href={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="default" size="sm">
                  <Link href={ROUTES.PLAYER_DASHBOARD} className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link href={ROUTES.LOGIN}>Log in</Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link href={ROUTES.REGISTER}>Register / Sports Pass</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="border-b bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{link.title}</span>
                  </div>
                  {link.badge && (
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950 dark:text-red-400">
                      LIVE
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="flex flex-col space-y-2 border-t pt-3">
              {isAuthenticated ? (
                <Button asChild className="w-full">
                  <Link href={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.PLAYER_DASHBOARD}>
                    Go to {isAdmin ? "Admin Panel" : "Player Dashboard"}
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={ROUTES.LOGIN}>Log in</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href={ROUTES.REGISTER}>Register / Sports Pass</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
