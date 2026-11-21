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
          <span className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
            Official Credential Verification
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-normal text-foreground">
            KK Wagh Sports Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            PlayOps Athlete Check-in &amp; Official Award Verification System
          </p>
        </div>

        {cert ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-foreground bg-primary/5 border border-primary/20 rounded-md p-3 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Official Sports Certificate Authenticated &amp; Validated</span>
            </div>
            <CertificateCard certificate={cert as any} />
          </div>
        ) : player ? (
          <Card className="overflow-hidden border border-border bg-card">
            <CardHeader className="pb-2 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <Badge variant="success" className="mx-auto px-3 py-0.5 text-xs font-medium">
                ✓ VERIFIED STUDENT ATHLETE
              </Badge>
              <CardTitle className="mt-2 font-serif text-2xl font-normal text-foreground">
                {player.users?.full_name}
              </CardTitle>
              <CardDescription className="font-mono text-xs text-muted-foreground">
                PRN: {player.registration_number}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-md border border-border bg-muted/20 p-2.5">
                  <span className="block text-[11px] uppercase font-medium tracking-wider text-muted-foreground">Department</span>
                  <span className="mt-0.5 block font-semibold text-foreground">
                    {player.department}
                  </span>
                </div>
                <div className="rounded-md border border-border bg-muted/20 p-2.5">
                  <span className="block text-[11px] uppercase font-medium tracking-wider text-muted-foreground">Academic Year</span>
                  <span className="mt-0.5 block font-semibold text-foreground">{player.year}</span>
                </div>
                <div className="rounded-md border border-border bg-muted/20 p-2.5">
                  <span className="block text-[11px] uppercase font-medium tracking-wider text-muted-foreground">Blood Group</span>
                  <span className="mt-0.5 block font-semibold text-foreground">
                    {player.blood_group || "N/A"}
                  </span>
                </div>
                <div className="rounded-md border border-border bg-muted/20 p-2.5">
                  <span className="block text-[11px] uppercase font-medium tracking-wider text-muted-foreground">Roster Status</span>
                  <span className="mt-0.5 block font-semibold text-primary">
                    {player.is_active ? "Eligible" : "Suspended"}
                  </span>
                </div>
              </div>

              {player.sports_interested && player.sports_interested.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Authorized Sports
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {player.sports_interested.map((sport: string, i: number) => (
                      <span
                        key={i}
                        className="rounded border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground"
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
          <Card className="border border-border bg-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <XCircle className="h-6 w-6" />
              </div>
              <Badge variant="destructive" className="mx-auto text-xs font-medium">
                Unverified Credential
              </Badge>
              <CardTitle className="mt-2 font-serif text-xl font-normal text-foreground">Invalid or Expired Pass</CardTitle>
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
