import Link from "next/link";
import { Award, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VerifyPageProps {
  params: Promise<{ code: string }>;
}

export default async function VerifyCertificatePage({ params }: VerifyPageProps) {
  const { code } = await params;

  return (
    <div className="container max-w-lg px-4 py-16 sm:py-24">
      <Card className="border-emerald-500/40 shadow-lg text-center">
        <CardHeader className="space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <Badge variant="success" className="mx-auto">
            Authentic Certificate Verified
          </Badge>
          <CardTitle className="text-xl font-bold">
            K. K. Wagh Institute Sports Achievement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-left border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Verification Code</p>
            <p className="font-mono text-sm font-bold text-foreground">{code}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Issued To</p>
            <p className="text-sm font-semibold text-foreground">Atharva Joshi (Computer Dept)</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tournament</p>
            <p className="text-sm font-semibold text-foreground">
              Inter-Department Cricket Premier League 2026
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Award Category</p>
            <p className="text-sm font-semibold text-emerald-600">Winner — Gold Medalist</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Issued Date</p>
            <p className="text-sm text-foreground">22 October 2026</p>
          </div>

          <div className="pt-4 border-t">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Return to Sports Portal</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
