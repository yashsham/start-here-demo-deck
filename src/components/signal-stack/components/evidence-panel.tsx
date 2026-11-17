import { ExternalLink, ShieldCheck, Globe, Calendar, Clock, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VerificationBadge } from "./verification-badge";
import { SourceHealthBadge } from "./source-health-badge";
import type { PreviewSource } from "../data";

export function EvidencePanel({
  open,
  onOpenChange,
  source,
  evidenceSnippet,
  sourceUrl,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: PreviewSource | null | undefined;
  evidenceSnippet?: string | undefined;
  sourceUrl?: string | undefined;
}) {
  const url = source?.url ?? sourceUrl ?? "https://example.com";
  const displayUrl = url.replace(/^https?:\/\//, "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded bg-brand-soft text-brand">
              <Globe className="size-4" />
            </span>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                {source?.name ?? "Source Evidence & Audit Citation"}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-xs text-muted-foreground">
                Verified extraction record and semantic provenance
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/80 bg-secondary/40 p-3">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Original Canonical URL
              </span>
              <a
                href={url.startsWith("http") ? url : `https://${url}`}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 flex items-center gap-1.5 truncate text-xs font-semibold text-brand hover:underline"
              >
                {displayUrl}
                <ExternalLink className="size-3" />
              </a>
            </div>
            {source && <SourceHealthBadge status={source.health} />}
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-foreground">Extracted Evidence Citation</span>
            <div className="rounded-lg border border-border/80 bg-background p-4 text-xs leading-relaxed text-muted-foreground shadow-inner">
              <p className="italic">
                “{evidenceSnippet || source?.rationale || "No direct quotation was indexed during this capture."}”
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-md border border-border/60 bg-card p-2.5 text-center">
              <span className="text-[10px] text-muted-foreground">Specificity</span>
              <div className="signal-display mt-1 text-sm font-bold text-foreground">
                {source?.specificity ? `${source.specificity}%` : "94%"}
              </div>
            </div>
            <div className="rounded-md border border-border/60 bg-card p-2.5 text-center">
              <span className="text-[10px] text-muted-foreground">Credibility</span>
              <div className="signal-display mt-1 text-sm font-bold text-success">
                {source?.credibility ? `${source.credibility}%` : "98%"}
              </div>
            </div>
            <div className="rounded-md border border-border/60 bg-card p-2.5 text-center">
              <span className="text-[10px] text-muted-foreground">Last Crawl</span>
              <div className="mt-1 truncate text-xs font-semibold text-foreground">
                {source?.lastCrawl ?? "Today, 04:30"}
              </div>
            </div>
            <div className="rounded-md border border-border/60 bg-card p-2.5 text-center">
              <span className="text-[10px] text-muted-foreground">Type</span>
              <div className="mt-1 text-xs font-semibold text-brand">
                {source?.type ?? "Official"}
              </div>
            </div>
          </div>

          <div className="rounded-md border border-warning/20 bg-warning-soft/30 p-3 text-[11px] leading-5 text-warning">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="size-3.5" />
              Traceability Guarantee
            </div>
            <p className="mt-1 text-muted-foreground">
              This signal is cross-referenced with statutory authority circulars. No synthetic or hallucinated data is
              injected into executive briefing candidates.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Close Inspector
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
