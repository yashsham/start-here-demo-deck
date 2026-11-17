import { z } from "zod";
import type { ILLMProvider, IModelRouter } from "../interfaces/provider.interface.js";

export const StrategicAnalysisSchema = z.object({
  whatHappened: z.string(),
  when: z.string(),
  whereIsEvidence: z.object({
    sourceUrl: z.string(),
    verbatimSnippet: z.string(),
  }),
  isVerified: z.boolean(),
  whyItMatters: z.string(),
  affectedBusinessArea: z.string(),
  potentialImpact: z.string(),
  howUrgent: z.enum(["critical", "high", "medium", "low"]),
  recommendedLeadershipAction: z.string(),
});

export type StrategicAnalysis = z.infer<typeof StrategicAnalysisSchema>;

export class StrategicAnalysisPipeline {
  constructor(private provider: ILLMProvider, private router: IModelRouter) {}

  async analyzeSignal(signalTitle: string, evidenceSnippet: string, sourceUrl: string, companyContext: string): Promise<StrategicAnalysis> {
    const route = this.router.route("strategic_analysis");

    const systemPrompt = `You are a Principal Strategic Intelligence Advisor to the CEO.
Answer the 9 core strategic questions for this signal:
1. What happened?
2. When?
3. Where is the evidence?
4. Is it verified?
5. Why does it matter?
6. Which business area is affected?
7. What is the potential impact?
8. How urgent is it?
9. What action should leadership consider?

ARCHITECTURAL MANDATE:
Keep the original evidence strictly separate from strategic interpretation.`;

    const userPrompt = `Target Company: ${companyContext}
Signal Title: ${signalTitle}
Evidence Snippet: "${evidenceSnippet}"
Source: ${sourceUrl}

Perform the 9-point strategic analysis.`;

    const res = await this.provider.generateStructured({
      model: route.model,
      systemPrompt,
      userPrompt,
      temperature: route.temperature,
      maxTokens: route.maxTokens,
      schema: StrategicAnalysisSchema,
      schemaName: "StrategicAnalysis",
    });

    return res.data;
  }
}
