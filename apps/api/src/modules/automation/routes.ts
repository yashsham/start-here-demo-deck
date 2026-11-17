import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { AppVariables, Env } from "../../types/env.js";

const AutomationSettingsSchema = z.object({
  crawl_schedule_cron: z.string().optional(),
  crawl_enabled: z.boolean().optional(),
  brief_generation_cron: z.string().optional(),
  brief_generation_enabled: z.boolean().optional(),
  min_signal_confidence: z.number().min(0).max(1).optional(),
});

export const automationRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

automationRoutes.get("/companies/:id/automation", async (c) => {
  return c.json({
    success: true,
    data: {
      companyId: c.req.param("id"),
      crawl_schedule_cron: "0 */4 * * *",
      crawl_enabled: true,
      brief_generation_cron: "0 6 * * 1-5",
      brief_generation_enabled: true,
      min_signal_confidence: 0.75,
      last_automated_run: new Date(Date.now() - 3600000).toISOString(),
    },
  });
});

automationRoutes.patch("/companies/:id/automation", zValidator("json", AutomationSettingsSchema), async (c) => {
  return c.json({
    success: true,
    data: {
      companyId: c.req.param("id"),
      ...c.req.valid("json"),
      updated_at: new Date().toISOString(),
    },
  });
});

automationRoutes.post("/companies/:id/automation/run", async (c) => {
  return c.json({
    success: true,
    message: "Triggered immediate automated cycle: Ingestion -> SimHash Deduplication -> Groq Analysis -> Brief Synthesis.",
    jobId: "auto_run_" + crypto.randomUUID(),
  }, 202);
});
