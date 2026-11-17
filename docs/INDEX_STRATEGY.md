# Signal Stack — Index Strategy & Performance

## Index Categorization

1. **B-Tree Foreign Key Indexes**:
   - Implemented on every foreign key column (`organization_id`, `company_id`, `source_id`, `signal_id`, `brief_id`) to ensure fast JOIN operations and CASCADE deletions.

2. **Partial Indexes**:
   - `idx_sources_next_run` on `sources(next_run_at) WHERE approval_status = 'approved' AND robots_status = 'allowed'`. Limits the scheduler's index footprint to actionable sources only.

3. **Trigram GIN Indexes (`pg_trgm`)**:
   - `idx_companies_name_trgm` on `companies USING gin (name gin_trgm_ops)`.
   - `idx_signals_title_trgm` on `signals USING gin (title gin_trgm_ops)`.
   - `idx_company_facts_claim_trgm` on `company_research_facts USING gin (claim gin_trgm_ops)`.
   - Enables fast fuzzy search and sub-string matching across millions of records.

4. **Vector HNSW Indexes (`pgvector`)**:
   - `idx_signals_embedding_hnsw` on `signals USING hnsw (embedding vector_cosine_ops)`.
   - `idx_content_snapshots_embedding_hnsw` on `content_snapshots USING hnsw (embedding vector_cosine_ops)`.
   - Sub-10ms approximate nearest neighbor (ANN) semantic search with cosine distance.
