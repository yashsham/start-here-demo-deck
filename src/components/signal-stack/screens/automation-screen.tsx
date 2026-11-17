import { useState } from "react";
import { Zap, CalendarClock, RefreshCw, Play, CheckCircle2, Clock, Globe, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { JobStatusBadge } from "../components/job-status-badge";

export function AutomationScreen() {
  const [weeklyBriefEnabled, setWeeklyBriefEnabled] = useState(true);
  const [monthlyAuditEnabled, setMonthlyAuditEnabled] = useState(true);
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST · UTC+5:30)");
  const [frequency, setFrequency] = useState("Every 6 Hours");
  const [isRunning, setIsRunning] = useState(false);

  const [executionLogs, setExecutionLogs] = useState([
    { id: "exec-1", job: "Weekly Brief Assembly", time: "Today, 04:30 AM", status: "Completed" as const, duration: "4.2s", triggeredBy: "Cron Scheduler" },
    { id: "exec-2", job: "Monthly Source Health Audit", time: "Nov 01, 00:00 AM", status: "Completed" as const, duration: "18.6s", triggeredBy: "Cron Scheduler" },
    { id: "exec-3", job: "Target Domain Sitemap Scan", time: "Yesterday, 22:00 PM", status: "Completed" as const, duration: "2.1s", triggeredBy: "Manual Dispatch" },
  ]);

  const handleRunNow = () => {
    setIsRunning(true);
    toast.info("Triggered Manual Intelligence Pipeline", {
      description: "Executing source crawler, semantic vectorization, and candidate synthesis…",
    });

    setTimeout(() => {
      setIsRunning(false);
      const newLog = {
        id: `exec-${Date.now()}`,
        job: "Ad-Hoc Manual Intelligence Scan",
        time: "Just now",
        status: "Completed" as const,
        duration: "3.8s",
        triggeredBy: "Manual (Operator)",
      };
      setExecutionLogs((prev) => [newLog, ...prev]);
      toast.success("Ad-Hoc Intelligence Scan Completed", {
        description: "Checked 8 active feeds, 0 new critical threats detected.",
      });
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="signal-display text-lg font-bold text-foreground sm:text-xl">
            Schedules & Automation Engine
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Configure autonomous crawling intervals, weekly briefing synthesis triggers, and timezone dispatch.
          </p>
        </div>

        <Button
          onClick={handleRunNow}
          disabled={isRunning}
          size="sm"
          className="h-9 gap-1.5 px-3 text-xs font-semibold"
        >
          <Play className={`size-3.5 fill-current ${isRunning ? "animate-pulse" : ""}`} />
          <span>{isRunning ? "Executing Pipeline…" : "Run Now (Manual Trigger)"}</span>
        </Button>
      </div>

      {/* Schedulers Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Card 1: Weekly Briefing */}
        <section className="signal-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-brand-soft text-brand">
                <CalendarClock className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-foreground">Weekly Executive Briefing</h2>
                <p className="text-xs text-muted-foreground">Automated candidate synthesis & email dispatch</p>
              </div>
            </div>
            <Switch
              checked={weeklyBriefEnabled}
              onCheckedChange={setWeeklyBriefEnabled}
              aria-label="Toggle weekly briefing"
            />
          </div>

          <div className="space-y-3 border-t border-border/70 pt-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cadence</span>
              <span className="font-semibold text-foreground">Every Monday at 09:00</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Delivery Timezone</span>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium cursor-pointer"
              >
                <option value="Asia/Kolkata (IST · UTC+5:30)">Asia/Kolkata (IST · UTC+5:30)</option>
                <option value="UTC (GMT · UTC+0:00)">UTC (GMT · UTC+0:00)</option>
                <option value="America/New_York (EST · UTC-5:00)">America/New_York (EST · UTC-5:00)</option>
                <option value="Europe/London (GMT · UTC+0:00)">Europe/London (GMT · UTC+0:00)</option>
                <option value="Asia/Singapore (SGT · UTC+8:00)">Asia/Singapore (SGT · UTC+8:00)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Next Scheduled Run</span>
              <span className="font-semibold text-brand">Next Monday · 09:00 AM IST</span>
            </div>
          </div>
        </section>

        {/* Card 2: Source Health & Crawling */}
        <section className="signal-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-cyan-soft text-cyan">
                <RefreshCw className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-foreground">Source Health & Crawl Cadence</h2>
                <p className="text-xs text-muted-foreground">Dead-link checks, duplicate detection, and recency audits</p>
              </div>
            </div>
            <Switch
              checked={monthlyAuditEnabled}
              onCheckedChange={setMonthlyAuditEnabled}
              aria-label="Toggle monthly audits"
            />
          </div>

          <div className="space-y-3 border-t border-border/70 pt-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Crawl Interval</span>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium cursor-pointer"
              >
                <option value="Every 2 Hours">Every 2 Hours</option>
                <option value="Every 6 Hours">Every 6 Hours</option>
                <option value="Every 12 Hours">Every 12 Hours</option>
                <option value="Daily (24 Hours)">Daily (24 Hours)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly Deep Audit</span>
              <span className="font-semibold text-foreground">1st of Every Month (00:00)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-semibold text-success flex items-center gap-1">
                <CheckCircle2 className="size-3.5" />
                Active Daemon Listener
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Execution History Table */}
      <section className="signal-panel p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="signal-display text-sm font-bold text-foreground sm:text-base">
              Autonomous Execution Log
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Traceable record of background cron events and manual operator triggers
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {executionLogs.length} Executions Recorded
          </Badge>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-secondary/70 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Task Name</th>
                <th className="px-3 py-3">Timestamp</th>
                <th className="px-3 py-3">Trigger Source</th>
                <th className="px-3 py-3">Duration</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {executionLogs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{log.job}</td>
                  <td className="px-3 py-3 text-muted-foreground">{log.time}</td>
                  <td className="px-3 py-3 text-muted-foreground">{log.triggeredBy}</td>
                  <td className="px-3 py-3 font-mono text-[11px] text-foreground">{log.duration}</td>
                  <td className="px-3 py-3">
                    <JobStatusBadge status={log.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
