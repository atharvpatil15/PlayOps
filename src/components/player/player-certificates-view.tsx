"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Printer, ShieldCheck, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CertificateCard, type CertificateData } from "@/components/shared/certificate-card";
import { formatDate } from "@/lib/utils/format";

interface PlayerCertificatesViewProps {
  certificates: CertificateData[];
}

export function PlayerCertificatesView({ certificates }: PlayerCertificatesViewProps) {
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  return (
    <div className="space-y-6">
      {certificates.length > 0 ? (
        <div className="space-y-4">
          {certificates.map((c) => (
            <Card key={c.id} className="p-4 transition-all hover:border-amber-500/50 hover:shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-amber-500/10 p-3 text-amber-600">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold capitalize text-foreground">
                        {c.type.replace(/_/g, " ")} Certificate
                      </h3>
                      <Badge variant="outline" className="text-xs font-mono">
                        {formatDate(c.issued_date)}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-primary">
                      {c.tournaments?.name || "Tournament"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Sport: {c.tournaments?.sports?.name || "Sports Event"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setSelectedCert(c)}
                  >
                    <Eye className="h-4 w-4" />
                    <span>View &amp; Print</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="No Certificates Yet"
          description="Your official digital certificates for completed tournaments and podium finishes will appear here."
        />
      )}

      {/* Certificate Modal */}
      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        <DialogContent className="max-w-4xl p-6">
          <DialogHeader>
            <DialogTitle>Certificate of Achievement</DialogTitle>
          </DialogHeader>
          {selectedCert && <CertificateCard certificate={selectedCert} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
