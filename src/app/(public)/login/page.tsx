"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Trophy, LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error("Login failed: " + error.message);
        return;
      }

      if (data.user) {
        toast.success("Welcome back to PlayOps!");

        // Fetch user role for smart routing
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single();

        const role = (profile as { role?: string } | null)?.role;

        if (redirectPath) {
          router.push(redirectPath);
        } else if (role === "admin") {
          router.push(ROUTES.ADMIN_DASHBOARD);
        } else {
          router.push(ROUTES.PLAYER_DASHBOARD);
        }
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md px-4 py-16 sm:py-24">
      <Card className="shadow-lg border-border/60">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Trophy className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">PlayOps Sign In</CardTitle>
          <CardDescription>
            Enter your college credentials to access match schedules and sports passes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">College / Personal Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@kkwagh.edu.in"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </span>
              )}
            </Button>
          </form>

          <div className="mt-4 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Demo Accounts:</p>
            <p>Admin: admin@kkwagh.edu.in</p>
            <p>Student Athlete: player@kkwagh.edu.in</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm border-t pt-4">
          <p className="text-muted-foreground">
            Don&apos;t have a sports pass account yet?{" "}
            <Link href={ROUTES.REGISTER} className="font-semibold text-primary hover:underline">
              Register now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
