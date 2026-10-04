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
  ChevronRight,
  PlayCircle,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-background pb-16 pt-16 md:pb-24 md:pt-24 lg:pt-32">
        <div className="bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] absolute inset-0 bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)] dark:border-b dark:border-slate-100/5 dark:bg-bottom"></div>
        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
            <Badge
              variant="secondary"
              className="border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-primary" />
              KK Wagh Institute of Engineering Education & Research
            </Badge>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl md:leading-[1.1] lg:text-7xl">
              The Official Digital Sports Arena for{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                KK Wagh
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              PlayOps centralizes college athletic tournaments, real-time ground commentary, team
              registrations, and performance analytics into a single high-performance portal.
            </p>

            <div className="flex w-full flex-col justify-center gap-4 pt-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
              >
                <Link href={ROUTES.REGISTER}>
                  Get Your Sports Pass
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 bg-background/50 px-8 text-base backdrop-blur-sm"
              >
                <Link href={ROUTES.LIVE}>
                  <Radio className="mr-2 h-4 w-4 animate-pulse text-red-500" />
                  Live Match Center
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Verified Rosters</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Realtime Broadcast</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Automated Brackets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="border-b border-border/50 bg-muted/30 py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="border-none bg-transparent shadow-none">
                  <CardContent className="flex flex-col items-center justify-center space-y-2 p-6 text-center">
                    <div className="mb-2 rounded-2xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-foreground md:text-4xl">
                      {stat.value}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Sports Catalog */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                Sports Catalog
              </Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Inter-Department & University Sports
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore supported athletic competitions hosted across KK Wagh campus facilities.
              </p>
            </div>
            <Button asChild variant="ghost" className="group">
              <Link href={ROUTES.TOURNAMENTS}>
                View Tournaments
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
            <CarouselContent className="-ml-2 md:-ml-4">
              {SUPPORTED_SPORTS.map((sport) => (
                <CarouselItem
                  key={sport.name}
                  className="basis-1/2 pl-2 md:basis-1/3 md:pl-4 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="p-1">
                    <Card className="group border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                      <CardContent className="flex aspect-square flex-col items-center justify-center p-8 text-center">
                        <span className="mb-4 text-5xl transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                          {sport.icon}
                        </span>
                        <h3 className="mb-1 text-lg font-bold text-foreground">{sport.name}</h3>
                        <Badge
                          variant="secondary"
                          className="mt-2 bg-muted text-xs font-normal capitalize"
                        >
                          {sport.type} • {sport.minPlayers}-{sport.maxPlayers} Players
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mr-4 mt-8 flex justify-end gap-2">
              <CarouselPrevious className="relative inset-auto h-10 w-10 translate-y-0 bg-background hover:bg-muted" />
              <CarouselNext className="relative inset-auto h-10 w-10 translate-y-0 bg-background hover:bg-muted" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="border-y border-border/50 bg-muted/30 py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Enterprise Architecture
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Built for Speed, Reliability & Sportsmanship
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything needed to orchestrate college tournaments from opening whistles to trophy
              ceremonies.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="border-border/50 bg-background/50 backdrop-blur-sm transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto max-w-4xl px-4 sm:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Got questions about PlayOps or tournaments? We&apos;ve got answers.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-border/50">
              <AccordionTrigger className="text-left text-lg font-semibold transition-colors hover:text-primary">
                How do I get a Digital Sports Pass?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                Click on the &quot;Get Your Sports Pass&quot; button in the hero section and register with
                your college email. You will instantly receive a QR-based digital pass on your
                dashboard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-border/50">
              <AccordionTrigger className="text-left text-lg font-semibold transition-colors hover:text-primary">
                Can I register a team for a tournament?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                Yes! If you are a team captain, you can create a team from your dashboard and invite
                registered players from your department using their email addresses.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-border/50">
              <AccordionTrigger className="text-left text-lg font-semibold transition-colors hover:text-primary">
                How does live scoring work?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                Our sports coordinators update the scores directly from the grounds using the admin
                panel. These scores are broadcasted instantly to the Live Match Center using
                WebSockets.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-border/50">
              <AccordionTrigger className="text-left text-lg font-semibold transition-colors hover:text-primary">
                Are the certificates verifiable?
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                Absolutely. Every certificate issued via PlayOps contains a unique cryptographic QR
                code that anyone can scan to verify its authenticity.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-background py-20 md:py-28">
        <div className="container mx-auto max-w-5xl px-4 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-center shadow-2xl md:p-16">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-700"></div>

            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                Ready to Represent Your Department?
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-foreground/90 md:text-xl">
                Register your player profile today to obtain your digital KK Wagh Sports Pass, join
                your department team, and compete in upcoming championships.
              </p>
              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-14 bg-white px-8 text-base font-bold text-primary shadow-lg hover:bg-white/90"
                >
                  <Link href={ROUTES.REGISTER}>Register as Player</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 border-white/30 px-8 text-base text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                >
                  <Link href={ROUTES.TOURNAMENTS}>Browse Tournaments</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
