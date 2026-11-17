import { StateGraph, START, END } from "@langchain/langgraph";
import { IntelligenceStateAnnotation, type IntelligenceStateType } from "./state.js";
import {
  researchNode,
  sourceDiscoveryNode,
  crawlNode,
  extractSignalsNode,
  rankSignalsNode,
  auditGroundingNode,
  refineSignalsNode,
  synthesizeBriefNode,
} from "./nodes.js";

function decideAfterAudit(state: IntelligenceStateType): "synthesize_brief" | "refine_signals" {
  if (state.groundingAudit?.isGrounded || (state.auditAttempts && state.auditAttempts >= 2)) {
    return "synthesize_brief";
  }
  return "refine_signals";
}

export function buildSignalStackGraph() {
  const workflow = new StateGraph(IntelligenceStateAnnotation)
    .addNode("research", researchNode)
    .addNode("source_discovery", sourceDiscoveryNode)
    .addNode("crawl", crawlNode)
    .addNode("extract_signals", extractSignalsNode)
    .addNode("rank_signals", rankSignalsNode)
    .addNode("audit_grounding", auditGroundingNode)
    .addNode("refine_signals", refineSignalsNode)
    .addNode("synthesize_brief", synthesizeBriefNode)

    .addEdge(START, "research")
    .addEdge("research", "source_discovery")
    .addEdge("source_discovery", "crawl")
    .addEdge("crawl", "extract_signals")
    .addEdge("extract_signals", "rank_signals")
    .addEdge("rank_signals", "audit_grounding")
    
    // Self-correcting conditional grounding loop
    .addConditionalEdges("audit_grounding", decideAfterAudit, {
      synthesize_brief: "synthesize_brief",
      refine_signals: "refine_signals",
    })
    .addEdge("refine_signals", "audit_grounding")
    .addEdge("synthesize_brief", END);

  return workflow.compile();
}

export const signalStackAgenticFlow = buildSignalStackGraph();
