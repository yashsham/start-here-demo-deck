import { describe, it, expect } from "vitest";
import { signalStackAgenticFlow } from "../../packages/ai/src/agentic/graph.js";

describe("Signal Stack LangGraph Agentic Workflow", () => {
  it("Executes full multi-step agentic cycle with self-correcting grounding loop", async () => {
    const finalState = await signalStackAgenticFlow.invoke({
      companyName: "EDXSO Technologies",
      websiteUrl: "https://www.edxso.com",
      industry: "Enterprise AI Systems",
    });

    // 1. Verify Company Understanding
    expect(finalState.researchProfile).toBeDefined();
    expect(finalState.researchProfile?.companyName).toBe("EDXSO Technologies");
    expect(finalState.researchProfile?.productsServices.length).toBeGreaterThan(0);

    // 2. Verify Candidate Sources
    expect(finalState.candidateSources.length).toBeGreaterThan(0);
    expect(finalState.candidateSources[0].url).toBeDefined();

    // 3. Verify Crawled Snapshots & Deduplication
    expect(finalState.crawledSnapshots.length).toBeGreaterThan(0);
    expect(finalState.crawledSnapshots[0].contentHash).toBeDefined();

    // 4. Verify Classified & Ranked Signals
    expect(finalState.rawSignals.length).toBeGreaterThan(0);
    expect(finalState.rankedSignals.length).toBeGreaterThan(0);
    expect(finalState.rankedSignals[0].rankingScore).toBeGreaterThan(0.7);

    // 5. Verify Grounding Audit Evaluation
    expect(finalState.groundingAudit).toBeDefined();
    expect(finalState.groundingAudit?.isGrounded).toBe(true);
    expect(finalState.auditAttempts).toBeGreaterThanOrEqual(1);

    // 6. Verify Synthesized Monday Morning Brief
    expect(finalState.executiveBrief).toBeDefined();
    expect(finalState.executiveBrief?.section1_executiveSummary.top5Developments.length).toBe(5);
    expect(finalState.executiveBrief?.section8_evidenceBackedOpportunities.opportunities.length).toBeGreaterThan(0);

    // 7. Verify Execution Trace Logs
    expect(finalState.executionLogs.length).toBeGreaterThan(5);
  });
});
