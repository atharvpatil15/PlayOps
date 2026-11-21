import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border border-border bg-card transition-colors duration-150 hover:border-foreground/30", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-baseline space-x-2">
          <div className="font-serif text-3xl font-medium text-foreground tabular-nums">{value}</div>
          {trend && (
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {trend}
            </span>
          )}
        </div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
