# Signal Stack — Requirements Traceability Matrix
*Mapping EDXSO AI Engineer Intern Assignment 1 Requirements to Implementation*

| # | Assignment Requirement | Implementation Location | API / DB Artifact | Test Verification |
| :- | :--- | :--- | :--- | :--- |
| **1** | **Adaptive Intake Questions** | `src/components/signal-stack/data.ts` (`questionsByCompany`) | `interview_questions` table | `tests/unit/api.test.ts` |
| **2** | **Dynamic Competitor Discovery** | `packages/crawler/src/discovery/competitor-finder.ts` | `competitors` table | `tests/unit/crawler.test.ts` |
| **3** | **Dynamic Source Discovery** | `packages/crawler/src/discovery/source-finder.ts` | `sources`, `source_discovery_runs` | `tests/unit/crawler.test.ts` |
| **4** | **Genuine Web Crawler & Guards** | `packages/crawler/src/fetchers/rss-fetcher.ts`, `ssrf-guard.ts` | `content_snapshots`, `crawl_records` | `tests/chaos/crawler-failure.test.ts` |
| **5** | **Zero Fabricated Records** | Multi-source verification in `packages/ai-agent` | `signals`, `signal_evidence` | `tests/unit/ai.test.ts` |
| **6** | **Traceable Citations** | Clickable citation drawer & `signal_evidence.url` | `signal_evidence` table | `tests/unit/ai.test.ts` |
| **7** | **Evidence vs. Interpretation** | Discrete schema columns in `signals` table | `signals.evidence_summary` vs `signals.interpretation` | `tests/security/security.test.ts` |
| **8** | **Actionable Opportunities** | Monday Brief section 8 with owners & priorities | `brief_actions` table | `tests/unit/api.test.ts` |
| **9** | **Context Reassessment Engine** | `apps/api/src/modules/signals/routes.ts` (`/reassess`) | `docs/CONTEXT_CHANGE_DIFF.md` | `tests/unit/api.test.ts` |
| **10**| **SimHash Deduplication** | `packages/algorithms/src/simhash/index.ts` (Hamming $le 3$) | `sources.content_hash` | `tests/unit/algorithms.test.ts` |
| **11**| **Weekly Automation Engine** | `apps/api/src/modules/automation/scheduler.ts` | `automation_settings`, `scheduled_jobs` | `tests/unit/automation.test.ts` |
| **12**| **LangGraph Agentic Flow** | `packages/ai-agent/src/graph/intelligence-graph.ts` | StateGraph compiled node loop | `tests/unit/langgraph.test.ts` |
| **13**| **Multi-Tenant PostgreSQL RLS** | `supabase/migrations/20260217000010_row_level_security.sql`| 43 tables with active RLS | `tests/chaos/database-failure.test.ts`|
| **14**| **Performance & Load Benchmarks**| `tests/load/api-load.test.ts` (P50, P90, P95, P99) | Latency < 200ms SLO report | `tests/load/api-load.test.ts` |
| **15**| **Zero-Bypass Authentication** | `src/lib/auth-context.tsx`, `app-shell.tsx` | Supabase Auth + PKCE Google OAuth | `tests/unit/auth.test.ts` |
