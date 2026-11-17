# Signal Stack — STRIDE Threat Model

## 1. Executive Summary
This document provides an exhaustive architectural threat model for **Signal Stack**, evaluating each trust boundary against the **STRIDE** methodology (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) and **OWASP Top 10** + **OWASP LLM Top 10** risk taxonomies.

---

## 2. Trust Boundaries & Architecture Diagram

```
                 [ Untrusted Internet: Public Web / News / SEC ]
                                       ¦
                                       ? (Crawled content)
 [ Browser / User ] --(HTTPS)--> [ Cloudflare Worker API ] --(RLS JWT)--> [ Supabase DB ]
         ¦                              ¦
         ?                              ? (Prompt Guard / Gateway)
  [ Local Storage ]              [ Groq LLM API ]
```

### Trust Boundary Definitions:
1. **Boundary 1 (Client to Worker)**: Public internet to Cloudflare Worker API. Validates authentication tokens, correlation IDs, and tenant context.
2. **Boundary 2 (Worker to Web Crawler)**: Ingestion of arbitrary untrusted third-party web content. Must prevent SSRF, DNS rebinding, and malicious redirect chains.
3. **Boundary 3 (Worker to LLM Provider)**: Transmission of raw web text to Groq inference engine. Must prevent prompt injection and untrusted instruction execution.
4. **Boundary 4 (Worker to Database)**: Data layer enforcing PostgreSQL Row-Level Security (RLS) per tenant organization.

---

## 3. STRIDE Threat Matrix by Component

| Component | Threat Category | Threat Description | Severity | Implemented Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Spoofing | Adversary crafts forged JWT to impersonate tenant member | High | Supabase JWT cryptographic signature verification; `auth_uid()` and `auth_org_id()` validation. |
| **Company Data** | Information Disclosure | Tenant A attempts to access Tenant B companies via IDOR | Critical | Enforced PostgreSQL Row-Level Security (RLS) on all tenant tables with `organization_id = auth_org_id()`. |
| **Source Discovery** | Tampering | Adversary submits malicious URLs pointing to internal subnet | Critical | `SSRFGuard` validates protocol (HTTP/S only) and checks IP against blocked RFC 1918 / loopback ranges. |
| **Web Crawling** | Denial of Service | Target host traps crawler with recursive links or 100MB files | High | Byte size hard caps (5MB max), request timeouts (10s), and Token Bucket rate limiting per domain. |
| **AI Processing** | Tampering (Prompt Injection) | Crawled web page contains adversarial prompt overrides | Critical | External content wrapped inside `<untrusted_content>` tags; system prompt instructs LLM to treat as inert text. |
| **Document Uploads** | Elevation of Privilege / Tampering | Adversary uploads malicious PDF or CSV with formula injection | High | Strict MIME validation, sanitization of formula triggers (`=`, `+`, `-`, `@`), and file size limits. |
| **Background Jobs** | Repudiation / Race Conditions | Overlapping worker threads execute duplicate crawl jobs | Medium | Distributed lock manager (`DistributedLockManager`) with TTL and immutable audit logging. |
| **Executive Reports** | Information Disclosure / Hallucination | Model hallucinates competitor actions without citations | Critical | Two-stage groundedness verifier (`GroundingValidator`) rejecting claims unbacked by source snippets. |
