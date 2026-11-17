import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export type HealthStatus = "Healthy" | "Review" | "New" | "Stale" | "Approved" | "Pending" | "Rejected";

const healthStyles: Record<HealthStatus, { bg: string; text: string; dot: string }> = {
  Healthy: { bg: "bg-success-soft", text: "text-success", dot: "bg-success" },
  Approved: { bg: "bg-success-soft", text: "text-success", dot: "bg-success" },
  Review: { bg: "bg-warning-soft", text: "text-warning", dot: "bg-warning" },
  Pending: { bg: "bg-warning-soft", text: "text-warning", dot: "bg-warning" },
  New: { bg: "bg-cyan-soft", text: "text-cyan", dot: "bg-cyan" },
  Stale: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  Rejected: { bg: "bg-danger-soft", text: "text-danger", dot: "bg-danger" },
};

export function SourceHealthBadge({
  status,
  label,
  className = "",
}: {
  status: HealthStatus;
  label?: ReactNode;
  className?: string;
}) {
  const config = healthStyles[status] || healthStyles.New;
  return (
    <Badge
      variant="secondary"
      className={`inline-flex items-center gap-1.5 rounded-md border-0 px-2 py-0.5 text-[11px] font-semibold ${config.bg} ${config.text} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      <span>{label ?? status}</span>
    </Badge>
  );
}
