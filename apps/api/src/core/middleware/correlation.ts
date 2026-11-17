import type { MiddlewareHandler } from "hono";
import type { AppVariables, Env } from "../../types/env.js";

export const correlationMiddleware: MiddlewareHandler<{ Bindings: Env; Variables: AppVariables }> = async (c, next) => {
  const correlationId = c.req.header("x-correlation-id") || crypto.randomUUID();
  c.set("correlationId", correlationId);
  c.header("x-correlation-id", correlationId);
  await next();
};
