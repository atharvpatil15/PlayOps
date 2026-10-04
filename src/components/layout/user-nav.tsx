"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  Trophy,
  Flame,
  Award,
  Settings,
  LogOut,
  Shield,
  ExternalLink,
  Loader2,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils/helpers";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserNavProps {
  align?: "start" | "end" | "center";
  showName?: boolean;
  className?: string;
}

export function UserNav({ align = "end", showName = false, className }: UserNavProps) {
  const { user, isAuthenticated, isAdmin, isLoading } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  if (isLoading) {
    return (
      <div className={cn("h-9 w-9 rounded-full bg-muted/60 animate-pulse border border-border/50", className)} />
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const displayName = user.fullName || (isAdmin ? "Sports Administrator" : "Student Athlete");
  const displayEmail = user.email || "";

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      useAuthStore.getState().logout();
      toast.success("Successfully logged out");
      router.push(ROUTES.LOGIN);
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("Could not sign out properly. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative flex items-center gap-2 rounded-full p-0.5 hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all",
            className
          )}
          aria-label="User navigation menu"
        >
          <Avatar className="h-9 w-9 border-2 border-border shadow-sm ring-1 ring-primary/20 hover:ring-primary/40 transition-all">
            <AvatarImage src={user.avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          {showName && (
            <div className="hidden text-left sm:block pr-1.5">
              <p className="text-xs font-semibold leading-none text-foreground truncate max-w-[130px]">
                {displayName}
              </p>
              <p className="text-[10px] text-muted-foreground capitalize mt-0.5">
                {isAdmin ? "Admin" : "Player"}
              </p>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-2 shadow-xl border-border/80" align={align} forceMount>
        {/* User Identity Header */}
        <DropdownMenuLabel className="font-normal p-2 pb-2.5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={user.avatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5 overflow-hidden">
              <p className="text-sm font-semibold leading-tight text-foreground truncate">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
              <div className="pt-1">
                {isAdmin ? (
                  <Badge
                    variant="destructive"
                    className="text-[10px] px-1.5 py-0 h-4 font-semibold uppercase tracking-wider flex items-center gap-1 w-fit"
                  >
                    <Shield className="h-2.5 w-2.5" />
                    <span>Administrator</span>
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4 font-semibold uppercase tracking-wider flex items-center gap-1 w-fit bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                  >
                    <Trophy className="h-2.5 w-2.5" />
                    <span>Student Athlete</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1" />

        {/* Portal-specific navigation options */}
        <DropdownMenuGroup>
          {isAdmin ? (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.ADMIN_DASHBOARD}
                  className="flex cursor-pointer items-center py-2 text-xs font-medium"
                >
                  <LayoutDashboard className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span>Governance Hub</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.ADMIN_MATCHES}
                  className="flex cursor-pointer items-center py-2 text-xs font-medium"
                >
                  <Flame className="mr-2.5 h-4 w-4 text-orange-500" />
                  <span>Matches & Live Operations</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.ADMIN_TOURNAMENTS}
                  className="flex cursor-pointer items-center py-2 text-xs font-medium"
                >
                  <Trophy className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span>Tournaments & Cups</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.ADMIN_TEAMS}
                  className="flex cursor-pointer items-center py-2 text-xs font-medium"
                >
                  <Users className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span>Department Teams</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.ADMIN_SETTINGS}
                  className="flex cursor-pointer items-center py-2 text-xs font-medium"
                >
                  <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span>Portal Settings</span>
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.PLAYER_DASHBOARD}
                  className="flex cursor-pointer items-center py-2 text-xs font-medium"
                >
                  <LayoutDashboard className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span>Athlete Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.PLAYER_PROFILE}
                  className="flex cursor-pointer items-center py-2 text-xs font-medium"
                >
                  <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span>Profile & Sports Pass</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.PLAYER_TEAM}
                  className="flex cursor-pointer items-center py-2 text-xs font-medium"
                >
                  <Users className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span>My Team Roster</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.PLAYER_MATCHES}
                  className="flex cursor-pointer items-center py-2 text-xs font-medium"
                >
                  <Calendar className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span>Match Schedule</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={ROUTES.PLAYER_CERTIFICATES}
                  className="flex cursor-pointer items-center py-2 text-xs font-medium"
                >
                  <Award className="mr-2.5 h-4 w-4 text-muted-foreground" />
                  <span>Merit Certificates</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        {/* Public Portal Switcher */}
        <DropdownMenuItem asChild>
          <Link href="/" className="flex cursor-pointer items-center py-2 text-xs font-medium">
            <ExternalLink className="mr-2.5 h-4 w-4 text-muted-foreground" />
            <span>Public Match Center</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        {/* Logout Action */}
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="cursor-pointer py-2 text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center"
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2.5 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2.5 h-4 w-4" />
          )}
          <span>{isLoggingOut ? "Signing out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
