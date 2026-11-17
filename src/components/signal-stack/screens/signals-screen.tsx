import { useState } from "react";
import { Sparkles, Network, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceCard } from "../components/source-card";
import { EvidencePanel } from "../components/evidence-panel";
import { EmptyState } from "../components/empty-state";
import { previewSources, categories, type Category, type PreviewSource } from "../data";

export function SignalsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Customers");
  const [sourcesList, setSourcesList] = useState<PreviewSource[]>(previewSources);
  const [inspectSource, setInspectSource] = useState<PreviewSource | null>(null);
  const [inspectOpen, setInspectOpen] = useState(false);

  const visibleSources = sourcesList.filter((s) => s.category === selectedCategory);

  const handleApprove = (source: PreviewSource) => {
    setSourcesList((prev) =>
      prev.map((s) => (s.id === source.id ? { ...s, status: "Approved" } : s))
    );
    toast.success(`Approved source: ${source.name}`, {
      description: "Source promoted to active intelligence indexing.",
    });
  };

  const handleReject = (source: PreviewSource) => {
    setSourcesList((prev) =>
      prev.map((s) => (s.id === source.id ? { ...s, status: "Rejected" } : s))
    );
    toast.error(`Rejected source: ${source.name}`, {
      description: "Source excluded from weekly briefing candidates.",
    });
  };

  const handleInspect = (source: PreviewSource) => {
    setInspectSource(source);
    setInspectOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((category) => {
            const count = sourcesList.filter((s) => s.category === category).length;
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span>{category}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-card text-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {sourcesList.filter((s) => s.status === "Approved").length} Active Approved Feeds
          </Badge>
        </div>
      </div>

      {/* Sources Grid */}
      {visibleSources.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {visibleSources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              onApprove={handleApprove}
              onReject={handleReject}
              onInspect={handleInspect}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Network}
          title={`No ${selectedCategory} Sources Registered`}
          description="There are currently no active intelligence streams indexed for this quadrant."
        />
      )}

      {/* Inspect Evidence Modal */}
      <EvidencePanel
        open={inspectOpen}
        onOpenChange={setInspectOpen}
        source={inspectSource}
      />
    </div>
  );
}
