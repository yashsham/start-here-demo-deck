export const SIGNAL_CATEGORIES = [
  "strategic_moves",
  "regulatory_compliance",
  "financial_health",
  "leadership_org",
  "product_tech",
  "market_competitors",
  "risk_litigation",
] as const;

export type SignalCategory = (typeof SIGNAL_CATEGORIES)[number];

export const IMPACT_LEVELS = ["critical", "high", "medium", "low"] as const;
export type ImpactLevel = (typeof IMPACT_LEVELS)[number];

export const SOURCE_TYPES = [
  "rss",
  "sec_filing",
  "regulatory",
  "news",
  "careers",
  "press",
  "web",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const SOURCE_STATUSES = ["active", "degraded", "blocked", "rate_limited", "pending"] as const;
export type SourceStatus = (typeof SOURCE_STATUSES)[number];

export const BRIEF_CADENCES = ["daily", "weekly", "event_driven"] as const;
export type BriefCadence = (typeof BRIEF_CADENCES)[number];

export const BRIEF_STATUSES = ["draft", "published", "archived"] as const;
export type BriefStatus = (typeof BRIEF_STATUSES)[number];
