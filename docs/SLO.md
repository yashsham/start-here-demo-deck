# Signal Stack — Service Level Objectives (SLOs) & Error Budgets

## 1. Core Service Level Indicators (SLIs) & Objectives

| Service Area | Indicator (SLI) | Target Objective (SLO) | Measurement Window | Error Budget |
| :--- | :--- | :--- | :--- | :--- |
| **API Availability** | Successful HTTP requests (non-5xx / total requests) | **99.9%** | Rolling 30 days | 0.1% (~43 mins downtime) |
| **API Latency** | Synchronous REST endpoints (excluding AI generation) | **P95 < 200 ms** | Rolling 7 days | 5% exceeding 200ms |
| **Brief Generation** | Completed briefs with valid grounding citations / requested briefs | **99.0%** | Rolling 30 days | 1.0% failed syntheses |
| **Source Crawling** | Successful fetches of active, robots-allowed sources | **98.0%** | Rolling 7 days | 2.0% transient failures |
| **Evidence Grounding** | Brief claims verified against raw evidence excerpts | **100%** | Strict invariant | Zero tolerance for hallucination |

---

## 2. Error Budget Policy & Enforcement
- **Budget Depleted (>100% burned)**: Freeze non-security deployments. Engineering focus pivots to reliability, rate limiting, and database indexing.
- **Budget at Risk (75–99% burned)**: SRE team initiates incident review and adjusts retry backoff parameters.
