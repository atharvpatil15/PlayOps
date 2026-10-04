import { getPlayerByQR } from "@/actions/players";
import { CheckCircle2, XCircle, Shield, Award, Calendar, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface VerifyPageProps {
  params: Promise<{
    code: string;
  }>;
}

export const revalidate = 0;

export default async function VerifyPlayerPage({ params }: VerifyPageProps) {
  const { code } = await params;
  const { data: rawPlayer, error } = await getPlayerByQR(code);
  const player = rawPlayer as any;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-1">
          <Badge variant="outline" className="text-xs tracking-wider uppercase mb-1">
            Official Credential Verification
          </Badge>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            KK Wagh Sports Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            PlayOps Athlete Check-in & Eligibility Verification System
          </p>
        </div>

        {player ? (
          <Card className="border-primary/40 shadow-xl overflow-hidden bg-card">
            <div className="h-3 bg-gradient-to-r from-primary to-blue-400" />
            <CardHeader className="text-center pb-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 ring-4 ring-emerald-500/20 mb-2">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <Badge variant="success" className="mx-auto text-xs px-3 py-1 font-semibold">
                ✓ VERIFIED STUDENT ATHLETE
              </Badge>
              <CardTitle className="text-xl font-bold mt-2 text-foreground">
                {player.users?.full_name}
              </CardTitle>
              <CardDescription className="font-mono text-xs text-muted-foreground">
                PRN: {player.registration_number}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
                  <span className="text-muted-foreground block">Department</span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {player.department}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
                  <span className="text-muted-foreground block">Academic Year</span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {player.year}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
                  <span className="text-muted-foreground block">Blood Group</span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {player.blood_group || "N/A"}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
                  <span className="text-muted-foreground block">Roster Status</span>
                  <span className="font-semibold text-emerald-500 mt-0.5 block">
                    {player.is_active ? "Eligible" : "Suspended"}
                  </span>
                </div>
              </div>

              {player.sports_interested && player.sports_interested.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Authorized Sports
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {player.sports_interested.map((sport: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] bg-primary/10 text-primary border border-primary/20 font-medium"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1 font-mono">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span>ID: {player.qr_code || player.registration_number}</span>
                </div>
                <span>KKWIEER Campus</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-destructive/30 shadow-md">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-2">
                <XCircle className="h-8 w-8" />
              </div>
              <Badge variant="destructive" className="mx-auto">
                Unverified Credential
              </Badge>
              <CardTitle className="text-lg font-bold mt-2">Invalid or Expired Pass</CardTitle>
              <CardDescription>
                No active student athlete found with identifier:{" "}
                <span className="font-mono text-foreground font-semibold">{code}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-xs text-muted-foreground mb-4">
                Please contact the KK Wagh Sports Department desk or verify the code.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
