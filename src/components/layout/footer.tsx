import Link from "next/link";
import Image from "next/image";
import { APP_CONFIG } from "@/lib/constants/config";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container max-w-7xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/kk-wagh-logo.png"
                alt="K. K. Wagh Education Society"
                width={280}
                height={80}
                className="h-14 sm:h-16 w-auto object-contain dark:brightness-0 dark:invert transition-all"
              />
            </Link>
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-lg font-bold font-serif text-foreground">PlayOps Athletic Ecosystem</span>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              The official digital sports management and tournament ecosystem for{" "}
              {APP_CONFIG.institution}. Real-time scores, team registration, and athletic analytics.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/tournaments" className="transition-colors hover:text-foreground">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/live" className="transition-colors hover:text-foreground">
                  Live Match Center
                </Link>
              </li>
              <li>
                <Link href="/points-table" className="transition-colors hover:text-foreground">
                  Points Table Standings
                </Link>
              </li>
              <li>
                <Link href="/results" className="transition-colors hover:text-foreground">
                  Past Match Results
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="transition-colors hover:text-foreground">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Sports Department</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sports Complex, K. K. Wagh Campus, Hirabai Haridas Vidyanagari, Amrutdham, Panchavati,
              Nashik, Maharashtra 422003
            </p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PlayOps — K. K. Wagh Institute of Engineering Education &
          Research. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
