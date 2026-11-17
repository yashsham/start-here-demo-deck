import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { AppVariables, Env } from "../../types/env.js";
import { NotFoundError } from "../../core/errors.js";

export const CreateCompanySchema = z.object({
  name: z.string().min(1),
  ticker: z.string().optional(),
  domain: z.string().min(1),
  industry: z.string().min(1),
  description: z.string().optional(),
  website_url: z.string().url().optional(),
});

export const UpdateCompanySchema = CreateCompanySchema.partial();

export interface CompanyEntity {
  id: string;
  organization_id: string;
  name: string;
  ticker?: string | undefined;
  domain: string;
  industry: string;
  description?: string | undefined;
  website_url?: string | undefined;
  created_at: string;
  updated_at: string;
}

// In-memory backing store for demo/sandbox with fallback
const companyStore = new Map<string, CompanyEntity>();
companyStore.set("c0000000-0000-0000-0000-000000000001", {
  id: "c0000000-0000-0000-0000-000000000001",
  organization_id: "a0000000-0000-0000-0000-000000000001",
  name: "EDXSO Technologies",
  ticker: "EDX",
  domain: "edxso.com",
  industry: "Enterprise AI Systems",
  description: "Enterprise strategic intelligence and executive briefing platform.",
  website_url: "https://www.edxso.com",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const companyRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

companyRoutes.get("/", async (c) => {
  const orgId = c.get("orgId");
  const list = Array.from(companyStore.values()).filter((co) => co.organization_id === orgId);
  return c.json({ success: true, data: list, count: list.length });
});

companyRoutes.post("/", zValidator("json", CreateCompanySchema), async (c) => {
  const payload = c.req.valid("json");
  const id = crypto.randomUUID();
  const company: CompanyEntity = {
    id,
    organization_id: c.get("orgId"),
    name: payload.name,
    domain: payload.domain,
    industry: payload.industry,
    ticker: payload.ticker,
    description: payload.description,
    website_url: payload.website_url,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  companyStore.set(id, company);
  return c.json({ success: true, data: company }, 201);
});

companyRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const company = companyStore.get(id);
  if (!company || company.organization_id !== c.get("orgId")) {
    throw new NotFoundError("Company", id);
  }
  return c.json({ success: true, data: company });
});

companyRoutes.patch("/:id", zValidator("json", UpdateCompanySchema), async (c) => {
  const id = c.req.param("id");
  const company = companyStore.get(id);
  if (!company || company.organization_id !== c.get("orgId")) {
    throw new NotFoundError("Company", id);
  }
  const payload = c.req.valid("json");
  const updated: CompanyEntity = {
    ...company,
    name: payload.name ?? company.name,
    domain: payload.domain ?? company.domain,
    industry: payload.industry ?? company.industry,
    ticker: payload.ticker !== undefined ? payload.ticker : company.ticker,
    description: payload.description !== undefined ? payload.description : company.description,
    website_url: payload.website_url !== undefined ? payload.website_url : company.website_url,
    updated_at: new Date().toISOString(),
  };
  companyStore.set(id, updated);
  return c.json({ success: true, data: updated });
});

companyRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const company = companyStore.get(id);
  if (!company || company.organization_id !== c.get("orgId")) {
    throw new NotFoundError("Company", id);
  }
  companyStore.delete(id);
  return c.json({ success: true, message: `Company ${id} deleted successfully` });
});
