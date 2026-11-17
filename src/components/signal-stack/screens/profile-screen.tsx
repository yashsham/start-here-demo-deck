import { useState } from "react";
import {
  Layers,
  Target,
  Building2,
  DollarSign,
  AlertCircle,
  Sparkles,
  Users,
  TrendingUp,
  LockKeyhole,
  FileClock,
  Edit3,
  Check,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { CompanyName } from "../data";

interface ProfilePillar {
  id: string;
  label: string;
  icon: typeof Target;
  summary: string;
  details: string;
  category: "Strategy" | "Monetization" | "Customers" | "Governance";
  lastUpdated: string;
}

export function ProfileScreen({ company }: { company: CompanyName }) {
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<ProfilePillar | null>(null);
  const [editedSummary, setEditedSummary] = useState("");
  const [editedDetails, setEditedDetails] = useState("");

  const [pillars, setPillars] = useState<ProfilePillar[]>([
    {
      id: "business-model",
      label: "Business Model",
      icon: Target,
      summary: "High-touch institutional retainer & EduCore licensing",
      details: "Combines multi-year strategic advisory agreements for school chains with modular per-student platform access fees.",
      category: "Monetization",
      lastUpdated: "Nov 15, 2026",
    },
    {
      id: "revenue-streams",
      label: "Revenue Streams",
      icon: DollarSign,
      summary: "Retainers (55%), EduCore Audits (25%), Leadership Cohorts (20%)",
      details: "Contract sizes range from ₹18L to ₹65L annually with average contract duration of 24 months.",
      category: "Monetization",
      lastUpdated: "Nov 14, 2026",
    },
    {
      id: "customer-segments",
      label: "Customer Segments",
      icon: Building2,
      summary: "Tier-1 & Tier-2 K-12 Private Schools and Multi-Campus Trusts",
      details: "Primary focus on CBSE, ICSE, and IB institutions with enrollment between 800 and 3,500 students.",
      category: "Customers",
      lastUpdated: "Nov 12, 2026",
    },
    {
      id: "customer-problems",
      label: "Customer Problems & Friction",
      icon: AlertCircle,
      summary: "High teacher turnover, execution deficit, and compliance anxiety",
      details: "School leaders possess clear intent but lack dedicated pedagogical bandwidth to implement NEP 2020 experiential mandates.",
      category: "Customers",
      lastUpdated: "Nov 16, 2026",
    },
    {
      id: "value-prop",
      label: "Value Proposition",
      icon: Sparkles,
      summary: "Embedded Hallway Implementation with Measurable Board Score Lift",
      details: "We don't provide slide decks; our senior mentors embed in school halls to coach department heads and stabilize faculty.",
      category: "Strategy",
      lastUpdated: "Nov 10, 2026",
    },
    {
      id: "competitors",
      label: "Competitors & Substitutes",
      icon: Users,
      summary: "Status-quo inaction, boutique academic agencies, and cheap AI grading tools",
      details: "Commoditized software vendors lack pedagogical depth; legacy consultancies lack implementation stamina.",
      category: "Strategy",
      lastUpdated: "Nov 15, 2026",
    },
    {
      id: "growth-priorities",
      label: "Growth Priorities (12 Months)",
      icon: TrendingUp,
      summary: "Expand footprint to 150 partner institutions across 4 regional clusters",
      details: "Launch the EduCore Turnkey Lab bundle and formalize the Trustee Peer Advisory Circle.",
      category: "Strategy",
      lastUpdated: "Nov 14, 2026",
    },
    {
      id: "internal-context",
      label: "Internal Context & Governance",
      icon: LockKeyhole,
      summary: "Proprietary 360° diagnostic rubric and confidential pilot pricing",
      details: "Consulting margin targets set at 48% gross; diagnostic onboarding SLA capped at 14 business days.",
      category: "Governance",
      lastUpdated: "Nov 11, 2026",
    },
  ]);

  const handleEditClick = (pillar: ProfilePillar) => {
    setSelectedPillar(pillar);
    setEditedSummary(pillar.summary);
    setEditedDetails(pillar.details);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPillar) return;

    setPillars((prev) =>
      prev.map((p) =>
        p.id === selectedPillar.id
          ? { ...p, summary: editedSummary, details: editedDetails, lastUpdated: "Just now" }
          : p
      )
    );
    setEditDialogOpen(false);
    toast.success(`Updated ${selectedPillar.label}`, {
      description: "Changes applied to current intelligence calibration profile.",
    });
  };

  const versionHistory = [
    {
      version: "v1.2 (Active)",
      date: "Nov 16, 2026 · 14:20 IST",
      author: "Alex Kim",
      change: "Added Customer Problems & CBSE Experiential Mandates alignment.",
    },
    {
      version: "v1.1",
      date: "Nov 12, 2026 · 09:15 IST",
      author: "Priya R.",
      change: "Updated Revenue Streams breakdown to reflect EduCore licensing tier.",
    },
    {
      version: "v1.0 (Initial)",
      date: "Nov 01, 2026 · 11:00 IST",
      author: "System Setup",
      change: "Baseline corporate profile synthesized from public domain discovery.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Version History trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="signal-display text-lg font-bold text-foreground sm:text-xl">
            {company} Intelligence Profile
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            The canonical corporate context that weights incoming signals and defines executive relevance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVersionHistoryOpen(true)}
            className="h-8 gap-1.5 text-xs"
          >
            <FileClock className="size-3.5" />
            <span>Version History (v1.2)</span>
          </Button>
        </div>
      </div>

      {/* 8 Pillar Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <article
              key={pillar.id}
              className="signal-panel signal-panel-hover flex flex-col justify-between p-4 sm:p-5 transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-md bg-secondary text-foreground">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {pillar.category}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(pillar)}
                    className="size-7 text-muted-foreground hover:text-foreground"
                    aria-label={`Edit ${pillar.label}`}
                  >
                    <Edit3 className="size-3.5" />
                  </Button>
                </div>

                <h3 className="mt-3 text-xs font-bold text-foreground sm:text-sm">
                  {pillar.label}
                </h3>
                <p className="mt-1 text-xs font-semibold text-brand">
                  {pillar.summary}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {pillar.details}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-2.5 text-[10px] text-muted-foreground">
                <span>Updated: {pillar.lastUpdated}</span>
                <span className="font-semibold text-success">Calibrated</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Edit Pillar Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Edit {selectedPillar?.label}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update this dimension to refine signal filtering and briefing synthesis.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Executive Headline / Summary
              </label>
              <Input
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Detailed Context & Decision Criteria
              </label>
              <Textarea
                value={editedDetails}
                onChange={(e) => setEditedDetails(e.target.value)}
                rows={4}
                required
                className="text-xs leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Version History Modal */}
      <Dialog open={versionHistoryOpen} onOpenChange={setVersionHistoryOpen}>
        <DialogContent className="max-w-[560px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <FileClock className="size-5 text-brand" />
              <DialogTitle className="text-base font-bold">Profile Version Audit History</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Immutable revision log for {company} intelligence calibration
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-3">
            {versionHistory.map((item) => (
              <div
                key={item.version}
                className="rounded-lg border border-border/80 bg-secondary/30 p-3.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{item.version}</span>
                  <span className="text-[11px] text-muted-foreground">{item.date}</span>
                </div>
                <p className="mt-1 text-muted-foreground leading-relaxed">{item.change}</p>
                <span className="mt-1.5 block text-[10px] text-brand font-medium">
                  Author: {item.author}
                </span>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-3">
            <Button variant="outline" size="sm" onClick={() => setVersionHistoryOpen(false)}>
              Close History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
