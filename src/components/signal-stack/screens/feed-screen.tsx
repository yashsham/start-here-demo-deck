import { useState } from "react";
import { Filter, SlidersHorizontal, Radio, Search, RotateCcw, Sparkles, Loader2, Plus } from "lucide-react";
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
import { SignalCard } from "../components/signal-card";
import { EvidencePanel } from "../components/evidence-panel";
import { EmptyState } from "../components/empty-state";
import { previewSignals, categories, type PreviewSignal, type Category } from "../data";
import { classifySignalEventWithAI } from "@/lib/groq";

export function FeedScreen() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");
  const [businessAreaFilter, setBusinessAreaFilter] = useState<string>("All");
  const [inspectSignal, setInspectSignal] = useState<PreviewSignal | null>(null);

  const [signalsList, setSignalsList] = useState<PreviewSignal[]>(previewSignals);
  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);
  const [rawEventText, setRawEventText] = useState("");
  const [rawSourceUrl, setRawSourceUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const businessAreas = Array.from(new Set(signalsList.map((s) => s.businessArea)));

  const filteredSignals = signalsList.filter((signal) => {
    const matchesSearch =
      signal.event.toLowerCase().includes(search.toLowerCase()) ||
      signal.why.toLowerCase().includes(search.toLowerCase()) ||
      signal.evidence.toLowerCase().includes(search.toLowerCase()) ||
      signal.source.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "All" || signal.category === categoryFilter;
    const matchesType = typeFilter === "All" || signal.type === typeFilter;
    const matchesUrgency = urgencyFilter === "All" || signal.urgency === urgencyFilter;
    const matchesArea = businessAreaFilter === "All" || signal.businessArea === businessAreaFilter;

    return matchesSearch && matchesCategory && matchesType && matchesUrgency && matchesArea;
  });

  const handleResetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setTypeFilter("All");
    setUrgencyFilter("All");
    setBusinessAreaFilter("All");
  };

  const handleAnalyzeSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawEventText.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    toast.info("Groq AI: Analyzing Signal…", {
      description: "Classifying impact, urgency, and extracting executive actions via openai/gpt-oss-20b.",
    });

    try {
      const classification = await classifySignalEventWithAI(rawEventText, rawSourceUrl);
      const newSignal: PreviewSignal = {
        id: `sig-${Date.now()}`,
        category: classification.category,
        event: rawEventText.trim(),
        why: classification.why,
        evidence: rawEventText.trim(),
        source: rawSourceUrl || "Live AI Input Stream",
        sourceUrl: rawSourceUrl || "https://edxso.com",
        pubDate: "Today",
        discoveryDate: "Just now · Groq AI",
        type: classification.type,
        urgency: classification.urgency,
        businessArea: classification.businessArea,
        recommendedAction: classification.recommendedAction,
        actionOwner: classification.actionOwner,
        relevanceScore: classification.relevanceScore,
        company: "EDXSO",
      };

      setSignalsList((prev) => [newSignal, ...prev]);
      setAnalyzeModalOpen(false);
      setRawEventText("");
      setRawSourceUrl("");
      toast.success("Signal Analyzed & Added to Feed!", {
        description: `Classified as ${classification.type} (${classification.urgency} Urgency).`,
      });
    } catch (err: any) {
      toast.error("Failed to analyze signal", { description: err.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="signal-display text-lg font-bold text-foreground sm:text-xl">
            Chronological Intelligence Feed
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Parsed signals with strict separation of traceable evidence, strategic interpretation, and actionable next steps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setAnalyzeModalOpen(true)}
            className="h-8 gap-1.5 px-3 text-xs font-semibold bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Sparkles className="size-3.5" />
            <span>Analyze Signal with Groq AI</span>
          </Button>

          <Badge variant="outline" className="text-xs">
            {filteredSignals.length} Active Signals
          </Badge>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1 max-w-[320px]">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by keyword, evidence, or owner…"
              className="h-9 pl-8 text-xs bg-background"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs cursor-pointer font-medium"
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Impact / Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs cursor-pointer font-medium"
            aria-label="Filter by impact type"
          >
            <option value="All">All Impact Types</option>
            <option value="Opportunity">Opportunities Only</option>
            <option value="Threat">Threats Only</option>
            <option value="Neutral">Neutral Signals</option>
          </select>

          {/* Urgency Filter */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs cursor-pointer font-medium"
            aria-label="Filter by urgency"
          >
            <option value="All">All Urgency Tiers</option>
            <option value="High">High Urgency</option>
            <option value="Medium">Medium Urgency</option>
            <option value="Low">Low Urgency</option>
          </select>

          {/* Business Area Filter */}
          <select
            value={businessAreaFilter}
            onChange={(e) => setBusinessAreaFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs cursor-pointer font-medium max-w-[200px]"
            aria-label="Filter by business area"
          >
            <option value="All">All Business Areas</option>
            {businessAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-9 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Signals Timeline List */}
      {filteredSignals.length > 0 ? (
        <div className="space-y-4">
          {filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onInspectEvidence={(s) => setInspectSignal(s)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Radio}
          title="No Matching Intelligence Signals"
          description="Try relaxing your category, urgency, or keyword filters to broaden the signal stream."
          action={
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs">
              Clear All Filters
            </Button>
          }
        />
      )}

      {/* Evidence Panel Modal */}
      <EvidencePanel
        open={Boolean(inspectSignal)}
        onOpenChange={(open) => !open && setInspectSignal(null)}
        evidenceSnippet={inspectSignal?.evidence}
        sourceUrl={inspectSignal?.sourceUrl}
      />

      {/* Groq AI Analyze Signal Dialog */}
      <Dialog open={analyzeModalOpen} onOpenChange={setAnalyzeModalOpen}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-brand" />
              <DialogTitle className="text-base font-bold">Analyze Raw Signal with Groq AI</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Paste any raw intelligence event, news quote, or statutory update. Groq AI will classify category, urgency, and generate actionable recommendations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAnalyzeSignal} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Raw Event / Headline / Finding
              </label>
              <Textarea
                value={rawEventText}
                onChange={(e) => setRawEventText(e.target.value)}
                required
                rows={3}
                placeholder="e.g. CBSE issues new directive mandating 15% experiential learning in K-12 affiliations for 2027…"
                className="text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Original Source / URL (Optional)
              </label>
              <Input
                value={rawSourceUrl}
                onChange={(e) => setRawSourceUrl(e.target.value)}
                placeholder="e.g. https://cbse.gov.in/circulars"
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAnalyzeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isAnalyzing} className="gap-1.5 font-semibold">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Analyzing…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    <span>Run AI Analysis</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
