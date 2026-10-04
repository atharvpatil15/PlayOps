"use client";

import { Award, Printer, Shield, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import type { CertificateType } from "@/types/database.types";

export interface CertificateData {
  id: string;
  player_id: string;
  tournament_id: string;
  type: CertificateType;
  issued_date: string;
  certificate_url?: string | null;
  metadata?: any;
  players?: {
    registration_number?: string;
    roll_number?: string;
    department?: string;
    users?: {
      full_name: string;
      email?: string;
    } | null;
  } | null;
  tournaments?: {
    name: string;
    start_date: string;
    end_date: string;
    sports?: {
      name: string;
    } | null;
  } | null;
}

interface CertificateCardProps {
  certificate: CertificateData;
  onPrint?: () => void;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const playerName = certificate.players?.users?.full_name || "Athlete Name";
  const rollNumber =
    certificate.players?.registration_number ||
    certificate.players?.roll_number ||
    "Verified Athlete";
  const department = certificate.players?.department || "Engineering";
  const tournamentName = certificate.tournaments?.name || "KK Wagh Sports Tournament";
  const sportName = certificate.tournaments?.sports?.name || "Inter-Department Championship";

  const getTitleByType = (type: CertificateType) => {
    switch (type) {
      case "winner":
        return {
          title: "CERTIFICATE OF EXCELLENCE",
          subtitle: "FIRST PLACE — CHAMPION",
          accentColor: "border-amber-500 text-amber-500",
          badgeBg: "bg-amber-500/20 text-amber-600 border-amber-500/30",
        };
      case "runner_up":
        return {
          title: "CERTIFICATE OF MERIT",
          subtitle: "RUNNER-UP",
          accentColor: "border-slate-400 text-slate-500",
          badgeBg: "bg-slate-300/30 text-slate-700 border-slate-400/30",
        };
      case "mvp":
        return {
          title: "CERTIFICATE OF DISTINCTION",
          subtitle: "MOST VALUABLE ATHLETE (MVP)",
          accentColor: "border-purple-500 text-purple-500",
          badgeBg: "bg-purple-500/20 text-purple-600 border-purple-500/30",
        };
      case "best_player":
        return {
          title: "CERTIFICATE OF MERIT",
          subtitle: "BEST PERFORMER OF THE TOURNAMENT",
          accentColor: "border-blue-500 text-blue-500",
          badgeBg: "bg-blue-500/20 text-blue-600 border-blue-500/30",
        };
      default:
        return {
          title: "CERTIFICATE OF PARTICIPATION",
          subtitle: "VALUED PARTICIPANT",
          accentColor: "border-emerald-500 text-emerald-600",
          badgeBg: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
        };
    }
  };

  const styleConfig = getTitleByType(certificate.type);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Printable Certificate Frame */}
      <div
        id={`certificate-${certificate.id}`}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-xl border-4 border-amber-500/60 bg-gradient-to-b from-amber-50/20 via-background to-amber-50/10 p-8 shadow-xl print:m-0 print:max-w-none print:border-8 print:p-12 print:shadow-none dark:from-amber-950/10 dark:to-background"
      >
        {/* Ornate corner embellishments */}
        <div className="absolute left-2 top-2 h-8 w-8 border-l-2 border-t-2 border-amber-600" />
        <div className="absolute right-2 top-2 h-8 w-8 border-r-2 border-t-2 border-amber-600" />
        <div className="absolute bottom-2 left-2 h-8 w-8 border-b-2 border-l-2 border-amber-600" />
        <div className="absolute bottom-2 right-2 h-8 w-8 border-b-2 border-r-2 border-amber-600" />

        <div className="space-y-6 text-center">
          {/* Header & Crest */}
          <div className="space-y-1">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 ring-4 ring-amber-500/20">
              <Award className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-extrabold uppercase tracking-wider text-foreground sm:text-2xl">
              K.K. Wagh Institute of Engineering Education &amp; Research
            </h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Department of Physical Education &amp; Sports
            </p>
          </div>

          <div className="mx-auto h-0.5 w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {/* Certificate Title */}
          <div>
            <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {styleConfig.title}
            </h3>
            <span
              className={`mt-1 inline-block rounded-full border px-4 py-0.5 text-xs font-bold uppercase tracking-wider ${styleConfig.badgeBg}`}
            >
              {styleConfig.subtitle}
            </span>
          </div>

          {/* Recipient Details */}
          <div className="space-y-2">
            <p className="text-sm italic text-muted-foreground">This is proudly presented to</p>
            <h4 className="text-2xl font-extrabold text-foreground sm:text-3xl underline decoration-amber-500/40 decoration-wavy underline-offset-8">
              {playerName}
            </h4>
            <p className="text-xs font-medium text-muted-foreground">
              Roll No: <span className="font-mono font-bold text-foreground">{rollNumber}</span> •{" "}
              Department of <span className="font-bold text-foreground">{department}</span>
            </p>
          </div>

          {/* Citation / Context */}
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            in recognition of commendable participation and sporting excellence in{" "}
            <span className="font-bold text-foreground">{tournamentName}</span> (
            <span className="font-semibold text-primary">{sportName}</span>) held at the KK Wagh
            Sports Complex.
          </p>

          {/* Verification Hash & Signatures */}
          <div className="grid grid-cols-2 gap-8 border-t border-border/60 pt-6 sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <p className="font-mono text-xs font-semibold text-foreground">
                {formatDate(certificate.issued_date)}
              </p>
              <p className="text-[10px] uppercase text-muted-foreground">Date of Issue</p>
            </div>

            <div className="hidden text-center sm:block">
              <div className="mx-auto flex h-7 items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase">
                ID: {certificate.id.slice(0, 13)}
              </p>
            </div>

            <div className="text-center sm:text-right">
              <p className="font-serif text-xs font-bold text-foreground italic">
                Dr. Sports Director
              </p>
              <p className="text-[10px] uppercase text-muted-foreground">Director of Sports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Trigger Buttons */}
      <div className="flex items-center justify-end gap-2 print:hidden">
        <Button onClick={handlePrint} variant="default" className="gap-2">
          <Printer className="h-4 w-4" />
          <span>Print / Save as PDF</span>
        </Button>
      </div>
    </div>
  );
}
