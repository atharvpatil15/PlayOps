"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Trophy, Radio, BarChart3, Menu, X, Shield, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/helpers";
import { ROUTES } from "@/lib/constants/routes";
import { useUser } from "@/hooks/use-user";
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";
import { NotificationBell } from "@/components/layout/notification-bell";
import { UserNav } from "@/components/layout/user-nav";
import { toast } from "sonner";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
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

  const handleMobileSignOut = async () => {
    try {
      setMobileMenuOpen(false);
      await supabase.auth.signOut();
      useAuthStore.getState().logout();
      toast.success("Successfully logged out");
      router.push(ROUTES.LOGIN);
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("Could not sign out. Please try again.");
    }
  };

  const displayName = user?.fullName || (isAdmin ? "Sports Administrator" : "Student Athlete");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 sm:h-18 max-w-7xl items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/kk-wagh-logo.png"
              alt="K. K. Wagh Education Society"
              width={260}
              height={75}
              priority
              className="h-11 sm:h-14 w-auto object-contain dark:brightness-0 dark:invert transition-all"
            />
            <div className="hidden border-l border-border/60 pl-3 sm:flex flex-col">
              <span className="text-base font-bold leading-tight tracking-tight text-foreground font-serif">
                PlayOps
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Athletic Portal
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

        {/* Desktop user navigation */}
        <div className="hidden items-center space-x-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <NotificationBell />
              {isAdmin ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden lg:inline-flex items-center gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                >
                  <Link href={ROUTES.ADMIN_DASHBOARD}>
                    <Shield className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden lg:inline-flex items-center gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                >
                  <Link href={ROUTES.PLAYER_DASHBOARD}>
                    <Trophy className="h-4 w-4" />
                    <span>Athlete Hub</span>
                  </Link>
                </Button>
              )}
              {/* Profile icon visible on all pages */}
              <UserNav align="end" showName={true} />
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

        {/* Mobile top controls */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && <UserNav align="end" />}
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

      {/* Mobile nav dropdown drawer */}
      {mobileMenuOpen && (
        <div className="border-b bg-background px-4 py-4 md:hidden animate-in slide-in-from-top-2 duration-200">
          {isAuthenticated && user && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={user.avatarUrl || undefined} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                <div className="mt-1">
                  {isAdmin ? (
                    <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4 font-semibold uppercase">
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 font-semibold uppercase">
                      Athlete
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

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
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link
                      href={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.PLAYER_DASHBOARD}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {isAdmin ? "Open Admin Governance Hub" : "Open Athlete Dashboard"}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center justify-center gap-2"
                    onClick={handleMobileSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </div>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>
                      Register / Sports Pass
                    </Link>
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
