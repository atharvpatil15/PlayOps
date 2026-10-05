import { getPlayerByQR } from "@/actions/players";
import { getCertificateByCode } from "@/actions/certificates";
import { CertificateCard } from "@/components/shared/certificate-card";
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
  
  // Try checking certificate first if code starts with cert- or is a UUID
  let cert = null;
  if (code.toLowerCase().includes("cert-")) {
    const certRes = await getCertificateByCode(code);
    cert = certRes.data;
  }

  const { data: rawPlayer } = await getPlayerByQR(code);
  const player = rawPlayer as any;

  if (!player && !cert) {
    // If not found yet, try certificate lookup
    const certRes = await getCertificateByCode(code);
    cert = certRes.data;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className={`w-full ${cert ? "max-w-5xl" : "max-w-md"} space-y-6`}>
        <div className="space-y-1 text-center">
          <Badge variant="outline" className="mb-1 text-xs uppercase tracking-wider">
            Official Credential Verification
          </Badge>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            KK Wagh Sports Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            PlayOps Athlete Check-in &amp; Official Award Verification System
          </p>
        </div>

        {cert ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              <span>Official Sports Certificate Authenticated &amp; Validated</span>
            </div>
            <CertificateCard certificate={cert as any} />
          </div>
        ) : player ? (
          <Card className="overflow-hidden border-primary/40 bg-card shadow-xl">
            <div className="h-3 bg-gradient-to-r from-primary to-blue-400" />
            <CardHeader className="pb-2 text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 ring-4 ring-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <Badge variant="success" className="mx-auto px-3 py-1 text-xs font-semibold">
                ✓ VERIFIED STUDENT ATHLETE
              </Badge>
              <CardTitle className="mt-2 text-xl font-bold text-foreground">
                {player.users?.full_name}
              </CardTitle>
              <CardDescription className="font-mono text-xs text-muted-foreground">
                PRN: {player.registration_number}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/50 p-2.5">
                  <span className="block text-muted-foreground">Department</span>
                  <span className="mt-0.5 block font-semibold text-foreground">
                    {player.department}
                  </span>
                </div>
                <div className="rounded-lg border border-border bg-muted/50 p-2.5">
                  <span className="block text-muted-foreground">Academic Year</span>
                  <span className="mt-0.5 block font-semibold text-foreground">{player.year}</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/50 p-2.5">
                  <span className="block text-muted-foreground">Blood Group</span>
                  <span className="mt-0.5 block font-semibold text-foreground">
                    {player.blood_group || "N/A"}
                  </span>
                </div>
                <div className="rounded-lg border border-border bg-muted/50 p-2.5">
                  <span className="block text-muted-foreground">Roster Status</span>
                  <span className="mt-0.5 block font-semibold text-emerald-500">
                    {player.is_active ? "Eligible" : "Suspended"}
                  </span>
                </div>
              </div>

              {player.sports_interested && player.sports_interested.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Authorized Sports
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {player.sports_interested.map((sport: string, i: number) => (
                      <span
                        key={i}
                        className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
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
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                <XCircle className="h-8 w-8" />
              </div>
              <Badge variant="destructive" className="mx-auto">
                Unverified Credential
              </Badge>
              <CardTitle className="mt-2 text-lg font-bold">Invalid or Expired Pass</CardTitle>
              <CardDescription>
                No active student athlete found with identifier:{" "}
                <span className="font-mono font-semibold text-foreground">{code}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4 text-xs text-muted-foreground">
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
