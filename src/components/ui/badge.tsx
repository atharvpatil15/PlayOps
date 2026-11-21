import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring border",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary/10 text-primary",
        secondary:
          "border-border bg-muted text-muted-foreground",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive",
        outline: "border-border text-foreground bg-transparent",
        success:
          "border-emerald-600/20 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
        warning:
          "border-amber-600/20 bg-amber-600/10 text-amber-800 dark:text-amber-400",
        live: "border-red-600/30 bg-red-600/10 text-red-600 dark:text-red-400 font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
