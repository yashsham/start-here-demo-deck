import { z } from "zod";

export interface RankingWeights {
  companyRelevance: number;
  businessImpact: number;
  urgency: number;
  sourceCredibility: number;
  recency: number;
  novelty: number;
}

export interface DimensionalScore {
  dimension: keyof RankingWeights;
  score: number; // 0.0 to 1.0
  weight: number;
  explanation: string;
}

export interface SignalRankingResult {
  compositeScore: number; // 0.0000 to 1.0000
  dimensions: DimensionalScore[];
  summaryExplanation: string;
}

export class SignalRankingPipeline {
  private defaultWeights: RankingWeights = {
    companyRelevance: 0.25,
    businessImpact: 0.25,
    urgency: 0.20,
    sourceCredibility: 0.15,
    recency: 0.10,
    novelty: 0.05,
  };

  /**
   * Deterministic, explainable weighted scoring pipeline.
   * Keeps underlying dimensions separate so leadership can audit every rank.
   */
  rankSignal(
    metrics: {
      relevance: number;
      impact: number;
      urgency: number;
      credibility: number;
      publishedTimestamp: number;
      novelty: number;
    },
    customWeights?: Partial<RankingWeights>
  ): SignalRankingResult {
    const weights = { ...this.defaultWeights, ...customWeights };

    // Calculate recency decay: half-life of 7 days (604,800,000 ms)
    const ageMs = Math.max(0, Date.now() - metrics.publishedTimestamp);
    const recencyScore = Math.exp(-ageMs / (7 * 86400 * 1000));

    const dimensions: DimensionalScore[] = [
      {
        dimension: "companyRelevance",
        score: metrics.relevance,
        weight: weights.companyRelevance,
        explanation: `Alignment with core strategic priorities and monitored operations (${(metrics.relevance * 100).toFixed(0)}%).`,
      },
      {
        dimension: "businessImpact",
        score: metrics.impact,
        weight: weights.businessImpact,
        explanation: `Estimated magnitude of financial, operational, or legal effect (${(metrics.impact * 100).toFixed(0)}%).`,
      },
      {
        dimension: "urgency",
        score: metrics.urgency,
        weight: weights.urgency,
        explanation: `Time sensitivity for executive action (${(metrics.urgency * 100).toFixed(0)}%).`,
      },
      {
        dimension: "sourceCredibility",
        score: metrics.credibility,
        weight: weights.sourceCredibility,
        explanation: `Reputational tier and historical reliability of primary source (${(metrics.credibility * 100).toFixed(0)}%).`,
      },
      {
        dimension: "recency",
        score: recencyScore,
        weight: weights.recency,
        explanation: `Freshness score with exponential time-decay over 7-day half-life (${(recencyScore * 100).toFixed(0)}%).`,
      },
      {
        dimension: "novelty",
        score: metrics.novelty,
        weight: weights.novelty,
        explanation: `Uniqueness relative to previously cataloged signals (${(metrics.novelty * 100).toFixed(0)}%).`,
      },
    ];

    const compositeScore = dimensions.reduce((acc, d) => acc + d.score * d.weight, 0);

    return {
      compositeScore: Number(compositeScore.toFixed(4)),
      dimensions,
      summaryExplanation: `Composite priority score of ${(compositeScore * 100).toFixed(1)}/100 driven by ${
        metrics.impact > 0.8 ? "critical business impact" : "strategic relevance"
      }.`,
    };
  }
}
