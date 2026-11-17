import { Globe, ExternalLink, Eye, Check, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceHealthBadge } from "./source-health-badge";
import type { PreviewSource, Category } from "../data";

const categoryPillStyles: Record<Category, string> = {
  Customers: "bg-cyan-soft text-cyan",
  Competitors: "bg-brand-soft text-brand",
  Market: "bg-warning-soft text-warning",
  Internal: "bg-success-soft text-success",
};

export function SourceCard({
  source,
  onApprove,
  onReject,
  onInspect,
}: {
  source: PreviewSource;
  onApprove: (source: PreviewSource) => void;
  onReject: (source: PreviewSource) => void;
  onInspect: (source: PreviewSource) => void;
}) {
  const isApproved = source.status === "Approved";
  const isRejected = source.status === "Rejected";

  return (
    <article className="signal-panel signal-panel-hover flex flex-col justify-between p-4 sm:p-5 transition-all duration-200">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground">
              <Globe className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="truncate text-xs font-bold text-foreground sm:text-sm">{source.name}</h3>
                {source.isDuplicate && (
                  <Badge variant="destructive" className="h-4 px-1 text-[9px]">
                    Duplicate
                  </Badge>
                )}
              </div>
              <a
                href={source.url.startsWith("internal") ? undefined : `https://${source.url}`}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 truncate text-[11px] font-medium text-brand hover:underline"
              >
                {source.url}
                {!source.url.startsWith("internal") && <ExternalLink className="size-3" />}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Badge
              variant="secondary"
              className={`rounded-md border-0 px-2 py-0.5 text-[10px] font-bold ${categoryPillStyles[source.category]}`}
            >
              {source.category}
            </Badge>
            <SourceHealthBadge status={source.health} />
          </div>
        </div>

        <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {source.rationale}
        </p>

        {source.coverageTopic && (
          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground/80">Coverage:</span>
            <span className="truncate">{source.coverageTopic}</span>
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-secondary/50 p-2.5 text-center text-xs">
          <div>
            <span className="block text-[10px] text-muted-foreground">Specificity</span>
            <span className="signal-display mt-0.5 block font-bold text-foreground">
              {source.specificity}%
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-muted-foreground">Credibility</span>
            <span className="signal-display mt-0.5 block font-bold text-success">
              {source.credibility}%
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-muted-foreground">Last Checked</span>
            <span className="mt-0.5 block truncate text-[10px] font-medium text-muted-foreground">
              {source.recency}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onInspect(source)}
          className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Eye className="size-3.5" />
          <span>Inspect</span>
        </Button>

        <div className="flex items-center gap-1.5">
          <Button
            variant={isRejected ? "destructive" : "outline"}
            size="sm"
            onClick={() => onReject(source)}
            className="h-8 gap-1 px-2.5 text-xs"
          >
            <X className="size-3" />
            <span>{isRejected ? "Rejected" : "Reject"}</span>
          </Button>
          <Button
            variant={isApproved ? "default" : "secondary"}
            size="sm"
            onClick={() => onApprove(source)}
            className="h-8 gap-1 px-2.5 text-xs font-semibold"
          >
            <Check className="size-3" />
            <span>{isApproved ? "Approved" : "Approve"}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
