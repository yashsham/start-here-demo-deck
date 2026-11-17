# Signal Stack — Autonomous Strategic Intelligence Engine
*EDXSO AI Engineer Intern Assignment 1 Implementation*

Signal Stack is an enterprise-grade autonomous intelligence engine that continuously monitors regulatory gazettes, competitor footprints, industry news, and community forums to compile weekly high-conviction decision briefs for executive leadership.

---

## 🌟 Key Highlights & Engineering Invariants

- **Multi-Agent Orchestration via LangGraph**: Cyclical state machine coordinating Source Discovery, Distributed Crawling, Signal Extraction, and Editorial Synthesis.
- **Zero Hallucination Guarantee**: Every signal has an immutable evidence chain linking to verbatim source text.
- **Dynamic Context Reassessment**: When strategic priorities shift, the platform automatically deprecates outdated sources, discovers new feeds, and re-ranks signals mathematically.
- **Zero-Trust Crawler Subsystem**: RFC1918/cloud-metadata SSRF guard, robots.txt caching, and 64-bit SimHash near-duplicate filtering (Hamming distance $le 3$).
- **Enterprise Multi-Tenancy**: Supabase PostgreSQL 17 with 43 tables secured by Row-Level Security (RLS).
- **High-Performance Edge Architecture**: Cloudflare Workers (Hono API) + Cloudflare Pages (React / TanStack Router).

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/yashsham/start-here-demo-deck.git
cd start-here-demo-deck
npm install
```

### 2. Configure Environment Variables (`.env`)
```ini
VITE_SUPABASE_URL=https://ssmlgxdpddcuvoqbzcdj.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Eq2QL4P6r6b1k-1Xm9JQ9g_AKRGox_l
VITE_GROQ_API_KEY=gsk_...
TAVILY_API_KEY=tvly-...
```

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:8080` to access the platform.

---

## 🧪 Verification & Test Suite

Run the complete 84-test suite across unit, load, chaos, and security suites:
```bash
# 1. Enforce zero TypeScript compilation errors
npx tsc --noEmit

# 2. Run all 14 test suites
npx vitest run

# 3. Build production bundle
npm run build
```

---

## 📚 Deliverables & Architecture Reference

- **[System Architecture](Architecture.md)**: Compact 5-page architectural overview.
- **[Context Change Diff](docs/CONTEXT_CHANGE_DIFF.md)**: Reproducible before/after evidence of HealthPlix strategic shift.
- **[Database Architecture](docs/DATABASE.md)**: 43-table data dictionary, ERD, and RLS policies.
- **[API Documentation](docs/API_DOCUMENTATION.md)**: Complete Hono RESTful route guide.
- **[Free-Tier Limits & Cost](docs/COST_AND_LIMITS.md)**: Quotas and unit economics.
- **[Video Demo Script](docs/DEMO_SCRIPT.md)**: 5-minute recorded presentation script.
- **[Requirements Traceability](docs/REQUIREMENTS_TRACEABILITY.md)**: Full requirements matrix.
- **[Engineering Audit Report](docs/INDEPENDENT_ENGINEERING_AUDIT.md)**: Independent Principal Engineering evaluation.
