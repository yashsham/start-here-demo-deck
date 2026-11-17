import { z } from "zod";
import type { ILLMProvider, IModelRouter } from "../interfaces/provider.interface.js";

export const INTERVIEW_TOPICS = [
  "business_lines",
  "revenue",
  "customer_segments",
  "customer_problems",
  "differentiation",
  "competitors",
  "market_changes",
  "business_risks",
  "growth_priorities",
  "important_founder_decisions",
] as const;

export type InterviewTopic = (typeof INTERVIEW_TOPICS)[number];

export const NextQuestionSchema = z.object({
  questionId: z.string(),
  topic: z.enum(INTERVIEW_TOPICS),
  questionText: z.string(),
  rationale: z.string(),
  isFollowUp: z.boolean(),
  coverageStatus: z.object({
    coveredTopicsCount: z.number().int(),
    totalRequiredTopics: z.literal(10),
    uncoveredTopics: z.array(z.string()),
  }),
});

export type NextQuestion = z.infer<typeof NextQuestionSchema>;

export class AdaptiveInterviewPipeline {
  constructor(private provider: ILLMProvider, private router: IModelRouter) {}

  async generateNextQuestion(params: {
    companyName: string;
    profileSummary: string;
    answeredTurns: Array<{ topic: string; question: string; answer?: string; skipped?: boolean }>;
  }): Promise<NextQuestion> {
    const coveredTopics = new Set(params.answeredTurns.map((t) => t.topic));
    const uncoveredTopics = INTERVIEW_TOPICS.filter((t) => !coveredTopics.has(t));

    const route = this.router.route("adaptive_interview");

    const systemPrompt = `You are an Executive Strategic Advisor calibrating enterprise intelligence priorities with the CEO.
RULES:
1. Generate exactly one focused question at a time.
2. Do not repeat previously asked questions.
3. If an answer warrants deeper exploration, generate a contextual follow-up while maintaining progress across the 10 required topic areas.
4. If a topic is skipped for confidentiality, gracefully advance to the next priority topic.`;

    const userPrompt = `Company: ${params.companyName}
Summary: ${params.profileSummary}
Previously Answered Turns:
${JSON.stringify(params.answeredTurns, null, 2)}

Uncovered Topics Remaining: ${uncoveredTopics.join(", ")}

Generate the next strategic calibration question.`;

    const res = await this.provider.generateStructured({
      model: route.model,
      systemPrompt,
      userPrompt,
      temperature: route.temperature,
      maxTokens: route.maxTokens,
      schema: NextQuestionSchema,
      schemaName: "NextQuestion",
    });

    return res.data;
  }
}
