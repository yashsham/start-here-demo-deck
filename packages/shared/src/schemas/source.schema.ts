import { z } from "zod";
import { SOURCE_TYPES, SOURCE_STATUSES } from "../constants/index.js";

export const SourceSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  company_id: z.string().uuid(),
  name: z.string().min(1, "Source name is required"),
  url: z.string().url("Valid URL required"),
  source_type: z.enum(SOURCE_TYPES),
  status: z.enum(SOURCE_STATUSES).default("active"),
  check_interval_minutes: z.number().int().min(5).default(60),
  last_crawled_at: z.string().datetime().nullable().optional(),
  robots_allowed: z.boolean().default(true),
  etag: z.string().nullable().optional(),
  last_modified: z.string().nullable().optional(),
  created_at: z.string().datetime(),
});

export const CreateSourceSchema = SourceSchema.omit({
  id: true,
  created_at: true,
  last_crawled_at: true,
  etag: true,
  last_modified: true,
});

export type Source = z.infer<typeof SourceSchema>;
export type CreateSourceInput = z.infer<typeof CreateSourceSchema>;
