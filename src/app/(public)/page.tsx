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
  ChevronRight,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { SUPPORTED_SPORTS } from "@/lib/constants/sport";
import { ROUTES } from "@/lib/constants/routes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getMatches } from "@/actions/matches";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  HeroMatchScoreCard,
  ScoreboardMatch,
} from "@/components/home/hero-match-score-card";

export default async function HomePage() {
  const admin = createAdminClient();

  const [
    liveRes,
    pastRes,
    { count: tournamentsCount },
    { count: playersCount },
    { count: sportsCount },
    { count: venuesCount },
  ] = await Promise.all([
    getMatches({ status: "live" }),
    getMatches({ status: "completed", sortOrder: "desc", limit: 5 }),
    admin.from("tournaments").select("*", { count: "exact", head: true }),
    admin.from("players").select("*", { count: "exact", head: true }),
    admin.from("sports").select("*", { count: "exact", head: true }),
    admin.from("venues").select("*", { count: "exact", head: true }),
  ]);

  const liveMatches = (liveRes?.data as unknown as ScoreboardMatch[]) || [];
  const pastMatches = (pastRes?.data as unknown as ScoreboardMatch[]) || [];

  const stats = [
    {
      index: "01",
      label: "Active Tournaments",
      value: String(tournamentsCount ?? 0),
      icon: Trophy,
    },
    {
      index: "02",
      label: "Registered Athletes",
      value: String(playersCount ?? 0),
      icon: Users,
    },
    {
      index: "03",
      label: "Sports Offered",
      value: String(sportsCount ?? 10),
      icon: Flame,
    },
    {
      index: "04",
      label: "Campus Venues",
      value: `${venuesCount ?? 6} Grounds`,
      icon: Calendar,
    },
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
      title: "Verifiable Certificates",
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
    <div className="flex w-full flex-col">
      {/* Editorial Announcement Bar */}
      <div className="border-b border-border bg-muted/40 py-2.5 px-4 text-xs">
        <div className="container mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">KKWIEER Athletics</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground hidden sm:inline">
              Official Tournament Ecosystem &amp; Digital Sports Pass Registry
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Realtime Broadcast Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section — Asymmetric Editorial Layout */}
      <section className="border-b border-border bg-background py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content Column */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>KK Wagh Institute of Engineering Education &amp; Research</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.12]">
                The Official Digital Sports Arena for{" "}
                <span className="text-primary italic">KK Wagh</span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
                PlayOps centralizes college athletic tournaments, real-time ground commentary, team
                registrations, and performance analytics into a single high-performance portal.
              </p>

              {/* Primary & Secondary Actions — Single Intentional Accent */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button asChild size="lg" variant="default">
                  <Link href={ROUTES.REGISTER}>
                    Get Your Sports Pass
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={ROUTES.LIVE}>
                    <Radio className="mr-2 h-4 w-4 text-red-500" />
                    Live Match Center
                  </Link>
                </Button>
              </div>

              {/* Subtle Trust Indicators */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>Verified Rosters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>Realtime Broadcast</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>Automated Brackets</span>
                </div>
              </div>
            </div>

            {/* Right Column: Integrated Scoreboard Card */}
            <div className="lg:col-span-5">
              <HeroMatchScoreCard
                initialLiveMatches={liveMatches}
                initialPastMatches={pastMatches}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section — Clean Metric Bar */}
      <section className="border-b border-border bg-card py-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <span className="font-mono text-xs text-muted-foreground">
                  {stat.index}
                </span>
                <div className="font-serif text-3xl sm:text-4xl font-normal text-foreground tabular-nums">
                  {stat.value}
                </div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sports Catalog — Controlled Asymmetric Pacing */}
      <section className="bg-background py-16 md:py-20 border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Athletic Disciplines
              </span>
              <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-normal text-foreground">
                Inter-Department &amp; University Sports
              </h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                Explore supported athletic competitions hosted across KK Wagh campus facilities.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.TOURNAMENTS} className="flex items-center gap-1">
                <span>View Tournaments</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {SUPPORTED_SPORTS.map((sport) => (
                <CarouselItem
                  key={sport.name}
                  className="basis-1/2 pl-3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <Card className="h-full border border-border bg-card p-5 transition-colors duration-150 hover:border-foreground/40">
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="capitalize">{sport.type}</span>
                        <span className="font-mono text-[11px]">{sport.minPlayers}-{sport.maxPlayers}P</span>
                      </div>

                      <div className="my-6 text-center">
                        <span className="text-4xl block mb-3">
                          {sport.icon}
                        </span>
                        <h3 className="font-serif text-lg font-medium text-foreground">
                          {sport.name}
                        </h3>
                      </div>

                      <div className="border-t border-border pt-3 text-center">
                        <span className="text-xs text-primary font-medium hover:underline">
                          View Fixtures ❯
                        </span>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex justify-end gap-2">
              <CarouselPrevious className="relative inset-auto h-8 w-8 translate-y-0 rounded border border-border bg-background hover:bg-muted" />
              <CarouselNext className="relative inset-auto h-8 w-8 translate-y-0 rounded border border-border bg-background hover:bg-muted" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Feature Section — Breaking the 3-Column AI Template Look */}
      <section className="bg-muted/30 py-16 md:py-24 border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column: Editorial Section Anchor */}
            <div className="space-y-4 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <Badge variant="outline" className="text-xs uppercase font-medium">
                Enterprise Architecture
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground leading-tight">
                Built for Speed, Reliability &amp; Sportsmanship
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Everything needed to orchestrate college tournaments from opening whistles to trophy
                ceremonies.
              </p>

              <div className="pt-4 border-t border-border/80">
                <div className="text-xs text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">Campus Engineering Standards</p>
                  <p>Engineered for low ground latency, high concurrency during championship finals, and cryptographic pass validation.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Asymmetric Staggered List (No cookie-cutter 3-column grid) */}
            <div className="lg:col-span-8">
              <div className="divide-y divide-border rounded-lg border border-border bg-card">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  const itemIndex = String(idx + 1).padStart(2, "0");

                  return (
                    <div
                      key={feature.title}
                      className="flex flex-col sm:flex-row items-start gap-4 p-6 transition-colors duration-150 hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-xs text-muted-foreground w-6">
                          {itemIndex}
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-muted/50 text-foreground">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-1">
                        <h3 className="font-serif text-lg font-medium text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section — Asymmetrical 2-Column Editorial Structure */}
      <section className="bg-background py-16 md:py-24 border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Inquiries &amp; Rules
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Got questions about PlayOps or tournaments? We&apos;ve got answers.
              </p>
            </div>

            <div className="lg:col-span-8">
              <Accordion type="single" collapsible className="w-full divide-y divide-border rounded-lg border border-border bg-card">
                <AccordionItem value="item-1" className="border-none px-6 py-1">
                  <AccordionTrigger className="text-left font-serif text-base sm:text-lg font-medium text-foreground hover:text-primary py-4 hover:no-underline">
                    How do I get a Digital Sports Pass?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4">
                    Click on the &quot;Get Your Sports Pass&quot; button in the hero section and register with
                    your college email. You will instantly receive a QR-based digital pass on your
                    dashboard.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-none px-6 py-1">
                  <AccordionTrigger className="text-left font-serif text-base sm:text-lg font-medium text-foreground hover:text-primary py-4 hover:no-underline">
                    Can I register a team for a tournament?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4">
                    Yes! If you are a team captain, you can create a team from your dashboard and invite
                    registered players from your department using their email addresses.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-none px-6 py-1">
                  <AccordionTrigger className="text-left font-serif text-base sm:text-lg font-medium text-foreground hover:text-primary py-4 hover:no-underline">
                    How does live scoring work?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4">
                    Our sports coordinators update the scores directly from the grounds using the admin
                    panel. These scores are broadcasted instantly to the Live Match Center using
                    WebSockets.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border-none px-6 py-1">
                  <AccordionTrigger className="text-left font-serif text-base sm:text-lg font-medium text-foreground hover:text-primary py-4 hover:no-underline">
                    Are the certificates verifiable?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4">
                    Absolutely. Every certificate issued via PlayOps contains a unique cryptographic QR
                    code that anyone can scan to verify its authenticity.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — Restrained, Quiet Editorial Callout */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-8">
          <div className="rounded-lg border border-border bg-card p-8 sm:p-12 text-center space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
              Ready to Represent Your Department?
            </h2>

            <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              Register your player profile today to obtain your digital KK Wagh Sports Pass, join
              your department team, and compete in upcoming championships.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button asChild size="lg" variant="default">
                <Link href={ROUTES.REGISTER}>Register as Player</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={ROUTES.TOURNAMENTS}>Browse Tournaments</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
