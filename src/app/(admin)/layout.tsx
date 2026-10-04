import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ShieldCheck, Activity } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/15">
      <Topbar role="admin" title="PlayOps Sports Administration Room" />
      
      {/* Sub-header Institutional Banner */}
      <div className="border-b border-border/40 bg-card/40 px-4 py-2 text-xs backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">
              Department of Physical Education &amp; Athletics
            </span>
            <span className="hidden sm:inline">• K. K. Wagh Institute of Engineering Education &amp; Research</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime Ground Feed Online</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
