import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { AppVariables, Env } from "../../types/env.js";

const SessionSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

authRoutes.post("/session", zValidator("json", SessionSchema), async (c) => {
  const { email } = c.req.valid("json");
  return c.json({
    success: true,
    data: {
      token: "jwt_token_" + crypto.randomUUID(),
      user: {
        id: c.get("userId") || "u0000000-0000-0000-0000-000000000001",
        email,
        full_name: "Executive Analyst",
        organization_id: c.get("orgId"),
      },
    },
  });
});

authRoutes.get("/me", async (c) => {
  return c.json({
    success: true,
    data: {
      id: c.get("userId") || "u0000000-0000-0000-0000-000000000001",
      email: "analyst@edxso.com",
      full_name: "Lead Intelligence Analyst",
      organization_id: c.get("orgId"),
      role: "owner",
    },
  });
});
