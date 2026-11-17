import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { AppVariables, Env } from "./types/env.js";
import { correlationMiddleware } from "./core/middleware/correlation.js";
import { authMiddleware } from "./core/middleware/auth.js";
import { customErrorHandler } from "./core/middleware/error-handler.js";

// Module routes
import { authRoutes } from "./modules/auth/routes.js";
import { companyRoutes } from "./modules/company/routes.js";
import { researchRoutes } from "./modules/research/routes.js";
import { interviewRoutes } from "./modules/interview/routes.js";
import { profileRoutes } from "./modules/profile/routes.js";
import { sourceRoutes } from "./modules/sources/routes.js";
import { crawlerRoutes } from "./modules/crawler/routes.js";
import { signalRoutes } from "./modules/signals/routes.js";
import { briefRoutes } from "./modules/briefs/routes.js";
import { internalRoutes } from "./modules/internal/routes.js";
import { automationRoutes } from "./modules/automation/routes.js";
import { operationsRoutes } from "./modules/operations/routes.js";

// Cloudflare handlers
import { handleQueueMessage } from "./queue/consumer.js";
import { handleScheduledEvent } from "./cron/scheduled.js";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// Global Middlewares
app.use("*", cors());
app.use("*", logger());
app.use("*", correlationMiddleware);
app.use("*", authMiddleware);
app.onError(customErrorHandler);

// Mount API Modules
app.route("/auth", authRoutes);
app.route("/companies", companyRoutes);
app.route("/companies", researchRoutes);
app.route("/companies", interviewRoutes);
app.route("/interviews", interviewRoutes);
app.route("/companies", profileRoutes);
app.route("/", sourceRoutes);
app.route("/", crawlerRoutes);
app.route("/", signalRoutes);
app.route("/", briefRoutes);
app.route("/", internalRoutes);
app.route("/", automationRoutes);
app.route("/", operationsRoutes);

// Export worker handlers
export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    await handleQueueMessage(batch, env);
  },
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    await handleScheduledEvent(event, env, ctx);
  },
};
