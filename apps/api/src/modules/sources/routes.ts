import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { AppVariables, Env } from "../../types/env.js";
import { NotFoundError } from "../../core/errors.js";

const CreateSourceSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  source_type: z.enum(["rss", "sec_filing", "regulatory", "news", "careers", "press", "web"]),
  category: z.string().min(1),
  inclusion_reason: z.string().min(1),
  crawl_interval_minutes: z.number().int().min(5).default(60),
});

interface SourceRecord {
  id: string;
  company_id: string;
  name: string;
  url: string;
  source_type: string;
  approval_status: "pending" | "approved" | "rejected";
  robots_status: string;
  credibility_score: number;
  last_checked_at?: string;
}

const sourceStore = new Map<string, SourceRecord>();
sourceStore.set("src_edx_01", {
  id: "src_edx_01",
  company_id: "c0000000-0000-0000-0000-000000000001",
  name: "EDXSO Official Releases",
  url: "https://www.edxso.com",
  source_type: "press",
  approval_status: "approved",
  robots_status: "allowed",
  credibility_score: 0.99,
  last_checked_at: new Date().toISOString(),
});

export const sourceRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

sourceRoutes.get("/companies/:id/sources", async (c) => {
  const companyId = c.req.param("id");
  const list = Array.from(sourceStore.values()).filter((s) => s.company_id === companyId);
  return c.json({ success: true, data: list, count: list.length });
});

sourceRoutes.post("/companies/:id/sources", zValidator("json", CreateSourceSchema), async (c) => {
  const companyId = c.req.param("id");
  const payload = c.req.valid("json");
  const id = "src_" + crypto.randomUUID();
  const source: SourceRecord = {
    id,
    company_id: companyId,
    name: payload.name,
    url: payload.url,
    source_type: payload.source_type,
    approval_status: "pending",
    robots_status: "allowed",
    credibility_score: 0.85,
    last_checked_at: new Date().toISOString(),
  };
  sourceStore.set(id, source);
  return c.json({ success: true, data: source }, 201);
});

sourceRoutes.patch("/sources/:id", zValidator("json", CreateSourceSchema.partial()), async (c) => {
  const id = c.req.param("id");
  const source = sourceStore.get(id);
  if (!source) throw new NotFoundError("Source", id);
  const payload = c.req.valid("json");
  const updated: SourceRecord = {
    ...source,
    name: payload.name ?? source.name,
    url: payload.url ?? source.url,
    source_type: payload.source_type ?? source.source_type,
    last_checked_at: new Date().toISOString(),
  };
  sourceStore.set(id, updated);
  return c.json({ success: true, data: updated });
});

sourceRoutes.post("/sources/:id/approve", async (c) => {
  const id = c.req.param("id");
  const source = sourceStore.get(id);
  if (!source) throw new NotFoundError("Source", id);
  source.approval_status = "approved";
  return c.json({ success: true, message: `Source ${id} approved`, data: source });
});

sourceRoutes.post("/sources/:id/reject", async (c) => {
  const id = c.req.param("id");
  const source = sourceStore.get(id);
  if (!source) throw new NotFoundError("Source", id);
  source.approval_status = "rejected";
  return c.json({ success: true, message: `Source ${id} rejected`, data: source });
});

sourceRoutes.get("/sources/:id/history", async (c) => {
  const id = c.req.param("id");
  return c.json({
    success: true,
    data: [
      { checked_at: new Date().toISOString(), http_status: 200, latency_ms: 110, error: null },
      { checked_at: new Date(Date.now() - 3600000).toISOString(), http_status: 200, latency_ms: 98, error: null },
    ],
  });
});
