import { useState } from "react";
import { Check, User, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BriefContent } from "../data";

const priorityStyles = {
  P0: "bg-danger-soft text-danger border-danger/30",
  P1: "bg-warning-soft text-warning border-warning/30",
  P2: "bg-secondary text-muted-foreground border-border",
};

export function BriefSection({
  index,
  content,
  onCheckItem,
}: {
  index: number;
  content: BriefContent;
  onCheckItem?: (taskIndex: number, checked: boolean) => void;
}) {
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    content.actionItems?.forEach((item, idx) => {
      initial[idx] = item.status;
    });
    return initial;
  });

  const toggleTask = (idx: number) => {
    setCheckedTasks((prev) => {
      const next = !prev[idx];
      onCheckItem?.(idx, next);
      return { ...prev, [idx]: next };
    });
  };

  const sectionNumber = String(index + 1).padStart(2, "0");

  return (
    <section id={`brief-section-${index}`} className="scroll-mt-24 py-8 first:pt-4 border-b border-border/80 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-bold text-brand bg-brand-soft px-2 py-0.5 rounded">
          {sectionNumber}
        </span>
        <h2 className="signal-display text-lg font-bold text-foreground sm:text-xl">
          {content.sectionTitle}
        </h2>
      </div>

      <h3 className="signal-display mt-3 text-sm font-semibold text-foreground/90 sm:text-base">
        {content.headline}
      </h3>

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {content.summary}
      </p>

      {content.keyInsights && content.keyInsights.length > 0 && (
        <div className="mt-4 space-y-2.5">
          {content.keyInsights.map((insight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-border/70 bg-secondary/35 p-3 text-xs"
            >
              <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-brand" />
              <div className="min-w-0 flex-1">
                <span className="leading-relaxed text-foreground">{insight.text}</span>
                <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-brand">
                  <FileText className="size-3" />
                  Citation: {insight.citation}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {content.actionItems && content.actionItems.length > 0 && (
        <div className="mt-5 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Weekly Execution Tasks & Accountability
          </span>
          {content.actionItems.map((item, idx) => {
            const isChecked = !!checkedTasks[idx];
            return (
              <label
                key={idx}
                className={`flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3 text-xs transition-colors ${
                  isChecked
                    ? "border-border/50 bg-secondary/20 text-muted-foreground"
                    : "border-border bg-card hover:bg-accent/40"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleTask(idx)}
                    className="mt-0.5 size-4 accent-primary rounded cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <span className={`block font-medium ${isChecked ? "line-through" : "text-foreground"}`}>
                      {item.task}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <User className="size-3" />
                      Assigned: <strong className="text-foreground">{item.owner}</strong>
                    </span>
                  </div>
                </div>

                <Badge variant="outline" className={`shrink-0 text-[10px] font-bold ${priorityStyles[item.priority]}`}>
                  {item.priority}
                </Badge>
              </label>
            );
          })}
        </div>
      )}

      {content.watchList && content.watchList.length > 0 && (
        <div className="mt-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Metric Radar & Threshold Triggers
          </span>
          <div className="mt-2 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 text-[10px] font-bold uppercase text-muted-foreground">
                <tr>
                  <th className="px-3.5 py-2.5">Indicator</th>
                  <th className="px-3.5 py-2.5">Alert Trigger Threshold</th>
                  <th className="px-3.5 py-2.5">Monitoring Feed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {content.watchList.map((watch, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20">
                    <td className="px-3.5 py-2.5 font-medium text-foreground">{watch.item}</td>
                    <td className="px-3.5 py-2.5 text-warning font-semibold">{watch.threshold}</td>
                    <td className="px-3.5 py-2.5 text-muted-foreground">{watch.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
