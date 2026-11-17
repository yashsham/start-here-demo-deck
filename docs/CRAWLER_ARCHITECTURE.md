# Signal Stack — Crawler Architecture & Engineering Specification

## 1. Overview
The Signal Stack Web Ingestion & Discovery Crawler is an enterprise-grade web data engine designed to continuously monitor public company sources while strictly enforcing rate limits, `robots.txt` policies, and SSRF boundary defenses.

## 2. Pipeline Flow
```
Discovery (Google News RSS / HN Algolia / Tavily API / Sitemaps)
   ¦
   ?
Candidate Validation & SSRF Guard (Protocol & IP Filtering)
   ¦
   ?
Robots Policy Evaluation (Cached 24h per origin)
   ¦
   ?
Domain Token Bucket Rate Limiter (2 req/s, burst cap 5)
   ¦
   ?
Conditional Fetch (If-None-Match ETag / If-Modified-Since Last-Modified)
   ¦
   +-- 304 Not Modified --> Terminate (Zero AI cost)
   ¦
   ?
Content Extraction & Sanitization (Cheerio text & metadata)
   ¦
   ?
Hash Calculation & Deduplication (SHA-256 & 64-bit SimHash Hamming <= 3)
   ¦
   +-- Duplicate Detected --> Update telemetry, skip AI
   ¦
   ?
Change Detection & Historical Snapshotting
   ¦
   ?
Signal Classification & Grounded Evidence Chain
```

## 3. Fetcher Strategy Pattern
- `HTMLFetcher`: Readability extraction, tag stripping, link harvesting, size capping (5MB max).
- `RSSFetcher`: RSS 2.0 & Atom feed parsing with enclosure and pubDate normalization.
- `SitemapFetcher`: XML sitemap discovery.
- `JSONFetcher`: Public REST/Algolia endpoint consumption.
