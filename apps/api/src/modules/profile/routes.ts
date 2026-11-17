import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { AppVariables, Env } from "../../types/env.js";

const UpdateProfileSchema = z.object({
  summary: z.string().optional(),
  strategic_priorities: z.array(z.string()).optional(),
  known_vulnerabilities: z.array(z.string()).optional(),
});

export const profileRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

profileRoutes.get("/:id/profile", async (c) => {
  const companyId = c.req.param("id");
  return c.json({
    success: true,
    data: {
      companyId,
      summary: "High-growth enterprise intelligence platform powering executive risk oversight.",
      strategic_priorities: [
        "Autonomous Multi-Source Signal Tracking",
        "Zero-Hallucination Verified Citation Briefings",
        "Continuous Distributed Ingestion & Invariant Enforcement",
      ],
      known_vulnerabilities: [
        "Fast-moving AI regulatory shifts across EU and US jurisdictions",
      ],
      current_version: 2,
      last_synthesized_at: new Date().toISOString(),
    },
  });
});

profileRoutes.patch("/:id/profile", zValidator("json", UpdateProfileSchema), async (c) => {
  const companyId = c.req.param("id");
  const payload = c.req.valid("json");
  return c.json({
    success: true,
    data: {
      companyId,
      ...payload,
      version: 3,
      updated_at: new Date().toISOString(),
    },
  });
});

profileRoutes.get("/:id/profile/versions", async (c) => {
  const companyId = c.req.param("id");
  return c.json({
    success: true,
    data: [
      { version: 2, created_at: new Date().toISOString(), change_summary: "Calibrated with CEO priorities" },
      { version: 1, created_at: new Date(Date.now() - 86400000).toISOString(), change_summary: "Initial synthesis" },
    ],
  });
});
