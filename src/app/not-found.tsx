import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-5 text-primary">
        <Trophy className="h-10 w-10" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-foreground">Match or Page Not Found</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The sports tournament, match, or player page you are looking for does not exist or has been
        moved.
      </p>
      <div className="mt-6">
        <Button asChild className="flex items-center gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portal</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
