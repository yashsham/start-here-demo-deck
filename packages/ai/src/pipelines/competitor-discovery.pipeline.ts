import { z } from "zod";
import type { ILLMProvider, IModelRouter } from "../interfaces/provider.interface.js";

export const CompetitorCandidateSchema = z.object({
  name: z.string(),
  domain: z.string(),
  competingProducts: z.array(z.string()),
  relationshipType: z.enum(["direct_competitor", "indirect_competitor", "substitute", "emerging_threat"]),
  overlapRationale: z.string(),
  estimatedThreatLevel: z.enum(["critical", "high", "medium", "low"]),
  publicEvidenceUrl: z.string(),
});

export const CompetitorDiscoveryResultSchema = z.object({
  competitors: z.array(CompetitorCandidateSchema).min(5).max(10),
  industryContext: z.string(),
});

export type CompetitorDiscoveryResult = z.infer<typeof CompetitorDiscoveryResultSchema>;

export class CompetitorDiscoveryPipeline {
  constructor(private provider: ILLMProvider, private router: IModelRouter) {}

  async discoverCompetitors(companyName: string, positioning: string, industry: string): Promise<CompetitorDiscoveryResult> {
    const route = this.router.route("competitor_discovery");

    const systemPrompt = `You are a Competitive Strategy Specialist.
Discover 5 to 10 genuine competitors or substitutes based on company positioning, product capabilities, and industry dynamics.
RULE: Never hardcode or copy arbitrary sample companies. Every competitor must include a factual rationale explaining how and why it competes.`;

    const userPrompt = `Target Company: ${companyName}
Industry: ${industry}
Positioning: ${positioning}

Identify 5 to 10 verified competitors or substitutes.`;

    const res = await this.provider.generateStructured({
      model: route.model,
      systemPrompt,
      userPrompt,
      temperature: route.temperature,
      maxTokens: route.maxTokens,
      schema: CompetitorDiscoveryResultSchema,
      schemaName: "CompetitorDiscoveryResult",
    });

    return res.data;
  }
}
