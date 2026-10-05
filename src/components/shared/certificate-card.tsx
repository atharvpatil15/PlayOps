"use client";

import { useState, useEffect } from "react";
import { Award, Printer, Shield, CheckCircle2, Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import type { CertificateType } from "@/types/database.types";
import { QRCodeSVG } from "qrcode.react";

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
    certificate.metadata?.registration_number ||
    "Verified Athlete";
  const department =
    certificate.players?.department ||
    certificate.metadata?.department ||
    "Engineering";
  const tournamentName =
    certificate.tournaments?.name ||
    certificate.metadata?.tournament_name ||
    "KK Wagh Sports Tournament";
  const sportName =
    certificate.tournaments?.sports?.name ||
    certificate.metadata?.sport_name ||
    "Inter-Department Championship";
  const teamName = certificate.metadata?.team_name;

  const getTitleByType = (type: CertificateType) => {
    switch (type) {
      case "winner":
        return {
          title: "CERTIFICATE OF EXCELLENCE",
          subtitle: "FIRST PLACE — CHAMPION",
          accentColor: "border-[#B8860B] text-[#997A15]",
          badgeBg: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/40",
          ribbonColor: "from-amber-600 to-yellow-500",
        };
      case "runner_up":
        return {
          title: "CERTIFICATE OF MERIT",
          subtitle: "SECOND PLACE — RUNNER-UP",
          accentColor: "border-slate-400 text-slate-600 dark:text-slate-300",
          badgeBg: "bg-slate-400/15 text-slate-700 dark:text-slate-300 border-slate-400/40",
          ribbonColor: "from-slate-500 to-slate-400",
        };
      case "mvp":
        return {
          title: "CERTIFICATE OF DISTINCTION",
          subtitle: "MOST VALUABLE PLAYER (MVP)",
          accentColor: "border-purple-600 text-purple-600",
          badgeBg: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/40",
          ribbonColor: "from-purple-700 to-purple-500",
        };
      case "best_player":
        return {
          title: "CERTIFICATE OF MERIT",
          subtitle: "BEST PERFORMER OF THE TOURNAMENT",
          accentColor: "border-blue-600 text-blue-600",
          badgeBg: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/40",
          ribbonColor: "from-blue-700 to-cyan-500",
        };
      default:
        return {
          title: "CERTIFICATE OF PARTICIPATION",
          subtitle: "VALUED PARTICIPANT",
          accentColor: "border-emerald-600 text-emerald-700 dark:text-emerald-400",
          badgeBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40",
          ribbonColor: "from-emerald-700 to-teal-500",
        };
    }
  };

  const styleConfig = getTitleByType(certificate.type);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePdf = () => {
    const originalTitle = document.title;
    const sanitizedName = playerName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const sanitizedTournament = tournamentName.replace(/[^a-zA-Z0-9_-]/g, "_");
    document.title = `${sanitizedName}_${sanitizedTournament}_Certificate`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  // Safe verification URL origin that prevents hydration mismatches
  const [origin, setOrigin] = useState("https://playops.kkwagh.edu");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setOrigin(window.location.origin);
    }
  }, []);

  const verificationUrl = `${origin}${certificate.certificate_url || `/verify/${certificate.id}`}`;

  return (
    <div className="space-y-3">
      {/* Landscape Print CSS Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: landscape;
            margin: 6mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }
        }
      ` }} />

      {/* Top Action Toolbar - Always Visible at the Top of Screen */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-border bg-card/90 px-3.5 py-2.5 shadow-sm backdrop-blur print:hidden">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-[#997A15]/40 text-[#997A15] font-semibold text-xs py-0.5">
            Landscape Diploma
          </Badge>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Official verifiable KK Wagh Sports credential
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="gap-1.5 border-[#997A15]/40 text-foreground hover:bg-[#997A15]/10 hover:text-[#997A15]"
          >
            <Printer className="h-4 w-4 text-[#997A15]" />
            <span>Print</span>
          </Button>
          <Button
            onClick={handleSavePdf}
            size="sm"
            className="gap-1.5 bg-[#997A15] hover:bg-[#80640F] text-white shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Save as PDF</span>
          </Button>
        </div>
      </div>

      {/* Printable Certificate Frame - Landscape Orientation with Optimized Height */}
      <div
        id={`certificate-${certificate.id}`}
        className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border-[8px] sm:border-[10px] border-[#997A15] bg-[#FDFBF7] p-4 sm:p-6 lg:p-7 text-[#1F2937] shadow-xl transition-all dark:bg-[#14120F] dark:text-[#F3F4F6] print:m-0 print:max-w-none print:w-full print:border-[10px] print:border-[#997A15] print:p-6 print:shadow-none print:bg-[#FDFBF7]"
        style={{
          boxShadow: "0 15px 40px rgba(153, 122, 21, 0.16), 0 0 0 2px #C5A059",
        }}
      >
        {/* Layer 1: Inset Guilloché Decorative Borders */}
        <div className="pointer-events-none absolute inset-2 rounded-xl border-2 border-[#997A15]/50" />
        <div className="pointer-events-none absolute inset-3.5 rounded-lg border border-dashed border-[#C5A059]/40" />

        {/* Layer 2: Ornate Corner Rosettes / Flourishes */}
        {/* Top-Left */}
        <div className="pointer-events-none absolute left-3.5 top-3.5 h-8 w-8 border-l-[3px] border-t-[3px] border-[#997A15]" />
        <div className="pointer-events-none absolute left-4.5 top-4.5 h-1.5 w-1.5 rotate-45 bg-[#997A15]" />

        {/* Top-Right */}
        <div className="pointer-events-none absolute right-3.5 top-3.5 h-8 w-8 border-r-[3px] border-t-[3px] border-[#997A15]" />
        <div className="pointer-events-none absolute right-4.5 top-4.5 h-1.5 w-1.5 rotate-45 bg-[#997A15]" />

        {/* Bottom-Left */}
        <div className="pointer-events-none absolute bottom-3.5 left-3.5 h-8 w-8 border-b-[3px] border-l-[3px] border-[#997A15]" />
        <div className="pointer-events-none absolute bottom-4.5 left-4.5 h-1.5 w-1.5 rotate-45 bg-[#997A15]" />

        {/* Bottom-Right */}
        <div className="pointer-events-none absolute bottom-3.5 right-3.5 h-8 w-8 border-b-[3px] border-r-[3px] border-[#997A15]" />
        <div className="pointer-events-none absolute bottom-4.5 right-4.5 h-1.5 w-1.5 rotate-45 bg-[#997A15]" />

        {/* Security Watermark Emblem (Translucent in Background) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kk-wagh-logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-52 sm:h-64 w-auto opacity-[0.035] grayscale filter dark:opacity-[0.05] select-none"
        />

        {/* Certificate Content Container - Compact Landscape Flow */}
        <div className="relative z-10 space-y-3 sm:space-y-3.5 text-center">
          {/* Header Block: Official KK Wagh Logo & Title */}
          <div className="space-y-1">
            <div className="mx-auto flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kk-wagh-logo.png"
                alt="K. K. Wagh Education Society Logo"
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain drop-shadow-sm print:h-16"
              />
            </div>

            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#997A15] dark:text-[#D4AF37]">
              K. K. Wagh Education Society&apos;s
            </p>
            <h2 className="font-serif text-base sm:text-lg lg:text-xl font-extrabold uppercase tracking-wide text-foreground print:text-xl">
              K. K. Wagh Institute of Engineering Education &amp; Research
            </h2>
            <p className="text-[9px] sm:text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Autonomous Institute • Affiliated to SPPU • Accredited by NAAC &apos;A&apos; Grade
            </p>
            <div>
              <span className="inline-block border-y border-[#997A15]/40 px-5 py-0.5 font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#997A15] dark:text-[#D4AF37]">
                Department of Physical Education &amp; Sports
              </span>
            </div>
          </div>

          {/* Golden Filigree Divider */}
          <div className="mx-auto flex max-w-xs items-center justify-center gap-2">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#997A15] to-transparent" />
            <span className="text-[10px] text-[#997A15]">✦ ✦ ✦</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#997A15] to-transparent" />
          </div>

          {/* Certificate Main Title & Subtitle Badge */}
          <div className="space-y-1">
            <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-black tracking-wider text-foreground print:text-2xl">
              {styleConfig.title}
            </h3>
            <div>
              <span
                className={`inline-block rounded-full border px-4 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest ${styleConfig.badgeBg}`}
              >
                {styleConfig.subtitle}
              </span>
            </div>
          </div>

          {/* Recipient Presentation Block */}
          <div className="space-y-0.5">
            <p className="font-serif text-xs sm:text-sm italic text-muted-foreground">
              This certificate of honor is proudly presented to
            </p>
            <h4 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground print:text-3xl">
              {playerName}
            </h4>
            <div className="mx-auto h-[1.5px] w-36 sm:w-48 bg-gradient-to-r from-transparent via-[#997A15] to-transparent" />
            <p className="text-[11px] sm:text-xs font-medium text-muted-foreground pt-0.5">
              PRN / Roll No: <span className="font-mono font-bold text-foreground">{rollNumber}</span> •{" "}
              Department of <span className="font-bold text-foreground">{department}</span>
              {teamName && (
                <>
                  {" "}• Squad: <span className="font-bold text-foreground">{teamName}</span>
                </>
              )}
            </p>
          </div>

          {/* Citation Paragraph */}
          <p className="mx-auto max-w-3xl font-serif text-xs sm:text-sm leading-relaxed text-muted-foreground print:text-xs">
            in recognition of exemplary sporting conduct, team spirit, and commendable athletic performance in{" "}
            <span className="font-bold text-foreground">{tournamentName}</span> (
            <span className="font-semibold text-primary">{sportName}</span>) organized at the K. K. Wagh
            Sports Complex, Nashik.
          </p>

          {/* Bottom Verification, Rosette Seal & Signatures Bar */}
          <div className="grid grid-cols-3 items-end gap-2 sm:gap-4 border-t border-[#997A15]/30 pt-3 sm:pt-4 mt-2 sm:mt-3">
            {/* Left: Issue Date & Verification QR Code */}
            <div className="flex flex-col items-start text-left space-y-1">
              <div className="flex items-center gap-2">
                <div className="rounded-md border border-[#997A15]/40 bg-white p-1 shadow-sm">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={40}
                    level="M"
                    fgColor="#1F2937"
                  />
                </div>
                <div className="text-[9px] sm:text-[10px] space-y-0.5">
                  <p className="font-bold uppercase tracking-wider text-[#997A15] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>Verified</span>
                  </p>
                  <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase">
                    ID: {certificate.id.slice(0, 10)}
                  </p>
                  <p className="text-muted-foreground hidden sm:block">Scan to Authenticate</p>
                </div>
              </div>
              <div className="text-[10px] sm:text-xs">
                <p className="font-mono font-bold text-foreground">
                  {formatDate(certificate.issued_date)}
                </p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">
                  Date of Issue
                </p>
              </div>
            </div>

            {/* Center: Official Embossed Gold Rosette Seal */}
            <div className="flex flex-col items-center justify-center">
              <div
                className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 p-0.5 shadow-md ring-2 sm:ring-4 ring-[#997A15]/30 print:shadow-none"
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-dashed border-amber-900/40 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 p-1 text-center text-amber-950 shadow-inner">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-950" />
                  <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-tighter leading-tight mt-0.5">
                    OFFICIAL SEAL
                  </span>
                  <span className="text-[4.5px] sm:text-[5.5px] font-bold uppercase tracking-widest text-amber-950/80">
                    KKWIEER SPORTS
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Official Signatures (Side-by-side to save vertical height) */}
            <div className="flex items-end justify-end gap-3 sm:gap-6">
              <div className="text-center">
                <p className="font-serif text-[11px] sm:text-xs lg:text-sm font-bold italic text-foreground tracking-wide">
                  Dr. S. R. Patil
                </p>
                <div className="my-0.5 h-px w-16 sm:w-24 bg-[#997A15]/50 mx-auto" />
                <p className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Director of Sports
                </p>
              </div>

              <div className="text-center">
                <p className="font-serif text-[11px] sm:text-xs lg:text-sm font-bold italic text-foreground tracking-wide">
                  Dr. K. N. Nandurkar
                </p>
                <div className="my-0.5 h-px w-16 sm:w-24 bg-[#997A15]/50 mx-auto" />
                <p className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Principal, KKWIEER
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
