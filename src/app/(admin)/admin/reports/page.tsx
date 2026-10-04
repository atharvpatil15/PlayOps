import { FileText, Download, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  const reports = [
    { title: "Annual Sports Participation Report 2025-26", desc: "Department-wise student athlete count and athletic diversity", format: "PDF • 2.4 MB" },
    { title: "Cricket Premier League 2026 Financial & Logistics", desc: "Equipment expenditures, referee charges, and prize distribution", format: "Excel • 1.1 MB" },
    { title: "Ground & Facility Utilization Summary", desc: "Court booking hours, maintenance logs, and capacity utilization", format: "PDF • 850 KB" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Reports & Analytics Export
          </h1>
          <p className="text-sm text-muted-foreground">
            Generate and export institutional NAAC/NBA compliant sports analytics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((r) => (
          <Card key={r.title} className="flex flex-col justify-between">
            <CardHeader>
              <div className="rounded-lg bg-primary/10 p-2 text-primary w-fit mb-2">
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">{r.title}</CardTitle>
              <CardDescription>{r.desc}</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{r.format}</span>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
