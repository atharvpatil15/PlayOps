import Link from "next/link";
import Image from "next/image";
import { APP_CONFIG } from "@/lib/constants/config";
import { MapPin, Trophy, ShieldCheck, Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container max-w-7xl px-4 py-12 md:py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image
                src="/kk-wagh-logo.png"
                alt="K. K. Wagh Education Society"
                width={280}
                height={80}
                className="h-12 sm:h-14 w-auto object-contain dark:brightness-0 dark:invert transition-all"
              />
            </Link>
            <div className="pt-1">
              <span className="font-serif text-lg font-medium text-foreground">
                PlayOps Athletic Ecosystem
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              The official digital sports management and tournament ecosystem for{" "}
              {APP_CONFIG.institution}. Real-time scores, team registration, verifiable digital credentials, and athletic analytics.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
              Competitions &amp; Live
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/tournaments" className="transition-colors hover:text-foreground">
                  Tournaments &amp; Cups
                </Link>
              </li>
              <li>
                <Link href="/live" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
                  <span>Live Match Center</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                </Link>
              </li>
              <li>
                <Link href="/points-table" className="transition-colors hover:text-foreground">
                  Points Table Standings
                </Link>
              </li>
              <li>
                <Link href="/results" className="transition-colors hover:text-foreground">
                  Official Match Archive
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
              Athlete Portals
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/player/profile" className="transition-colors hover:text-foreground">
                  Digital Sports Pass
                </Link>
              </li>
              <li>
                <Link href="/player/team" className="transition-colors hover:text-foreground">
                  Department Squads
                </Link>
              </li>
              <li>
                <Link href="/player/certificates" className="transition-colors hover:text-foreground">
                  Verified Certificates
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="transition-colors hover:text-foreground">
                  Sports Committee Console
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
              Sports Department
            </h4>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                <span>
                  Sports Complex, K. K. Wagh Campus, Hirabai Haridas Vidyanagari, Amrutdham, Panchavati,
                  Nashik, Maharashtra 422003
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} PlayOps — K. K. Wagh Institute of Engineering Education &amp;
            Research. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Realtime Connected</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
