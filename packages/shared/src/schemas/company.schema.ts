import { z } from "zod";

export const CompanySchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  name: z.string().min(1, "Company name is required"),
  ticker: z.string().optional(),
  domain: z.string().min(1, "Domain is required"),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).default({}),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreateCompanySchema = CompanySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type Company = z.infer<typeof CompanySchema>;
export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
