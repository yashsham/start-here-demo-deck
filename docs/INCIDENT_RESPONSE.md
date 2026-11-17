# Signal Stack — Incident Response Playbook

## 1. Incident Severity Definitions
- **SEV-1 (Critical)**: Total API outage, database corruption, active cross-tenant data leak, or complete failure of weekly brief generation.
- **SEV-2 (High)**: Groq 429 rate limit saturation, crawler backlog growing unbounded (>10,000 items), or elevated error rates (>5%).
- **SEV-3 (Medium)**: Degraded source crawl latency, single source parser failure, or non-blocking UI glitches.

---

## 2. Standard Triage Workflows

### Runbook A: Groq API Rate Limiting / Outage
1. **Diagnosis**: Check `llm_429_rate_limit_spikes` metric in Operations Dashboard and LangSmith dashboard.
2. **Mitigation**:
   - Verify if Cloudflare AI Gateway caching is active.
   - Scale back non-urgent background crawl batch sizes.
   - Switch high-throughput extraction tasks to fallback model `qwen/qwen3.8-27b`.

### Runbook B: Crawler Backlog Saturation
1. **Diagnosis**: Inspect Cloudflare Queue metrics: `INTELLIGENCE_QUEUE` message lag.
2. **Mitigation**:
   - Check dead-letter queue (`signal-stack-dlq`) for recurring parser or network errors.
   - Increase queue consumer concurrency in `wrangler.jsonc` (`max_batch_size: 20`).
   - Identify rogue slow origins and enforce tighter TokenBucket limits.

### Runbook C: Database High Latency / Connection Exhaustion
1. **Diagnosis**: Run `EXPLAIN ANALYZE` on slow query telemetry logs.
2. **Mitigation**:
   - Verify `pgvector` HNSW indexes and `pg_trgm` GIN indexes are utilized.
   - Kill long-running unindexed analytics queries.
   - Enable Supabase Transaction Pooler (port 6543) if direct connection limits are breached.
