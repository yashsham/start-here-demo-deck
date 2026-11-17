import { describe, it, expect } from "vitest";
import { HuggingFaceEmbeddingProvider } from "../../packages/ai/src/providers/embedding.provider.js";
import { GroundingValidator } from "../../packages/ai/src/validators/grounding.validator.js";
import { SignalRankingPipeline } from "../../packages/ai/src/pipelines/signal-ranking.pipeline.js";
import { ModelRouter } from "../../packages/ai/src/router/model.router.js";
import { loadAIConfig } from "../../packages/ai/src/config/ai-config.js";
import { INTERVIEW_TOPICS } from "../../packages/ai/src/pipelines/adaptive-interview.pipeline.js";

describe("Signal Stack AI Evaluation Suite", () => {
  const config = loadAIConfig();
  const embeddingProvider = new HuggingFaceEmbeddingProvider(config);
  const groundingValidator = new GroundingValidator();
  const rankingPipeline = new SignalRankingPipeline();
  const router = new ModelRouter(config);

  it("Model Router: Routes fast classification tasks to gpt-oss-20b", () => {
    const route = router.route("signal_classification");
    expect(route.model).toBe("openai/gpt-oss-20b");
    expect(route.temperature).toBe(0.1);
  });

  it("Model Router: Routes strategic reasoning tasks to gpt-oss-120b", () => {
    const route = router.route("monday_brief");
    expect(route.model).toBe("openai/gpt-oss-120b");
    expect(route.temperature).toBe(0.2);
  });

  it("Hugging Face Embedding: Generates normalized 384-dimensional embeddings", async () => {
    const textA = "Enterprise AI strategic decision engine";
    const textB = "Executive intelligence and decision support platform";
    const textC = "Agricultural tractor manufacturing and harvest machinery";

    const [vecA, vecB, vecC] = await embeddingProvider.generateEmbeddings([textA, textB, textC]);

    expect(vecA.length).toBe(384);
    expect(vecB.length).toBe(384);
    expect(vecC.length).toBe(384);

    const simAB = embeddingProvider.cosineSimilarity(vecA, vecB);
    const simAC = embeddingProvider.cosineSimilarity(vecA, vecC);

    // Semantically similar texts should score higher than unrelated texts
    expect(simAB).toBeGreaterThan(0.1);
    expect(simAB).toBeGreaterThan(simAC);
  });

  it("Grounding System: Accepts claims with verified evidence and detects ungrounded claims", () => {
    const evidenceMap = new Map<string, string>();
    evidenceMap.set(
      "sig_01",
      "EDXSO deployed zero-hallucination executive intelligence engine with deterministic citation trails for Fortune 500 leadership."
    );

    const validClaims = [
      {
        text: "EDXSO deployed zero-hallucination intelligence engine with citation trails",
        signalId: "sig_01",
      },
    ];

    const resultValid = groundingValidator.validateGrounding(validClaims, evidenceMap);
    expect(resultValid.grounded).toBe(true);
    expect(resultValid.score).toBe(1.0);
    expect(resultValid.unsupportedClaims.length).toBe(0);

    const invalidClaims = [
      {
        text: "EDXSO raised $150M in Series C funding led by Sequoia Capital",
        signalId: "sig_01",
      },
    ];

    const resultInvalid = groundingValidator.validateGrounding(invalidClaims, evidenceMap);
    expect(resultInvalid.grounded).toBe(false);
    expect(resultInvalid.unsupportedClaims.length).toBe(1);
  });

  it("Signal Ranking Pipeline: Produces transparent dimensional breakdown", () => {
    const ranking = rankingPipeline.rankSignal({
      relevance: 0.95,
      impact: 0.90,
      urgency: 0.85,
      credibility: 0.98,
      publishedTimestamp: Date.now() - 3600000, // 1 hour ago
      novelty: 0.80,
    });

    expect(ranking.compositeScore).toBeGreaterThan(0.85);
    expect(ranking.dimensions.length).toBe(6);
    const dimNames = ranking.dimensions.map((d) => d.dimension);
    expect(dimNames).toContain("companyRelevance");
    expect(dimNames).toContain("businessImpact");
    expect(dimNames).toContain("urgency");
    expect(dimNames).toContain("sourceCredibility");
    expect(dimNames).toContain("recency");
    expect(dimNames).toContain("novelty");
  });

  it("Adaptive Interview: Enforces exact 10 topic coverage invariant", () => {
    expect(INTERVIEW_TOPICS.length).toBe(10);
    expect(new Set(INTERVIEW_TOPICS).size).toBe(10);
    expect(INTERVIEW_TOPICS).toContain("business_lines");
    expect(INTERVIEW_TOPICS).toContain("revenue");
    expect(INTERVIEW_TOPICS).toContain("customer_segments");
    expect(INTERVIEW_TOPICS).toContain("customer_problems");
    expect(INTERVIEW_TOPICS).toContain("differentiation");
    expect(INTERVIEW_TOPICS).toContain("competitors");
    expect(INTERVIEW_TOPICS).toContain("market_changes");
    expect(INTERVIEW_TOPICS).toContain("business_risks");
    expect(INTERVIEW_TOPICS).toContain("growth_priorities");
    expect(INTERVIEW_TOPICS).toContain("important_founder_decisions");
  });
});
