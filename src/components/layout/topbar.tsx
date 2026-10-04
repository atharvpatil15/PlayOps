"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Bell, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils/helpers";
import { ROUTES } from "@/lib/constants/routes";

interface TopbarProps {
  title?: string;
  role: "player" | "admin";
}

export function Topbar({ title, role }: TopbarProps) {
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push(ROUTES.LOGIN);
    router.refresh();
  };

  const displayName = user?.fullName || (role === "admin" ? "Sports Admin" : "Athlete Player");
  const displayEmail = user?.email || (role === "admin" ? "admin@kkwagh.edu.in" : "student@kkwagh.edu.in");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center space-x-2 md:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-sm">
            PO
          </span>
        </Link>
        {title && <h1 className="text-lg font-bold text-foreground sm:text-xl">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={role === "admin" ? "destructive" : "secondary"} className="capitalize">
          {role === "admin" ? "Admin Governance" : "Player Mode"}
        </Badge>

        <Link
          href={role === "admin" ? ROUTES.ADMIN_NOTIFICATIONS : ROUTES.PLAYER_NOTIFICATIONS}
          className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.PLAYER_PROFILE}
                className="flex items-center cursor-pointer"
              >
                {role === "admin" ? (
                  <Shield className="mr-2 h-4 w-4" />
                ) : (
                  <User className="mr-2 h-4 w-4" />
                )}
                <span>Profile & Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/" className="flex items-center cursor-pointer">
                <span>Back to Public Portal</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
