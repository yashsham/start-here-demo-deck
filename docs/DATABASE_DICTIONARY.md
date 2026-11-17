# Signal Stack — Database Dictionary

## Core Modules & Tables

### 1. Identity & Tenancy
- `organizations`: Root multi-tenant isolation unit (`id`, `name`, `slug`, `tier`, `settings`).
- `organization_members`: Users linked to organizations with roles (`owner`, `admin`, `analyst`, `viewer`).
- `user_profiles`: Application profile extending Supabase `auth.users` (`full_name`, `email`, `avatar_url`).
- `companies`: Entities tracked by an organization (`name`, `ticker`, `domain`, `industry`, `metadata`).
- `company_members`: Granular analyst assignments per company.

### 2. Company Intelligence
- `company_research_facts`: Atomic verifiable claims (`claim`, `claim_type`, `evidence_url`, `evidence_snippet`, `confidence_score`, `embedding`).
- `company_profiles`: Active consolidated profile summary, business model, and strategic vulnerabilities.
- `company_profile_versions`: Immutable history of profile changes.
- `interview_sessions`: CEO and executive calibration interviews.
- `interview_questions`: Questions generated to probe strategic priorities and blind spots.
- `interview_answers`: Verbatim executive answers and category weight calibration shifts.

### 3. Sources & Crawling
- `sources`: Target ingestion points (`url`, `canonical_url`, `source_type`, `category`, `specificity_score`, `recency_score`, `credibility_score`, `robots_status`, `next_run_at`).
- `source_discovery_runs`: Search and discovery runs using Tavily API.
- `content_snapshots`: Raw HTML and cleaned text captures (`simhash`, `content_hash`, `byte_size`, `embedding`).
- `crawl_records` & `crawl_failures`: Detailed execution telemetry and failure diagnosis.

### 4. Signals & Evidence
- `signals`: Consolidated intelligence events strictly separating factual `evidence_summary` from strategic `interpretation` and `recommended_action`.
- `signal_evidence`: Multi-source supporting evidence chain linking signals to verbatim excerpts in snapshots.
- `signal_entities`: Named entity occurrences (executives, tickers, regulators, competitors).
- `signal_relationships`: Knowledge graph edges (`corroborates`, `contradicts`, `precedes`, `amplifies`).

### 5. Reporting & Operations
- `briefs`: Executive intelligence deliverables with confidence and groundedness metrics.
- `brief_sections`: Structured sections with inline citation indices.
- `brief_actions`: Recommended executive decisions and response items.
- `brief_sources`: Verifiable citations directly pointing to evidence and source URLs.
- `automation_settings`: Cron expressions, crawl thresholds, and alert webhook destinations.
