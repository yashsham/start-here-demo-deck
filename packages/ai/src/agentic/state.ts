import { Annotation } from "@langchain/langgraph";
import type { CompanyResearchProfile } from "../pipelines/company-understanding.pipeline.js";
import type { SourceCandidate } from "../pipelines/source-discovery.pipeline.js";
import type { ExtractedSignal } from "../pipelines/signal-classification.pipeline.js";
import type { MondayBrief } from "../pipelines/monday-brief.pipeline.js";

export interface CrawledSnapshotData {
  sourceId: string;
  url: string;
  title?: string;
  cleanText: string;
  contentHash: string;
  simhash: string;
}

export interface RankedSignalData extends ExtractedSignal {
  rankingScore: number;
  dimensionalRationale: string;
}

export interface GroundingAuditData {
  isGrounded: boolean;
  score: number;
  unsupportedClaims: string[];
}

export const IntelligenceStateAnnotation = Annotation.Root({
  // Input parameters
  companyName: Annotation<string>(),
  websiteUrl: Annotation<string>(),
  industry: Annotation<string>(),

  // Intermediate pipeline artifacts
  researchProfile: Annotation<CompanyResearchProfile | undefined>(),
  candidateSources: Annotation<SourceCandidate[]>({
    reducer: (curr, update) => update ?? curr,
    default: () => [],
  }),
  crawledSnapshots: Annotation<CrawledSnapshotData[]>({
    reducer: (curr, update) => update ?? curr,
    default: () => [],
  }),
  rawSignals: Annotation<ExtractedSignal[]>({
    reducer: (curr, update) => update ?? curr,
    default: () => [],
  }),
  rankedSignals: Annotation<RankedSignalData[]>({
    reducer: (curr, update) => update ?? curr,
    default: () => [],
  }),
  groundingAudit: Annotation<GroundingAuditData | undefined>(),
  auditAttempts: Annotation<number>({
    reducer: (curr, update) => (update !== undefined ? update : curr),
    default: () => 0,
  }),

  // Final deliverables
  executiveBrief: Annotation<MondayBrief | undefined>(),
  executionLogs: Annotation<string[]>({
    reducer: (curr, update) => (update ? [...curr, ...update] : curr),
    default: () => [],
  }),
});

export type IntelligenceStateType = typeof IntelligenceStateAnnotation.State;
