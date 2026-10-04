import Link from "next/link";
import { Award, Download, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PlayerCertificatesPage() {
  const certs = [
    {
      id: "cert-1",
      title: "Winner — Gold Medalist",
      tournament: "Inter-Department Cricket Premier League 2026",
      date: "22 Oct 2026",
      code: "KKW-CRK-2026-WIN-001",
    },
    {
      id: "cert-2",
      title: "Participation Certificate",
      tournament: "Annual Badminton Shuttlers Trophy 2026",
      date: "27 Oct 2026",
      code: "KKW-BDM-2026-PAR-042",
    },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Digital Merit & Participation Certificates
        </h1>
        <p className="text-sm text-muted-foreground">
          Download and verify official cryptographically signed certificates for your college
          portfolio.
        </p>
      </div>

      <div className="space-y-4">
        {certs.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-lg bg-amber-500/10 p-2 text-amber-600">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">{c.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {c.date}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{c.tournament}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">Code: {c.code}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <Link href={`/verify/${c.code}`}>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verify QR</span>
                  </Link>
                </Button>
                <Button size="sm" className="gap-1.5">
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
