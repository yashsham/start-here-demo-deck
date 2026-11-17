import { useState } from "react";
import { Building2, Layers, Target, Compass, ExternalLink, ShieldCheck, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VerificationBadge } from "../components/verification-badge";
import { researchDossiers, type CompanyName } from "../data";

export function ResearchScreen({
  company,
  onInspectEvidenceUrl,
}: {
  company: CompanyName;
  onInspectEvidenceUrl?: (url: string, snippet: string) => void;
}) {
  const dossier = researchDossiers[company] || researchDossiers.EDXSO;
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Company Header Capsule */}
      <section className="signal-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand font-bold text-lg">
              <Building2 className="size-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="signal-display text-lg font-bold text-foreground sm:text-xl">
                  {dossier.company} Research Dossier
                </h1>
                <Badge variant="secondary" className="bg-success-soft text-success text-[10px] font-bold">
                  Synthesized Dossier
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Corporate intelligence profile calibrated against public registry disclosures and operational hypotheses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Facts: {dossier.factsVsAssumptions.filter((f) => f.type === "Verified Fact").length}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Assumptions: {dossier.factsVsAssumptions.filter((f) => f.type === "Operating Assumption").length}
            </Badge>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-foreground/90 sm:text-sm">
          {dossier.overview}
        </p>
      </section>

      {/* Structured Dossier Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-secondary/70 p-1 flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" className="text-xs">
            Products & Offerings
          </TabsTrigger>
          <TabsTrigger value="business-model" className="text-xs">
            Business Model & Revenue
          </TabsTrigger>
          <TabsTrigger value="segments" className="text-xs">
            Customer Segments & Pain
          </TabsTrigger>
          <TabsTrigger value="positioning" className="text-xs">
            Competitive Positioning
          </TabsTrigger>
          <TabsTrigger value="facts-vs-assumptions" className="text-xs font-bold text-brand">
            Verified Facts vs Assumptions
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Products & Services */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid gap-3 sm:grid-cols-2">
            {dossier.productsAndServices.map((product) => (
              <article key={product.title} className="signal-panel p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-foreground sm:text-sm">{product.title}</h3>
                  <Badge variant="outline" className="text-[10px] font-semibold text-brand">
                    {product.maturity}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </article>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Business Model */}
        <TabsContent value="business-model" className="mt-0">
          <div className="grid gap-3 sm:grid-cols-3">
            {dossier.businessModel.map((item) => (
              <article key={item.stream} className="signal-panel p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Target Share: {item.targetShare}
                  </span>
                  <h3 className="mt-1 text-xs font-bold text-foreground sm:text-sm">{item.stream}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.model}</p>
                </div>
              </article>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Customer Segments */}
        <TabsContent value="segments" className="mt-0">
          <div className="grid gap-3 sm:grid-cols-3">
            {dossier.customerSegments.map((seg) => (
              <article key={seg.name} className="signal-panel p-4 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-foreground sm:text-sm">{seg.name}</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">{seg.profile}</p>
                </div>
                <div className="rounded-md bg-secondary/50 p-2.5 text-xs">
                  <span className="font-semibold text-foreground">Core Friction:</span>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-normal">{seg.painPoint}</p>
                </div>
              </article>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Positioning */}
        <TabsContent value="positioning" className="mt-0">
          <div className="grid gap-3 sm:grid-cols-3">
            {dossier.positioning.map((pos) => (
              <article key={pos.pillar} className="signal-panel p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                  Differentiating Pillar
                </span>
                <h3 className="text-xs font-bold text-foreground sm:text-sm">{pos.pillar}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{pos.differentiator}</p>
              </article>
            ))}
          </div>
        </TabsContent>

        {/* Tab 5: Verified Facts vs Assumptions */}
        <TabsContent value="facts-vs-assumptions" className="mt-0">
          <section className="signal-panel overflow-hidden">
            <div className="p-4 border-b border-border/80 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-foreground sm:text-sm">
                  Truth Architecture · Facts & Operating Hypotheses
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Traceable public records contrasted with operational assumptions requiring validation
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-secondary/70 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Statement / Intelligence Assertion</th>
                    <th className="px-4 py-3">Classification</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Evidence Source Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {dossier.factsVsAssumptions.map((item, idx) => (
                    <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3.5 max-w-[340px] font-medium text-foreground">
                        {item.statement}
                      </td>
                      <td className="px-4 py-3.5">
                        <VerificationBadge type={item.type} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="signal-display font-bold text-foreground">
                          {item.confidence}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <FileText className="size-3.5 shrink-0 text-brand" />
                          <span className="truncate">{item.evidenceSource}</span>
                          {item.sourceUrl && (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand hover:underline"
                            >
                              <ExternalLink className="size-3" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
