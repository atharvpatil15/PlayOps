"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/constants/routes";
import { UserNav } from "@/components/layout/user-nav";

interface TopbarProps {
  title?: string;
  role: "player" | "admin";
}

export function Topbar({ title, role }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center space-x-2 md:hidden">
          <Image
            src="/kk-wagh-logo.png"
            alt="KK Wagh Logo"
            width={150}
            height={44}
            className="h-9 sm:h-10 w-auto object-contain dark:brightness-0 dark:invert transition-all"
          />
        </Link>
        {title && <h1 className="font-serif text-lg font-bold text-foreground sm:text-xl">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={role === "admin" ? "destructive" : "secondary"} className="capitalize font-semibold">
          {role === "admin" ? "Admin Governance" : "Player Mode"}
        </Badge>

        <Link
          href={role === "admin" ? ROUTES.ADMIN_NOTIFICATIONS : ROUTES.PLAYER_NOTIFICATIONS}
          className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Link>

        <UserNav align="end" showName={true} />
      </div>
    </header>
  );
}
