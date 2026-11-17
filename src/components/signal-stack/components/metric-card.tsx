import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone?: "brand" | "cyan" | "warning" | "success" | "danger";
  trend?: string;
  trendDirection?: "up" | "down";
  action?: ReactNode;
  className?: string;
}

const toneStyles = {
  brand: "bg-brand-soft text-brand",
  cyan: "bg-cyan-soft text-cyan",
  warning: "bg-warning-soft text-warning",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
};

export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "brand",
  trend,
  trendDirection = "up",
  action,
  className = "",
}: MetricCardProps) {
  return (
    <article
      className={`signal-panel signal-panel-hover flex flex-col justify-between p-4 sm:p-5 transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        <span className={`grid size-8 shrink-0 place-items-center rounded-md ${toneStyles[tone]}`}>
          <Icon className="size-4" />
        </span>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="signal-display text-[28px] font-bold tracking-tight tabular-nums text-foreground">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
              trendDirection === "up" ? "text-success" : "text-danger"
            }`}
          >
            {trendDirection === "up" ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-[11px] text-muted-foreground">
        <span className="truncate">{description}</span>
        {action}
      </div>
    </article>
  );
}
