import { z } from "zod";
import { BRIEF_CADENCES, BRIEF_STATUSES } from "../constants/index.js";

export const BriefCitationSchema = z.object({
  signal_id: z.string().uuid(),
  citation_index: z.number().int(),
  quote_snippet: z.string(),
  source_title: z.string(),
  source_url: z.string().url(),
});

export const BriefSectionSchema = z.object({
  heading: z.string(),
  content: z.string(),
  citation_indices: z.array(z.number().int()),
});

export const ExecutiveBriefSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  company_id: z.string().uuid(),
  title: z.string().min(1),
  cadence: z.enum(BRIEF_CADENCES),
  executive_summary: z.string().min(1),
  sections: z.array(BriefSectionSchema),
  key_takeaways: z.array(z.string()),
  recommended_actions: z.array(z.string()),
  confidence_metric: z.number().min(0).max(1),
  groundedness_score: z.number().min(0).max(1),
  status: z.enum(BRIEF_STATUSES).default("published"),
  citations: z.array(BriefCitationSchema).optional(),
  created_at: z.string().datetime(),
});

export const CreateExecutiveBriefSchema = ExecutiveBriefSchema.omit({
  id: true,
  created_at: true,
});

export type ExecutiveBrief = z.infer<typeof ExecutiveBriefSchema>;
export type BriefSection = z.infer<typeof BriefSectionSchema>;
export type BriefCitation = z.infer<typeof BriefCitationSchema>;
export type CreateExecutiveBriefInput = z.infer<typeof CreateExecutiveBriefSchema>;
