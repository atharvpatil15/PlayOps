"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { UserRole } from "@/types/database.types";

export function useUser() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          setUser(null);
          return;
        }

        const { data: profile } = await supabase
          .from("users")
          .select("id, email, full_name, role, avatar_url")
          .eq("id", authUser.id)
          .single();

        const role =
          (profile?.role as UserRole) ||
          (authUser.app_metadata?.role as UserRole) ||
          (authUser.user_metadata?.role as UserRole) ||
          "player";

        setUser({
          id: profile?.id || authUser.id,
          email: profile?.email || authUser.email || "",
          fullName:
            profile?.full_name ||
            (authUser.user_metadata?.full_name as string) ||
            authUser.email?.split("@")[0] ||
            "User",
          role,
          avatarUrl:
            profile?.avatar_url ||
            (authUser.user_metadata?.avatar_url as string) ||
            null,
        });
      } catch (err) {
        console.error("Error loading user session:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("id, email, full_name, role, avatar_url")
          .eq("id", session.user.id)
          .single();

        const role =
          (profile?.role as UserRole) ||
          (session.user.app_metadata?.role as UserRole) ||
          (session.user.user_metadata?.role as UserRole) ||
          "player";

        setUser({
          id: profile?.id || session.user.id,
          email: profile?.email || session.user.email || "",
          fullName:
            profile?.full_name ||
            (session.user.user_metadata?.full_name as string) ||
            session.user.email?.split("@")[0] ||
            "User",
          role,
          avatarUrl:
            profile?.avatar_url ||
            (session.user.user_metadata?.avatar_url as string) ||
            null,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, supabase]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isPlayer: user?.role === "player",
  };
}
