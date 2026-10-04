import { User, QrCode, Shield, Phone, Mail, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PlayerProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Player Profile & Digital Pass
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details, physical attributes, and official college sports ID.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pass Card */}
        <Card className="md:col-span-1 text-center bg-gradient-to-b from-card to-muted/30">
          <CardHeader>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl mb-2">
              AJ
            </div>
            <CardTitle className="text-xl font-bold">Atharva Joshi</CardTitle>
            <CardDescription>PRN: 202301048821</CardDescription>
            <Badge variant="default" className="mx-auto mt-1">
              Active Athlete
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-white p-3 shadow-inner">
              <div className="flex h-32 w-32 mx-auto items-center justify-center font-mono text-[11px] text-slate-800">
                [QR: PLAYOPS-7F3A29B]
              </div>
            </div>
            <p className="font-mono text-xs text-muted-foreground">PLAYOPS-7F3A29B</p>
            <Button size="sm" variant="outline" className="w-full">
              Print Sports ID Pass
            </Button>
          </CardContent>
        </Card>

        {/* Academic & Athletic Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Athletic Attributes & Records</CardTitle>
            <CardDescription>Academic department and sports medical profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-muted/40 p-3 border">
                <span className="text-xs text-muted-foreground">Department</span>
                <p className="font-semibold text-foreground mt-0.5">Computer Engineering</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border">
                <span className="text-xs text-muted-foreground">Academic Year</span>
                <p className="font-semibold text-foreground mt-0.5">Third Year (TE)</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border">
                <span className="text-xs text-muted-foreground">Blood Group</span>
                <p className="font-semibold text-foreground mt-0.5">O+ Positive</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border">
                <span className="text-xs text-muted-foreground">Height / Weight</span>
                <p className="font-semibold text-foreground mt-0.5">178 cm / 68 kg</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Registered Sports
              </span>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">🏏 Cricket (Batsman)</Badge>
                <Badge variant="outline">🏸 Badminton (Singles)</Badge>
                <Badge variant="outline">⚽ Football (Midfielder)</Badge>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t text-sm">
              <span className="text-xs font-semibold text-muted-foreground">Emergency Contact</span>
              <p className="text-foreground font-mono">+91 98230 11223 (Father)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
