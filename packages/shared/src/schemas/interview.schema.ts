import { z } from "zod";
import { SIGNAL_CATEGORIES } from "../constants/index.js";

export const InterviewTurnSchema = z.object({
  role: z.enum(["assistant", "user"]),
  content: z.string(),
  timestamp: z.string().datetime(),
});

export const CategoryPrioritySchema = z.object({
  category: z.enum(SIGNAL_CATEGORIES),
  weight: z.number().min(0).max(1),
  focus_topics: z.array(z.string()),
});

export const InterviewCalibrationSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  company_id: z.string().uuid(),
  turns: z.array(InterviewTurnSchema),
  calibrated_priorities: z.array(CategoryPrioritySchema),
  status: z.enum(["active", "calibrated", "archived"]).default("active"),
  created_at: z.string().datetime(),
});

export type InterviewTurn = z.infer<typeof InterviewTurnSchema>;
export type CategoryPriority = z.infer<typeof CategoryPrioritySchema>;
export type InterviewCalibration = z.infer<typeof InterviewCalibrationSchema>;
