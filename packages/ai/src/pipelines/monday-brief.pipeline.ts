import { z } from "zod";
import type { ILLMProvider, IModelRouter } from "../interfaces/provider.interface.js";

export const MondayBriefSchema = z.object({
  title: z.string(),
  cadence: z.literal("weekly"),
  // Exact 10 Sections
  section1_executiveSummary: z.object({
    heading: z.literal("1. Executive Summary: Top 5 Critical Developments"),
    top5Developments: z.array(z.string()).length(5),
    overview: z.string(),
  }),
  section2_marketDynamics: z.object({
    heading: z.literal("2. Market Dynamics & Macro Shifts"),
    content: z.string(),
    citations: z.array(z.number()),
  }),
  section3_customerDemand: z.object({
    heading: z.literal("3. Customer & Demand Signals"),
    content: z.string(),
    citations: z.array(z.number()),
  }),
  section4_competitorMoves: z.object({
    heading: z.literal("4. Competitor Moves & Strategic Shifts"),
    content: z.string(),
    citations: z.array(z.number()),
  }),
  section5_regulatoryRadar: z.object({
    heading: z.literal("5. Regulatory & Compliance Radar"),
    content: z.string(),
    citations: z.array(z.number()),
  }),
  section6_productTechnology: z.object({
    heading: z.literal("6. Product & Technology Evolution"),
    content: z.string(),
    citations: z.array(z.number()),
  }),
  section7_risksThreats: z.object({
    heading: z.literal("7. Risks & Threats Assessment"),
    content: z.string(),
    criticalRisks: z.array(z.string()),
  }),
  section8_evidenceBackedOpportunities: z.object({
    heading: z.literal("8. Evidence-Backed Opportunities"),
    hasSufficientVerifiedOpportunities: z.boolean(),
    opportunities: z.array(z.object({
      title: z.string(),
      evidenceUrl: z.string(),
      rationale: z.string(),
    })),
    honestAssessmentNote: z.string(),
  }),
  section9_prioritizedActions: z.object({
    heading: z.literal("9. Prioritised Recommended Actions"),
    actions: z.array(z.object({
      priority: z.enum(["critical", "high", "medium"]),
      actionText: z.string(),
      ownerFunction: z.string(),
    })),
  }),
  section10_whatToWatchAppendix: z.object({
    heading: z.literal("10. What to Watch Next & Source Appendix"),
    upcomingMilestones: z.array(z.string()),
    sourcesAppendix: z.array(z.object({
      citationIndex: z.number(),
      sourceTitle: z.string(),
      sourceUrl: z.string(),
      verbatimQuote: z.string(),
    })),
  }),
  groundednessScore: z.number().min(0).max(1),
});

export type MondayBrief = z.infer<typeof MondayBriefSchema>;

export class MondayBriefPipeline {
  constructor(private provider: ILLMProvider, private router: IModelRouter) {}

  async generateBrief(params: {
    companyName: string;
    verifiedSignals: Array<{
      id: string;
      title: string;
      category: string;
      evidenceSummary: string;
      verbatimSnippet: string;
      sourceUrl: string;
      rankingScore: number;
    }>;
  }): Promise<MondayBrief> {
    const route = this.router.route("monday_brief");

    const systemPrompt = `You are the Executive Chief of Staff generating the authoritative Monday Morning Brief.
CRITICAL INVARIANTS:
1. Generate the EXACT 10 sections specified in the schema.
2. The Executive Summary MUST feature exactly the 5 most important developments.
3. For Section 8 (Evidence-Backed Opportunities):
   If there are at least 3 genuine, verified opportunities supported by the evidence, include them.
   IF THERE ARE FEWER THAN 3 VERIFIED OPPORTUNITIES, STATE THAT HONESTLY. NEVER FABRICATE OPPORTUNITIES.
4. Ground every single claim with a verifiable citation index mapped to the source appendix.`;

    const userPrompt = `Target Company: ${params.companyName}
Verified Signals Input:
${JSON.stringify(params.verifiedSignals, null, 2)}

Generate the complete 10-section Monday Morning Brief.`;

    const res = await this.provider.generateStructured({
      model: route.model,
      systemPrompt,
      userPrompt,
      temperature: route.temperature,
      maxTokens: route.maxTokens,
      schema: MondayBriefSchema,
      schemaName: "MondayBrief",
    });

    return res.data;
  }
}
