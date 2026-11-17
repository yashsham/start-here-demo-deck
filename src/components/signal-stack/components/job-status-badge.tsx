import { Badge } from "@/components/ui/badge";

export type JobStatus = "Processing" | "Queued" | "Completed" | "Failed" | "Retrying";

const statusConfig: Record<JobStatus, { bg: string; text: string; dot: string; pulse?: boolean }> = {
  Processing: { bg: "bg-cyan-soft", text: "text-cyan", dot: "bg-cyan", pulse: true },
  Queued: { bg: "bg-warning-soft", text: "text-warning", dot: "bg-warning" },
  Completed: { bg: "bg-success-soft", text: "text-success", dot: "bg-success" },
  Failed: { bg: "bg-danger-soft", text: "text-danger", dot: "bg-danger" },
  Retrying: { bg: "bg-warning-soft", text: "text-warning", dot: "bg-warning", pulse: true },
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const config = statusConfig[status] || statusConfig.Queued;
  return (
    <Badge
      variant="secondary"
      className={`inline-flex items-center gap-1.5 rounded-md border-0 px-2 py-0.5 text-[11px] font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot} ${config.pulse ? "animate-pulse" : ""}`} />
      <span>{status}</span>
    </Badge>
  );
}
