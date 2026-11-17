import type { Env } from "../types/env.js";

export async function handleScheduledEvent(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
  console.log(`[CronScheduler] Triggered scheduled event: cron=${event.cron}`);
  // Dispatch background crawl / briefing jobs
}
