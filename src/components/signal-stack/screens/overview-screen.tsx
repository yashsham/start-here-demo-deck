import {
  Globe2,
  Radio,
  ShieldCheck,
  CalendarClock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Zap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "../components/metric-card";
import { SignalCard } from "../components/signal-card";
import { SourceHealthBadge } from "../components/source-health-badge";
import { previewSignals, previewSources, type CompanyName, type Section, type PreviewSignal } from "../data";

export function OverviewScreen({
  company,
  onNavigate,
  onInspectSignal,
}: {
  company: CompanyName;
  onNavigate: (section: Section) => void;
  onInspectSignal?: (signal: PreviewSignal) => void;
}) {
  const companySignals = previewSignals.filter((s) => s.company === company);
  const activeSignals = companySignals.length > 0 ? companySignals : previewSignals.slice(0, 3);
  const opportunities = previewSignals.filter((s) => s.type === "Opportunity");
  const threats = previewSignals.filter((s) => s.type === "Threat");

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/20 bg-brand-soft/30 p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold text-foreground sm:text-sm">
              Intelligence Briefing Scheduled · Monday 09:00 IST
            </h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {activeSignals.length} verified candidate signals awaiting executive review for {company}.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => onNavigate("brief")}
          className="h-8 gap-1.5 px-3 text-xs font-semibold"
        >
          <BookOpen className="size-3.5" />
          <span>Open Latest Brief</span>
        </Button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active Sources"
          value="08"
          description="8 tracked feeds · 1 duplicate alert"
          icon={Globe2}
          tone="brand"
          trend="+2 feeds"
          trendDirection="up"
        />
        <MetricCard
          label="Synthesized Signals"
          value="06"
          description="Across 4 intelligence quadrants"
          icon={Radio}
          tone="cyan"
          trend="+3 this week"
          trendDirection="up"
        />
        <MetricCard
          label="Source Health Audit"
          value="98.4%"
          description="High reliability threshold met"
          icon={ShieldCheck}
          tone="success"
          trend="Healthy"
          trendDirection="up"
        />
        <MetricCard
          label="Next Executive Brief"
          value="Mon 09:00"
          description="Cadence: Weekly automated run"
          icon={CalendarClock}
          tone="warning"
        />
      </div>

      {/* Opportunities vs Threats & Priority Developments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1.2fr)]">
        {/* Left: Important Developments */}
        <section className="signal-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="signal-display text-sm font-bold text-foreground sm:text-base">
                High-Impact Developments
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Priority signals filtered for {company} leadership
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("feed")}
              className="h-8 gap-1 text-xs text-brand hover:underline"
            >
              <span>Full Feed</span>
              <ArrowRight className="size-3" />
            </Button>
          </div>

          <div className="space-y-3.5">
            {activeSignals.map((signal) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                onInspectEvidence={onInspectSignal}
              />
            ))}
          </div>
        </section>

        {/* Right: Quadrant Balance, Health, Readiness */}
        <div className="space-y-6">
          {/* Opportunities vs Threats Widget */}
          <section className="signal-panel p-5">
            <h3 className="signal-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Strategic Radar Balance
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-success/30 bg-success-soft/30 p-3.5 text-center">
                <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-success">
                  <TrendingUp className="size-3.5" />
                  Opportunities
                </span>
                <span className="signal-display mt-1 block text-2xl font-bold text-foreground">
                  {opportunities.length}
                </span>
                <span className="text-[10px] text-muted-foreground">Immediate upside</span>
              </div>

              <div className="rounded-lg border border-danger/30 bg-danger-soft/30 p-3.5 text-center">
                <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-danger">
                  <AlertTriangle className="size-3.5" />
                  Threats
                </span>
                <span className="signal-display mt-1 block text-2xl font-bold text-foreground">
                  {threats.length}
                </span>
                <span className="text-[10px] text-muted-foreground">Risks to counter</span>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground">
              Market signals lean heavily toward compliance expansion; competitor discounting is currently the chief downside pressure.
            </div>
          </section>

          {/* Source Health Summary */}
          <section className="signal-panel p-5">
            <div className="flex items-center justify-between">
              <h3 className="signal-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Monitored Feeds Health
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("sources")}
                className="h-7 text-[11px] text-brand"
              >
                Manager
              </Button>
            </div>

            <div className="mt-3 divide-y divide-border/60">
              {previewSources.slice(0, 4).map((source) => (
                <div key={source.id} className="flex items-center justify-between py-2.5 text-xs">
                  <div className="min-w-0 flex-1 pr-3">
                    <span className="block truncate font-semibold text-foreground">
                      {source.name}
                    </span>
                    <span className="block truncate text-[10px] text-muted-foreground">
                      {source.url}
                    </span>
                  </div>
                  <SourceHealthBadge status={source.health} />
                </div>
              ))}
            </div>
          </section>

          {/* Quick Pipeline Status */}
          <section className="signal-panel p-5 bg-gradient-to-br from-card to-secondary/30">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Zap className="size-4 text-brand" />
              <span>Pipeline Readiness</span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Domain Crawl</span>
                <span className="font-semibold text-success">Verified</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Founder Context Intake</span>
                <span className="font-semibold text-brand">10 Questions Ready</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Brief Template Synthesis</span>
                <span className="font-semibold text-foreground">10 Sections Active</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
