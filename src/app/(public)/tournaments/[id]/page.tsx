import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, Calendar, Users, MapPin, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils/format";

interface TournamentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TournamentDetailPage({ params }: TournamentDetailPageProps) {
  const { id } = await params;

  return (
    <div className="container max-w-7xl px-4 py-8 sm:px-8 space-y-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/tournaments" className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tournaments</span>
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="success">Ongoing</Badge>
              <Badge variant="outline">Knockout</Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              KK Wagh Inter-Department Cricket Premier League 2026
            </h1>
            <p className="text-sm text-muted-foreground">
              Official annual college cricket tournament for BE, TE, SE, and FE departments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="lg">
              <Link href="/register">Register Team Squad</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Sport</p>
          <p className="text-lg font-bold text-foreground flex items-center gap-1.5 mt-1">
            <span>🏏</span>
            <span>Cricket</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Dates</p>
          <p className="text-sm font-bold text-foreground mt-1">15 Oct – 22 Oct 2026</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Ground Venue</p>
          <p className="text-sm font-bold text-foreground mt-1">Main Cricket Ground</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Registered Teams</p>
          <p className="text-sm font-bold text-foreground mt-1">8 / 12 Teams</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="schedule">Matches</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4 pt-4">
          <div className="rounded-xl border p-4 bg-card">
            <h3 className="font-bold text-base mb-3">Upcoming Matches</h3>
            <p className="text-sm text-muted-foreground">
              Match schedule will be released once registration closes on 10 Oct 2026.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4 pt-4">
          <div className="rounded-xl border p-4 bg-card">
            <h3 className="font-bold text-base mb-3">Approved Teams</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold">Computer Strikers (Comp Dept)</span>
                <Badge variant="outline">Approved</Badge>
              </li>
              <li className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold">IT Blasters (IT Dept)</span>
                <Badge variant="outline">Approved</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-semibold">Mech Warriors (Mechanical Dept)</span>
                <Badge variant="outline">Approved</Badge>
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4 pt-4">
          <div className="rounded-xl border p-6 bg-card space-y-3">
            <h3 className="font-bold text-base">Rules & Eligibility</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
              <li>All players must be active bonafide students of KK Wagh.</li>
              <li>Every player must possess a verified PlayOps digital sports QR code.</li>
              <li>Matches consist of 20 overs per innings.</li>
              <li>Umpire decisions are final.</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
