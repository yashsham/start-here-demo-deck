import { FileText, ArrowRight, ExternalLink, AlertTriangle, TrendingUp, HelpCircle, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PreviewSignal, Category } from "../data";

const categoryStyles: Record<Category, string> = {
  Customers: "bg-cyan-soft text-cyan",
  Competitors: "bg-brand-soft text-brand",
  Market: "bg-warning-soft text-warning",
  Internal: "bg-success-soft text-success",
};

const signalTypeStyles = {
  Opportunity: { bg: "bg-success-soft text-success", border: "border-l-success", icon: TrendingUp },
  Threat: { bg: "bg-danger-soft text-danger", border: "border-l-danger", icon: AlertTriangle },
  Neutral: { bg: "bg-muted text-muted-foreground", border: "border-l-muted-foreground", icon: HelpCircle },
};

const urgencyBadgeStyles = {
  High: "bg-danger-soft text-danger border-danger/30",
  Medium: "bg-warning-soft text-warning border-warning/30",
  Low: "bg-secondary text-muted-foreground border-border",
};

export function SignalCard({
  signal,
  onInspectEvidence,
}: {
  signal: PreviewSignal;
  onInspectEvidence?: ((signal: PreviewSignal) => void) | undefined;
}) {
  const typeConfig = signalTypeStyles[signal.type] || signalTypeStyles.Neutral;
  const TypeIcon = typeConfig.icon;

  return (
    <article
      className={`signal-panel signal-panel-hover border-l-4 ${typeConfig.border} p-4 sm:p-5 transition-all duration-200`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="secondary"
            className={`rounded-md border-0 px-2 py-0.5 text-[10px] font-bold ${categoryStyles[signal.category]}`}
          >
            {signal.category}
          </Badge>

          <Badge
            variant="secondary"
            className={`inline-flex items-center gap-1 rounded-md border-0 px-2 py-0.5 text-[10px] font-bold ${typeConfig.bg}`}
          >
            <TypeIcon className="size-3" />
            <span>{signal.type}</span>
          </Badge>

          <Badge
            variant="outline"
            className={`rounded-md px-1.5 py-0.2 text-[10px] font-semibold ${urgencyBadgeStyles[signal.urgency]}`}
          >
            {signal.urgency} Urgency
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {signal.pubDate}
          </span>
          <span className="hidden sm:inline">· Discovered {signal.discoveryDate}</span>
        </div>
      </div>

      <h3 className="signal-display mt-3 text-sm font-bold leading-snug text-foreground sm:text-[15px]">
        {signal.event}
      </h3>

      <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-secondary/50 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Strategic Interpretation · Why It Matters
          </span>
          <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">{signal.why}</p>
        </div>

        <div className="rounded-lg bg-secondary/50 p-3.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Traceable Evidence Citation
            </span>
            <p className="mt-1.5 text-xs italic leading-relaxed text-muted-foreground line-clamp-3">
              “{signal.evidence}”
            </p>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2 text-[11px]">
            <a
              href={signal.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-brand hover:underline truncate max-w-[200px]"
            >
              <FileText className="size-3 shrink-0" />
              <span className="truncate">{signal.source}</span>
              <ExternalLink className="size-2.5 shrink-0" />
            </a>
            {onInspectEvidence && (
              <button
                type="button"
                onClick={() => onInspectEvidence(signal)}
                className="text-[10px] font-semibold text-brand hover:underline"
              >
                Inspect
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-card p-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
              Recommended Action
            </span>
            <span className="text-[10px] text-muted-foreground">({signal.businessArea})</span>
          </div>
          <p className="mt-0.5 text-xs font-medium text-foreground">{signal.recommendedAction}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 border-t border-border/50 pt-2 sm:border-0 sm:pt-0">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <User className="size-3" />
            <span>Owner: <strong className="text-foreground">{signal.actionOwner}</strong></span>
          </div>
        </div>
      </div>
    </article>
  );
}
