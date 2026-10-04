import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants/config";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container max-w-7xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-sm">
                PO
              </span>
              <span className="text-lg font-bold text-foreground">PlayOps</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              The official digital sports management and tournament ecosystem for{" "}
              {APP_CONFIG.institution}. Real-time scores, team registration, and athletic analytics.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/tournaments" className="hover:text-foreground transition-colors">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-foreground transition-colors">
                  Live Match Center
                </Link>
              </li>
              <li>
                <Link href="/points-table" className="hover:text-foreground transition-colors">
                  Points Table Standings
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-foreground transition-colors">
                  Past Match Results
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Sports Department</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
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
