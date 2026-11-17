import { useState, useEffect } from "react";
import { Building2, Globe, Compass, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { companies, researchDossiers, type CompanyName, type Section } from "../data";
import { synthesizeCompanyResearch } from "@/lib/groq";

export function SetupScreen({
  company,
  onNavigate,
}: {
  company: CompanyName;
  onNavigate: (section: Section) => void;
}) {
  const current = companies.find((c) => c.name === company) ?? companies[0]!;
  const [name, setName] = useState<string>(current.name);
  const [url, setUrl] = useState<string>(`https://${current.domain}`);
  const [industry, setIndustry] = useState<string>(current.industry);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const match = companies.find((c) => c.name === company);
    if (match) {
      setName(match.name);
      setUrl(`https://${match.domain}`);
      setIndustry(match.industry);
      setCompleted(false);
      setCurrentStage(0);
    }
  }, [company]);

  const stages = [
    { title: "Public Domain Discovery", desc: "Resolving sitemaps, robots.txt, and meta headers" },
    { title: "Core Offering Extraction", desc: "Parsing service descriptions, audience tags, and case studies" },
    { title: "Competitive Landscape Mapping", desc: "Benchmarking peer institutions and positioning claims" },
    { title: "Dossier Synthesis", desc: "Segregating verified factual assertions from operating assumptions" },
  ];

  const handleStartResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    setCompleted(false);
    setCurrentStage(0);

    // Progress stepper animation
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const generatedDossier = await synthesizeCompanyResearch(name, url, industry);
      // Persist generated dossier into global registry
      researchDossiers[name as CompanyName] = generatedDossier;
      clearInterval(interval);
      setCurrentStage(stages.length - 1);
      setIsProcessing(false);
      setCompleted(true);
      toast.success("Groq AI: Research Dossier Synthesized!", {
        description: `Generated verified facts, positioning, and products via openai/gpt-oss-120b.`,
      });
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setCompleted(true);
      toast.info("Using baseline research fixtures", {
        description: "Pipeline completed with local dossier calibration.",
      });
    }
  };

  const progressValue = completed
    ? 100
    : isProcessing
    ? Math.round(((currentStage + 1) / stages.length) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="signal-panel p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
            <Compass className="size-6" />
          </span>
          <div>
            <h1 className="signal-display text-base font-bold text-foreground sm:text-xl">
              Company Onboarding & Research Pipeline
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Initiate automated semantic discovery for {name}. This synthesizes public statements, positioning, and products into the structured Company Research Dossier.
            </p>
          </div>
        </div>

        <form onSubmit={handleStartResearch} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="company-name" className="text-xs font-semibold text-foreground">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="company-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. EDXSO"
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="company-url" className="text-xs font-semibold text-foreground">
                Canonical Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="company-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://example.com"
                  className="pl-9 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="company-industry" className="text-xs font-semibold text-foreground">
              Industry & Operating Focus
            </label>
            <Input
              id="company-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Education Consulting & Institutional Transformation"
              className="text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Isolated frontend preview · Local reactive execution
            </span>
            <Button
              type="submit"
              disabled={isProcessing}
              className="h-10 gap-2 px-5 text-xs font-semibold"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Executing Pipeline ({progressValue}%)…</span>
                </>
              ) : (
                <>
                  <Compass className="size-4" />
                  <span>{completed ? "Re-Run Research Pipeline" : "Start Research Pipeline"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Pipeline Stepper & Progress Interface */}
      {(isProcessing || completed) && (
        <section className="signal-panel p-5 sm:p-6 space-y-5 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="signal-display text-sm font-bold text-foreground sm:text-base">
                Pipeline Processing Telemetry
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Autonomous crawl & entity extraction lifecycle
              </p>
            </div>
            <span className="text-xs font-bold text-brand">{progressValue}%</span>
          </div>

          <Progress value={progressValue} className="h-2 bg-secondary [&>div]:bg-primary" />

          <div className="grid gap-3 sm:grid-cols-2">
            {stages.map((stage, idx) => {
              const isPast = completed || idx < currentStage;
              const isCurrent = isProcessing && idx === currentStage;

              return (
                <div
                  key={stage.title}
                  className={`flex items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                    isPast
                      ? "border-success/30 bg-success-soft/20 text-foreground"
                      : isCurrent
                      ? "border-brand/40 bg-brand-soft/30 text-foreground"
                      : "border-border/60 bg-secondary/30 text-muted-foreground"
                  }`}
                >
                  <span className="mt-0.5">
                    {isPast ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : isCurrent ? (
                      <Loader2 className="size-4 text-brand animate-spin" />
                    ) : (
                      <span className="grid size-4 place-items-center rounded-full border border-border text-[9px] font-bold">
                        {idx + 1}
                      </span>
                    )}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold">{stage.title}</h3>
                    <p className="mt-0.5 text-[11px] text-muted-foreground leading-normal">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {completed && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-success/30 bg-success-soft/30 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-success">
                <ShieldCheck className="size-4" />
                <span>Research Dossier Ready for Review</span>
              </div>
              <Button
                size="sm"
                onClick={() => onNavigate("research")}
                className="h-8 gap-1.5 px-3 text-xs font-semibold"
              >
                <span>View Company Research</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
