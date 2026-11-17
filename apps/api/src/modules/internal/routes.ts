import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { AppVariables, Env } from "../../types/env.js";
import { NotFoundError } from "../../core/errors.js";

export const internalRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

internalRoutes.post("/companies/:id/uploads", async (c) => {
  const companyId = c.req.param("id");
  const uploadId = "upl_" + crypto.randomUUID();
  return c.json({
    success: true,
    data: {
      uploadId,
      companyId,
      status: "processing",
      filename: "strategy_roadmap_2026.pdf",
      message: "Document uploaded. Semantic chunking and vector indexing initiated.",
    },
  }, 202);
});

internalRoutes.get("/companies/:id/uploads", async (c) => {
  const companyId = c.req.param("id");
  return c.json({
    success: true,
    data: [
      {
        id: "upl_demo_01",
        companyId,
        filename: "strategic_imperatives_h1.pdf",
        status: "indexed",
        chunk_count: 24,
        uploaded_at: new Date().toISOString(),
      },
    ],
  });
});

internalRoutes.get("/uploads/:id/status", async (c) => {
  const id = c.req.param("id");
  return c.json({
    success: true,
    data: {
      uploadId: id,
      status: "indexed",
      progress: 100,
      chunks_embedded: 24,
    },
  });
});
