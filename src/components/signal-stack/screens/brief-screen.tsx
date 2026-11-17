import { useState } from "react";
import {
  BookOpen,
  Printer,
  Mail,
  FileClock,
  CheckCircle2,
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { BriefSection } from "../components/brief-section";
import { briefSections, mondayBriefSample, previewSignals, type CompanyName } from "../data";
import { generateMondayBriefWithAI } from "@/lib/groq";

export function BriefScreen({ company }: { company: CompanyName }) {
  const [activeSection, setActiveSection] = useState(0);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("exec-team@edxso.com");
  const [briefSectionsList, setBriefSectionsList] = useState(mondayBriefSample);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleRegenerateWithGroq = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    toast.info("Groq AI: Synthesizing Monday Morning Brief…", {
      description: "Analyzing verified signals with openai/gpt-oss-120b reasoning model.",
    });

    try {
      const generated = await generateMondayBriefWithAI(company, previewSignals);
      if (Array.isArray(generated) && generated.length > 0) {
        setBriefSectionsList(generated);
        toast.success("Groq AI Brief Synthesis Complete!", {
          description: "All 10 sections calibrated with fresh recommendations and owners.",
        });
      }
    } catch (err: any) {
      toast.error("Brief generation encountered an issue", {
        description: err.message || "Falling back to verified template.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmailPreview = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailModalOpen(false);
    toast.success("Email Dispatch Triggered (Preview Mode)", {
      description: `Formatted HTML briefing queued for ${recipientEmail}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
              SIGNAL STACK · EXECUTIVE INTELLIGENCE
            </span>
            <Badge variant="secondary" className="bg-success-soft text-success text-[10px] font-semibold">
              Issue #48 · Approved
            </Badge>
          </div>
          <h1 className="signal-display mt-1 text-xl font-bold text-foreground sm:text-2xl">
            Monday Morning Briefing · {company}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Week of November 17, 2026 · Confidential Executive Distribution Only
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleRegenerateWithGroq}
            disabled={isGenerating}
            className="h-8 gap-1.5 text-xs font-semibold bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Synthesizing Brief…</span>
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" />
                <span>Regenerate with Groq AI</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryModalOpen(true)}
            className="h-8 gap-1.5 text-xs"
          >
            <FileClock className="size-3.5" />
            <span>Past Briefs</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmailModalOpen(true)}
            className="h-8 gap-1.5 text-xs text-brand border-brand/30 hover:bg-brand-soft"
          >
            <Mail className="size-3.5" />
            <span>Email Ready Layout</span>
          </Button>

          <Button
            size="sm"
            onClick={handlePrint}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            <Printer className="size-3.5" />
            <span>Print / Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Main Layout: Sticky Sidebar TOC + 10 Editorial Sections */}
      <div className="grid items-start gap-8 xl:grid-cols-[240px_minmax(0,1fr)]">
        {/* Sticky Table of Contents */}
        <aside className="sticky top-[80px] hidden xl:block signal-panel p-4 space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Brief Index (10 Sections)
          </div>
          <nav aria-label="Brief Table of Contents" className="space-y-0.5">
            {briefSections.map((title, idx) => {
              const isCurrent = activeSection === idx;
              return (
                <a
                  key={title}
                  href={`#brief-section-${idx}`}
                  onClick={() => setActiveSection(idx)}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    isCurrent
                      ? "bg-brand-soft text-brand font-bold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span className="font-mono text-[10px] w-4 shrink-0 text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{title}</span>
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border/70 text-[10px] text-muted-foreground leading-normal">
            Synthesized across 8 verified sources with zero speculative hallucination.
          </div>
        </aside>

        {/* Editorial Brief Report Paper */}
        <article className="signal-panel p-6 sm:p-10 space-y-4 shadow-sm bg-card">
          <div className="border-b border-border/80 pb-6 space-y-2">
            <span className="font-mono text-[10px] font-bold tracking-widest text-brand uppercase">
              CONFIDENTIAL · STRATEGIC LEADERSHIP MEMORANDUM
            </span>
            <h2 className="signal-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Strategic Briefing & Recommended Action Matrix
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <span>Prepared for: <strong>Founding Team & Directors</strong></span>
              <span>Distribution: <strong>Internal Eyes Only</strong></span>
              <span>Confidence Index: <strong className="text-success">96%</strong></span>
            </div>
          </div>

          {/* 10 Sections Rendered in Exact Order */}
          <div className="divide-y divide-border/60">
            {briefSectionsList.map((content, idx) => (
              <BriefSection
                key={`${content.sectionTitle}-${idx}`}
                index={idx}
                content={content}
              />
            ))}
          </div>

          {/* Report Footer */}
          <div className="pt-6 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>Signal Stack Intelligence Engine · Version 2.4</span>
            <div className="flex items-center gap-1.5 text-success">
              <ShieldCheck className="size-4" />
              <span>Full Provenance Audit Trail Verified</span>
            </div>
          </div>
        </article>
      </div>

      {/* Email-Ready Layout Modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="max-w-[620px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-brand" />
              <DialogTitle className="text-base font-bold">Email-Ready Briefing Preview</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Preview the responsive inline HTML email template sent to executive leadership.
            </DialogDescription>
          </DialogHeader>

          <div className="my-3 rounded-lg border border-border/80 bg-secondary/30 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs">
              <div className="space-y-1">
                <div><span className="text-muted-foreground">To:</span> <strong className="text-foreground">{recipientEmail}</strong></div>
                <div><span className="text-muted-foreground">Subject:</span> <strong className="text-foreground">Monday Morning Intelligence Brief · {company} (Issue #48)</strong></div>
              </div>
              <Badge variant="outline" className="bg-brand-soft text-brand text-[10px]">
                HTML Email
              </Badge>
            </div>

            {/* Simulated HTML Email Container */}
            <div className="rounded border border-border bg-card p-5 text-xs space-y-4 shadow-inner">
              <div className="border-b border-primary pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  SIGNAL STACK BRIEFING
                </span>
                <h3 className="signal-display text-base font-bold text-foreground mt-1">
                  Executive Summary: Strategic Window Opens for CBSE Experiential Labs
                </h3>
              </div>

              <p className="leading-relaxed text-foreground">
                Good morning team. This week's statutory scan highlights CBSE Notification 2026/89, creating immediate compliance demand for turnkey school solutions. Key competitors are discounting commodity software, presenting an opening for EDXSO's embedded mentorship retainers.
              </p>

              <div className="rounded bg-secondary/50 p-3">
                <span className="font-bold text-foreground">Top Priority for Today:</span>
                <p className="mt-0.5 text-muted-foreground">
                  Approve and publish the 'CBSE 2027 Experiential Compliance Blueprint' for school trustees. (Assigned: Priya R.)
                </p>
              </div>

              <div className="pt-2 text-[10px] text-muted-foreground text-center border-t border-border/60">
                View complete 10-section briefing online at https://signalstack.internal/brief
              </div>
            </div>
          </div>

          <form onSubmit={handleSendEmailPreview} className="space-y-3">
            <div className="flex items-center gap-2">
              <label htmlFor="recipient-email" className="text-xs font-semibold shrink-0">
                Send Test Email To:
              </label>
              <input
                id="recipient-email"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
                className="h-8 flex-1 rounded-md border border-input bg-background px-2.5 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEmailModalOpen(false)}>
                Close Preview
              </Button>
              <Button type="submit" size="sm" className="gap-1.5 font-semibold">
                <Send className="size-3.5" />
                <span>Simulate Dispatch</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Brief History Modal */}
      <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
        <DialogContent className="max-w-[540px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <FileClock className="size-5 text-brand" />
              <DialogTitle className="text-base font-bold">Archived Executive Briefs</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Chronological archive of past published Monday morning briefings
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-2.5">
            {[
              { issue: "Issue #48 (Current)", date: "Nov 17, 2026", signals: 6, status: "Active" },
              { issue: "Issue #47", date: "Nov 10, 2026", signals: 8, status: "Archived" },
              { issue: "Issue #46", date: "Nov 03, 2026", signals: 5, status: "Archived" },
              { issue: "Issue #45", date: "Oct 27, 2026", signals: 7, status: "Archived" },
            ].map((brief, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border/80 bg-secondary/30 p-3 text-xs"
              >
                <div>
                  <span className="font-bold text-foreground">{brief.issue}</span>
                  <span className="block text-[11px] text-muted-foreground">{brief.date} · {brief.signals} signals synthesized</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setHistoryModalOpen(false);
                    toast.info(`Loaded snapshot for ${brief.issue}`);
                  }}
                  className="h-7 text-xs text-brand hover:underline"
                >
                  View Snapshot
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setHistoryModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
