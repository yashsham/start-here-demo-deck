# Signal Stack — Production Observability & SRE Architecture

## 1. Observability Principles
Signal Stack adheres to **The Three Pillars of Observability**:
1. **Structured JSON Logs**: Machine-readable, zero-leakage event streams with correlation IDs (`x-correlation-id`).
2. **Multi-Dimensional Metrics**: Counters, Gauges, and Histograms capturing latency, throughput, error rates, and queue saturation.
3. **Distributed Tracing**: End-to-end trace context propagated across HTTP requests, Cloudflare Queues, and Groq LLM invocations (monitored via LangSmith).

---

## 2. Structured Log Schema
Every log entry adheres to this JSON schema:
```json
{
  "timestamp": "2026-02-17T14:00:00.000Z",
  "level": "info",
  "service": "signal-stack-api",
  "environment": "production",
  "request_id": "req_84f932e",
  "trace_id": "trace_b14a980",
  "job_id": "job_wk_7c2b",
  "company_id": "c0000000-0000-0000-0000-000000000001",
  "source_id": "src_edx_01",
  "operation": "fetch_source_html",
  "duration_ms": 112,
  "status": "success",
  "error_code": null
}
```

### Sensitive Data Scrubbing:
The logger strictly filters out:
- API keys (`gsk_...`, `cfat_...`, `lsv2_...`)
- Passwords and auth tokens
- PII and raw confidential uploaded documents

---

## 3. Metrics Matrix

### 3.1 Frontend & User Experience
- `web_vitals.lcp_ms`: Largest Contentful Paint (target < 2.5s).
- `web_vitals.fid_ms`: First Input Delay (target < 100ms).
- `api_client.latency_ms`: P50 and P95 client perceived latency.
- `api_client.failed_requests`: Rate of HTTP 4xx/5xx responses.

### 3.2 Backend & API (Hono on Cloudflare)
- `http_requests_total`: Throughput by route and status code.
- `http_request_duration_ms`: P50, P95, and P99 latency histograms.
- `rate_limit_events_total`: 429 events triggered by TokenBucket.

### 3.3 Crawler & Ingestion
- `crawler_fetch_duration_ms`: P95 crawl time per source type.
- `crawler_crawl_success_rate`: Percentage of 200/304 vs failures.
- `crawler_duplicate_ratio`: Percentage of duplicate content snapshots detected via SimHash/SHA-256.
- `crawler_queue_backlog`: Number of unprocessed sources in `INTELLIGENCE_QUEUE`.

### 3.4 Generative AI & Reasoning
- `llm_inference_duration_ms`: Latency breakdown by model (`gpt-oss-20b` vs `gpt-oss-120b`).
- `llm_token_usage_total`: Input and output tokens consumed per operation.
- `llm_429_rate_limit_spikes`: Number of backoff retries triggered.
- `llm_grounding_rejection_rate`: Rate of claims rejected due to lack of citation overlap.

### 3.5 Database & Supabase
- `db_query_duration_ms`: Execution time across pgvector HNSW and GIN trigram indexes.
- `db_active_connections`: Connection pool utilization.
