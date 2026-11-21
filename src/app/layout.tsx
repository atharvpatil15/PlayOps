import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/lib/constants/config";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: `${APP_CONFIG.name} is the official sports portal and tournament ecosystem for ${APP_CONFIG.institution}.`,
  keywords: [
    "KK Wagh",
    "Sports",
    "Tournaments",
    "Live Score",
    "PlayOps",
    "Athletics",
    "College Sports",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body
        className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
