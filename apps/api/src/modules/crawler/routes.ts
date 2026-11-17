import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { AppVariables, Env } from "../../types/env.js";
import { NotFoundError } from "../../core/errors.js";

export const crawlerRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

crawlerRoutes.post("/companies/:id/crawl", async (c) => {
  const companyId = c.req.param("id");
  const crawlRunId = "crawl_" + crypto.randomUUID();

  // Enqueue async crawl task via Cloudflare Queue
  if (c.env?.INTELLIGENCE_QUEUE) {
    await c.env.INTELLIGENCE_QUEUE.send({
      type: "EXECUTE_CRAWL",
      companyId,
      crawlRunId,
      orgId: c.get("orgId"),
    });
  }

  return c.json({
    success: true,
    data: {
      crawlRunId,
      companyId,
      status: "queued",
      message: "Crawl execution scheduled asynchronously across polite worker pool.",
    },
  }, 202);
});

crawlerRoutes.get("/companies/:id/crawl-runs", async (c) => {
  const companyId = c.req.param("id");
  return c.json({
    success: true,
    data: [
      {
        id: "crawl_demo_01",
        companyId,
        status: "completed",
        total_sources: 12,
        successful_sources: 12,
        failed_sources: 0,
        started_at: new Date(Date.now() - 1800000).toISOString(),
        completed_at: new Date(Date.now() - 1740000).toISOString(),
      },
    ],
  });
});

crawlerRoutes.get("/crawl-runs/:id", async (c) => {
  const id = c.req.param("id");
  return c.json({
    success: true,
    data: {
      id,
      status: "completed",
      total_sources: 12,
      successful_sources: 12,
      failed_sources: 0,
      snapshots_captured: 12,
    },
  });
});
