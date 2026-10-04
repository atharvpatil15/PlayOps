import Link from "next/link";
import {
  Trophy,
  Activity,
  QrCode,
  Award,
  Users,
  Calendar,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUPPORTED_SPORTS } from "@/lib/constants/sport";
import { ROUTES } from "@/lib/constants/routes";

export default function HomePage() {
  const stats = [
    { label: "Active Tournaments", value: "8+", icon: Trophy },
    { label: "Student Athletes", value: "1,200+", icon: Users },
    { label: "Sports Offered", value: "10+", icon: Flame },
    { label: "Campus Venues", value: "6 Grounds", icon: Calendar },
  ];

  const features = [
    {
      title: "Real-time Live Scoring",
      description:
        "Instant ball-by-ball, goal, and point updates directly from the ground via WebSocket broadcast.",
      icon: Activity,
    },
    {
      title: "Digital QR Sports Pass",
      description:
        "Every student receives a tamper-proof digital sports ID with QR verification for rapid attendance.",
      icon: QrCode,
    },
    {
      title: "Automated Points Engine",
      description:
        "Instant standings, net run rates, and goal differentials recalculated the second matches conclude.",
      icon: Trophy,
    },
    {
      title: "Verifiable PDF Certificates",
      description:
        "Cryptographically verifiable merit and participation certificates with direct QR scan validation.",
      icon: Award,
    },
    {
      title: "Team & Roster Governance",
      description:
        "Captains register squads with automated department eligibility, jersey numbers, and roll verification.",
      icon: Users,
    },
    {
      title: "Multi-Role Administration",
      description:
        "Dedicated control room for sports coordinators to schedule fixtures, approve teams, and publish reports.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
        <div className="container max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>K. K. Wagh Institute of Engineering Education & Research</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl sm:leading-[1.15]">
              The Official Digital Sports Arena for{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                KK Wagh
              </span>
            </h1>

            <p className="text-base text-muted-foreground sm:text-xl leading-relaxed">
              PlayOps centralizes college athletic tournaments, real-time ground commentary, team
              registrations, and performance analytics into a single high-performance portal.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full justify-center">
              <Button asChild size="lg" className="gap-2 shadow-md">
                <Link href={ROUTES.REGISTER}>
                  <span>Get Your Digital Sports Pass</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={ROUTES.LIVE}>
                  <Flame className="mr-2 h-4 w-4 text-red-500" />
                  <span>Live Match Center</span>
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Verified Department Rosters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Instant Realtime Broadcast</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Automated Fixtures & Bracket</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-10 border-b border-border/40 bg-card">
        <div className="container max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center p-4 text-center rounded-xl bg-muted/40 border"
                >
                  <Icon className="h-6 w-6 text-primary mb-2" />
                  <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Sports Catalog */}
      <section className="py-16 md:py-20">
        <div className="container max-w-7xl px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-2">
                Sports Catalog
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Inter-Department & University Sports
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Explore supported athletic competitions hosted across KK Wagh campus facilities.
              </p>
            </div>
            <Button asChild variant="ghost" className="gap-1.5 self-start sm:self-auto">
              <Link href={ROUTES.TOURNAMENTS}>
                <span>View Tournaments</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {SUPPORTED_SPORTS.map((sport) => (
              <div
                key={sport.name}
                className="group flex flex-col items-center justify-center p-5 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all text-center"
              >
                <span className="text-3xl mb-2 transition-transform group-hover:scale-110">
                  {sport.icon}
                </span>
                <h3 className="font-semibold text-sm text-foreground">{sport.name}</h3>
                <span className="text-xs text-muted-foreground capitalize mt-0.5">
                  {sport.type} • {sport.minPlayers}-{sport.maxPlayers} Players
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 md:py-20 bg-muted/20 border-y border-border/40">
        <div className="container max-w-7xl px-4 sm:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="outline">Enterprise Architecture</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Built for Speed, Reliability & Sportsmanship
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything needed to orchestrate college tournaments from opening whistles to trophy
              ceremonies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="bg-card">
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container max-w-5xl px-4 sm:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-primary p-8 md:p-12 text-center text-white space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Represent Your Department?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
              Register your player profile today to obtain your digital KK Wagh Sports Pass, join
              your department team, and compete in upcoming championships.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100 font-bold">
                <Link href={ROUTES.REGISTER}>Register as Player</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
              >
                <Link href={ROUTES.TOURNAMENTS}>Browse Tournaments</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
