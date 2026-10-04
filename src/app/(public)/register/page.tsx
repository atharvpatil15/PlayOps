"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trophy, UserPlus, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
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

const registerSchema = z
  .object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    role: z.enum(["player", "viewer"]),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "player",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            role: values.role,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error("Registration failed: " + error.message);
        return;
      }

      if (data.user) {
        // Create matching public.users row
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          email: values.email,
          full_name: values.fullName,
          role: values.role,
        });

        if (profileError) {
          console.warn("Notice: public.users row creation:", profileError.message);
        }

        toast.success("Account registered successfully! Welcome to PlayOps.");
        router.push(ROUTES.PLAYER_DASHBOARD);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
            <Trophy className="h-8 w-8" />
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground">
            Create Sports Pass
          </h2>
          <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
            Join KK Wagh PlayOps to participate in sports leagues and track live scores
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
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="e.g. Atharva Joshi"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>College Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="student@kkwagh.edu.in"
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
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Participation Role</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => field.onChange("player")}
                              className={`relative flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-semibold transition-all duration-200 ${
                                field.value === "player"
                                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20"
                                  : "border-border text-muted-foreground hover:border-border/80 hover:bg-muted/50"
                              }`}
                            >
                              {field.value === "player" && (
                                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                  <Check className="h-3 w-3" />
                                </span>
                              )}
                              Student Athlete
                            </button>
                            <button
                              type="button"
                              onClick={() => field.onChange("viewer")}
                              className={`relative flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-semibold transition-all duration-200 ${
                                field.value === "viewer"
                                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20"
                                  : "border-border text-muted-foreground hover:border-border/80 hover:bg-muted/50"
                              }`}
                            >
                              {field.value === "viewer" && (
                                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                  <Check className="h-3 w-3" />
                                </span>
                              )}
                              Spectator
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Min. 6 characters"
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
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Repeat password"
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
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Generating Sports Pass...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Register Account
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 rounded-b-xl border-t bg-muted/10 p-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already registered?{" "}
              <Link
                href={ROUTES.LOGIN}
                className="font-semibold text-primary transition-all hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
