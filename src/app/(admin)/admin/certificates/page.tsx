import { Award, Plus, Download, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminCertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Digital Certificate Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Batch-generate merit and participation certificates with tamper-proof QR verification codes.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Batch Generate Certificates</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Recent Issued Certificates</CardTitle>
          <CardDescription>All issued college certificates are publicly verifiable</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-semibold text-sm">Atharva Joshi • Winner Gold Medalist</p>
              <p className="text-xs text-muted-foreground">Inter-Dept Cricket Premier League 2026 • Issued 22 Oct</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">KKW-CRK-2026-WIN-001</Badge>
              <Button size="sm" variant="ghost">Download</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
