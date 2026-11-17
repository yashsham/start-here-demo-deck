import { z } from "zod";
import { SIGNAL_CATEGORIES, IMPACT_LEVELS } from "../constants/index.js";

export const SignalSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  company_id: z.string().uuid(),
  source_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1, "Signal title is required"),
  summary: z.string().min(1, "Signal summary is required"),
  raw_content: z.string().min(1),
  category: z.enum(SIGNAL_CATEGORIES),
  impact_level: z.enum(IMPACT_LEVELS),
  confidence_score: z.number().min(0).max(1),
  simhash: z.string(), // BigInt serialized as string for JSON transport
  source_url: z.string().url(),
  published_at: z.string().datetime(),
  embedding: z.array(z.number()).optional(),
  created_at: z.string().datetime(),
});

export const CreateSignalSchema = SignalSchema.omit({
  id: true,
  created_at: true,
});

export type Signal = z.infer<typeof SignalSchema>;
export type CreateSignalInput = z.infer<typeof CreateSignalSchema>;
