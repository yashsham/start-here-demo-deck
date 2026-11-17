# Signal Stack — Hono OpenAPI Route Specification
*High-Throughput Edge API Specification on Cloudflare Workers*

---

## Base URL
- **Production**: `https://api.signalstack.internal`
- **Staging**: `https://api-staging.signalstack.internal`
- **Local Development**: `http://localhost:8080/api`

---

## 1. Company Intelligence Endpoints

### `GET /api/companies`
Returns all monitored target enterprises for the authenticated tenant.
- **Headers**: `Authorization: Bearer <JWT>`
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "c0000000-0000-0000-0000-000000000001",
        "name": "EDXSO Technologies",
        "domain": "edxso.com",
        "industry": "Enterprise AI Systems",
        "country": "USA"
      },
      {
        "id": "c0000000-0000-0000-0000-000000000003",
        "name": "HealthPlix Technologies",
        "domain": "healthplix.com",
        "industry": "HealthTech & Clinical AI Infrastructure",
        "country": "IND"
      }
    ]
  }
  ```

### `GET /api/companies/:id/profile`
Fetches authoritative intelligence profile and business model calibration.

### `POST /api/companies/:id/interview/answers`
Records answers from the 10-question Founder Discovery Interview to recalibrate signal relevance.

---

## 2. Sources & Crawler Endpoints

### `GET /api/companies/:id/sources`
Returns approved, pending, and quarantined intelligence feeds.

### `POST /api/companies/:id/sources/discover`
Triggers dynamic web discovery for new industry sources and competitor footprints.
- **Status**: `202 Accepted`

### `POST /api/sources/:id/crawl`
Dispatches an immediate crawl job for a specific source feed through SSRF and robots.txt guards.

---

## 3. Signal Stack & Ranking Endpoints

### `GET /api/companies/:id/signal-stack`
Returns ranked candidate signals with evidence summaries, action items, and confidence ratings.
- **Query Params**: `?category=regulatory_compliance&min_score=0.85`

### `POST /api/companies/:id/signal-stack/reassess`
Re-evaluates all source credibility and signal rankings following a strategic context change.

---

## 4. Monday Brief Endpoints

### `GET /api/companies/:id/briefs/latest`
Returns the current 10-part editorial Monday Morning Brief.

### `POST /api/companies/:id/briefs/generate`
Synthesizes the weekly executive brief using Groq Llama 3.3 70B reasoning engine.

---

## 5. System Health & Operations Endpoints

### `GET /health`
Returns API health, database pool availability, and worker uptime.
- **Response** (200 OK): `{"status": "healthy", "runtime": "cloudflare_workers"}`
