import { z } from "zod";
import type { ILLMProvider, IModelRouter } from "../interfaces/provider.interface.js";

export const SourceCandidateSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  category: z.enum(["customers", "competitors", "market", "internal"]),
  sourceType: z.enum(["rss", "sec_filing", "regulatory", "news", "careers", "press", "web"]),
  relevanceReason: z.string(),
  specificityScore: z.number().min(0).max(1),
  recencyScore: z.number().min(0).max(1),
  credibilityScore: z.number().min(0).max(1),
  discoveryEvidence: z.string(),
});

export const SourceDiscoveryResultSchema = z.object({
  candidates: z.array(SourceCandidateSchema),
  discoveryQuery: z.string(),
});

export type SourceCandidate = z.infer<typeof SourceCandidateSchema>;
export type SourceDiscoveryResult = z.infer<typeof SourceDiscoveryResultSchema>;

export class SourceDiscoveryPipeline {
  constructor(private provider: ILLMProvider, private router: IModelRouter) {}

  async discoverSources(companyName: string, domain: string, industry: string): Promise<SourceDiscoveryResult> {
    const route = this.router.route("source_discovery");

    const systemPrompt = `You are a Principal Open-Source Intelligence (OSINT) Researcher.
Discover candidate monitoring sources across: Customers, Competitors, Market, and Internal.
STRICT INVARIANT:
NEVER generate fictional or fabricated URLs. Every URL must point to real public domains (e.g., official SEC EDGAR endpoints, regulatory gazettes, Bloomberg, Reuters, GitHub releases, verified company domains).`;

    const userPrompt = `Company: ${companyName}
Domain: ${domain}
Industry: ${industry}

Discover candidate sources for continuous executive signal monitoring.`;

    const res = await this.provider.generateStructured({
      model: route.model,
      systemPrompt,
      userPrompt,
      temperature: route.temperature,
      maxTokens: route.maxTokens,
      schema: SourceDiscoveryResultSchema,
      schemaName: "SourceDiscoveryResult",
    });

    return res.data;
  }
}
