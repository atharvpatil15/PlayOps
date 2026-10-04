"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trophy, LogIn, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error("Login failed: " + error.message);
        return;
      }

      if (data.user) {
        toast.success("Welcome back to PlayOps!");

        // Fetch user role for smart routing with robust auth metadata fallback
        let role: string | undefined =
          (data.user.app_metadata?.role as string | undefined) ||
          (data.user.user_metadata?.role as string | undefined);

        if (!role) {
          const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();
          role = (profile as { role?: string } | null)?.role;
        }

        if (role === "admin") {
          // If admin, strictly navigate to admin dashboard (or specific admin subroute if requested)
          if (redirectPath && redirectPath.startsWith("/admin")) {
            router.push(redirectPath);
          } else {
            router.push(ROUTES.ADMIN_DASHBOARD);
          }
        } else {
          // Player/viewer routing
          if (redirectPath && !redirectPath.startsWith("/admin")) {
            router.push(redirectPath);
          } else {
            router.push(ROUTES.PLAYER_DASHBOARD);
          }
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
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Link href="/" className="mb-4 inline-block">
            <Image
              src="/kk-wagh-logo.png"
              alt="K. K. Wagh Education Society"
              width={280}
              height={80}
              priority
              className="h-16 sm:h-20 w-auto object-contain dark:brightness-0 dark:invert transition-all"
            />
          </Link>
          <h2 className="text-center font-serif text-3xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
            Enter your college credentials to access match schedules and sports passes
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 shadow-xl backdrop-blur-sm">
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {errorMessage && (
                  <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/15 p-4 text-sm font-medium text-destructive">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College / Personal Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@kkwagh.edu.in"
                            className="h-11"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          {/* Future link for forgot password */}
                          {/* <Link href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link> */}
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="h-11"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-5 w-5" />
                      Sign In to PlayOps
                    </span>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 rounded-xl border border-primary/20 bg-primary/[0.03] p-4">
              <div className="mb-2.5 flex items-center justify-between">
                <h4 className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Admin Login Credentials
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10"
                  onClick={() => {
                    form.setValue("email", "atharwapatil1@gmail.com");
                    form.setValue("password", "Admin@123");
                    toast.info("Admin credentials filled! Click 'Sign In' to enter.");
                  }}
                >
                  ⚡ Auto-fill Admin
                </Button>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-background/70 p-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">Email:</span>
                    <code className="font-mono font-bold text-primary">
                      atharwapatil1@gmail.com
                    </code>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">Password:</span>
                    <code className="font-mono font-bold text-foreground">
                      Admin@123
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 rounded-b-xl border-t bg-muted/10 p-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have a sports pass account yet?{" "}
              <Link
                href={ROUTES.REGISTER}
                className="font-semibold text-primary transition-all hover:underline"
              >
                Register now
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
