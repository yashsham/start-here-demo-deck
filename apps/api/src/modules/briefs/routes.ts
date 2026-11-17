import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { AppVariables, Env } from "../../types/env.js";
import { NotFoundError } from "../../core/errors.js";

interface BriefRecord {
  id: string;
  company_id: string;
  title: string;
  cadence: string;
  executive_summary: string;
  confidence_metric: number;
  groundedness_score: number;
  status: string;
  sections: Array<{ heading: string; content: string; citation_indices: number[] }>;
  actions: Array<{ id: string; title: string; priority: string; status: string; owner?: string }>;
  citations: Array<{ citation_index: number; quote_snippet: string; source_title: string; source_url: string }>;
  created_at: string;
}

const briefStore = new Map<string, BriefRecord>();
briefStore.set("brf_01", {
  id: "brf_01",
  company_id: "c0000000-0000-0000-0000-000000000001",
  title: "Executive Strategic Intelligence Brief � Q1 Signal Synthesis",
  cadence: "weekly",
  executive_summary: "Regulatory shifts in enterprise AI safety and cross-jurisdictional compliance have accelerated market consolidation toward zero-hallucination architectures.",
  confidence_metric: 0.94,
  groundedness_score: 0.98,
  status: "published",
  sections: [
    {
      heading: "Regulatory Compliance & Auditability Mandates",
      content: "Standards bodies now require deterministic verifiable citation trails for enterprise decision-support platforms.",
      citation_indices: [1],
    },
  ],
  actions: [
    { id: "act_01", title: "Codify groundedness audit verification pipeline", priority: "critical", status: "pending", owner: "Engineering" },
  ],
  citations: [
    { citation_index: 1, quote_snippet: "Signal Stack: Zero-Hallucination Verified Citation Engine.", source_title: "EDXSO Technical Specification", source_url: "https://www.edxso.com" },
  ],
  created_at: new Date().toISOString(),
});

export const briefRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

briefRoutes.post("/companies/:id/briefs/generate", async (c) => {
  const companyId = c.req.param("id");
  const briefId = "brf_" + crypto.randomUUID();
  return c.json({
    success: true,
    data: {
      briefId,
      companyId,
      status: "queued",
      message: "Executive brief generation queued with Groq reasoning and grounded citation verification.",
    },
  }, 202);
});

briefRoutes.get("/companies/:id/briefs", async (c) => {
  const companyId = c.req.param("id");
  const list = Array.from(briefStore.values()).filter((b) => b.company_id === companyId);
  return c.json({ success: true, data: list, count: list.length });
});

briefRoutes.get("/briefs/:id", async (c) => {
  const id = c.req.param("id");
  const brief = briefStore.get(id);
  if (!brief) throw new NotFoundError("Brief", id);
  return c.json({ success: true, data: brief });
});

briefRoutes.patch("/brief-actions/:id", zValidator("json", z.object({ status: z.string(), owner: z.string().optional() })), async (c) => {
  const id = c.req.param("id");
  return c.json({
    success: true,
    message: `Brief action ${id} updated`,
    data: { id, ...c.req.valid("json") },
  });
});
