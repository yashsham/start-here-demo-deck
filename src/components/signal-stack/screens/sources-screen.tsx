import { useState } from "react";
import { Plus, Globe2, FileClock, AlertTriangle, Eye, Check, X, ExternalLink, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FilterToolbar } from "../components/filter-toolbar";
import { SourceHealthBadge } from "../components/source-health-badge";
import { EvidencePanel } from "../components/evidence-panel";
import { previewSources, categories, type PreviewSource, type Category } from "../data";

export function SourcesScreen({
  sources,
  setSources,
}: {
  sources: PreviewSource[];
  setSources: React.Dispatch<React.SetStateAction<PreviewSource[]>>;
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [inspectSource, setInspectSource] = useState<PreviewSource | null>(null);

  // New source form state
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("Customers");
  const [newRationale, setNewRationale] = useState("");

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.url.toLowerCase().includes(search.toLowerCase()) ||
      s.rationale.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    const normalizedUrl = newUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

    // Check if duplicate
    const isDuplicate = sources.some((s) => s.url.toLowerCase().includes(normalizedUrl.toLowerCase()));

    const newSourceItem: PreviewSource = {
      id: `src-${Date.now()}`,
      name: newName.trim(),
      url: normalizedUrl,
      category: newCategory,
      rationale: newRationale.trim() || "Manual source entry registered for crawl verification.",
      specificity: 80,
      credibility: 85,
      recency: "Just added",
      health: "New",
      status: "Pending",
      type: "News",
      isDuplicate,
      lastCrawl: "Scheduled",
      coverageTopic: "General Sector Intelligence",
    };

    setSources((prev) => [newSourceItem, ...prev]);
    setAddModalOpen(false);
    setNewName("");
    setNewUrl("");
    setNewRationale("");

    if (isDuplicate) {
      toast.warning(`Added ${newName} (Duplicate Alert)`, {
        description: "This domain or URL matches an existing monitored feed.",
      });
    } else {
      toast.success(`Successfully added ${newName}`, {
        description: "Source queued for initial semantic validation crawl.",
      });
    }
  };

  const handleToggleStatus = (id: string, newStatus: "Approved" | "Rejected") => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    toast.message(`Source marked as ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="signal-display text-lg font-bold text-foreground sm:text-xl">
            Enterprise Source Manager
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Audit, register, and evaluate public domains, official gazettes, and community feeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryDrawerOpen(true)}
            className="h-9 gap-1.5 text-xs"
          >
            <FileClock className="size-3.5" />
            <span>Crawl History</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="h-9 gap-1.5 px-3 text-xs font-semibold"
          >
            <Plus className="size-4" />
            <span>Add Source</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search sources by name, URL, or rationale…"
        onReset={() => {
          setSearch("");
          setSelectedCategory("All");
        }}
        resultCount={filteredSources.length}
      >
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground cursor-pointer"
          aria-label="Filter by quadrant category"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FilterToolbar>

      {/* Professional Data Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-xs">
        <table className="w-full min-w-[850px] text-left text-xs">
          <thead className="bg-secondary/70 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>
              <th className="px-4 py-3 pl-5">Source & Canonical URL</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Specificity</th>
              <th className="px-3 py-3">Credibility</th>
              <th className="px-3 py-3">Last Crawl</th>
              <th className="px-3 py-3">Health</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredSources.map((source) => (
              <tr key={source.id} className="hover:bg-secondary/25 transition-colors">
                <td className="px-4 py-3 pl-5 max-w-[220px]">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-semibold text-foreground">{source.name}</span>
                    {source.isDuplicate && (
                      <Badge variant="destructive" className="h-3.5 px-1 text-[8px]">
                        Dup
                      </Badge>
                    )}
                  </div>
                  <a
                    href={source.url.startsWith("http") ? source.url : `https://${source.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-0.5 block truncate text-[11px] text-brand hover:underline"
                  >
                    {source.url}
                  </a>
                </td>

                <td className="px-3 py-3">
                  <Badge variant="outline" className="text-[10px]">
                    {source.category}
                  </Badge>
                </td>

                <td className="px-3 py-3 text-muted-foreground">{source.type}</td>

                <td className="px-3 py-3 font-semibold tabular-nums text-foreground">
                  {source.specificity}%
                </td>

                <td className="px-3 py-3 font-semibold tabular-nums text-success">
                  {source.credibility}%
                </td>

                <td className="px-3 py-3 text-muted-foreground text-[11px] whitespace-nowrap">
                  {source.lastCrawl ?? source.recency}
                </td>

                <td className="px-3 py-3">
                  <SourceHealthBadge status={source.health} />
                </td>

                <td className="px-3 py-3">
                  <SourceHealthBadge status={source.status} />
                </td>

                <td className="px-3 py-3 pr-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setInspectSource(source)}
                      className="size-7 text-muted-foreground hover:text-foreground"
                      aria-label="Inspect evidence"
                    >
                      <Eye className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(source.id, "Approved")}
                      className="size-7 text-success hover:bg-success-soft"
                      aria-label="Approve source"
                    >
                      <Check className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(source.id, "Rejected")}
                      className="size-7 text-danger hover:bg-danger-soft"
                      aria-label="Reject source"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Source Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Register Intelligence Source</DialogTitle>
            <DialogDescription className="text-xs">
              Add a new web domain or official circular repository to the crawling registry.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSource} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Source Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                placeholder="e.g. Directorate of Higher Education"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Website / Feed URL</label>
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
                placeholder="e.g. dhe.gov.in/notices"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Category Quadrant</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Category)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Inclusion Rationale & Intelligence Focus
              </label>
              <Input
                value={newRationale}
                onChange={(e) => setNewRationale(e.target.value)}
                placeholder="e.g. Tracks regulatory gazettes impacting affiliated colleges"
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="font-semibold">
                Register Source
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Crawl History Modal */}
      <Dialog open={historyDrawerOpen} onOpenChange={setHistoryDrawerOpen}>
        <DialogContent className="max-w-[560px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <FileClock className="size-5 text-brand" />
              <DialogTitle className="text-base font-bold">Source Crawl Audit Log</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Recent automated HTTP crawls and semantic hash comparisons
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-2.5">
            {[
              { time: "Today, 06:15 AM", source: "CBSE Central Circulars", status: "200 OK", bytes: "142 KB", changes: "1 New Circular Parsed" },
              { time: "Today, 04:30 AM", source: "NEP 2020 Portal", status: "200 OK", bytes: "88 KB", changes: "No Structural Diffs" },
              { time: "Yesterday, 11:20 PM", source: "EdTech Review", status: "200 OK", bytes: "310 KB", changes: "2 Articles Indexed" },
              { time: "Yesterday, 07:00 PM", source: "Principals Forum", status: "304 Cached", bytes: "45 KB", changes: "Cache Hit" },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-border/70 bg-secondary/30 p-2.5 text-xs">
                <div>
                  <span className="font-semibold text-foreground">{log.source}</span>
                  <span className="block text-[10px] text-muted-foreground">{log.time} · {log.bytes}</span>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-success-soft text-success text-[10px] border-0">
                    {log.status}
                  </Badge>
                  <span className="block text-[10px] font-medium text-foreground mt-0.5">{log.changes}</span>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setHistoryDrawerOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evidence Panel Modal */}
      <EvidencePanel
        open={Boolean(inspectSource)}
        onOpenChange={(open) => !open && setInspectSource(null)}
        source={inspectSource}
      />
    </div>
  );
}
