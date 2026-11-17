import type { MiddlewareHandler } from "hono";
import type { AppVariables, Env } from "../../types/env.js";
import { UnauthorizedError } from "../errors.js";

export const authMiddleware: MiddlewareHandler<{ Bindings: Env; Variables: AppVariables }> = async (c, next) => {
  const orgHeader = c.req.header("x-organization-id");
  const authHeader = c.req.header("authorization");

  // In demo / prototype mode with publishable keys, default to demo org if none supplied
  const defaultOrgId = "a0000000-0000-0000-0000-000000000001";
  c.set("orgId", orgHeader || defaultOrgId);
  c.set("userId", "u0000000-0000-0000-0000-000000000001");

  await next();
};
