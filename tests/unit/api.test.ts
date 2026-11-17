import { describe, it, expect } from "vitest";
import app from "../../apps/api/src/index.js";

describe("Signal Stack API Endpoints", () => {
  const defaultHeaders = {
    "x-organization-id": "a0000000-0000-0000-0000-000000000001",
    "content-type": "application/json",
  };

  it("GET /health returns healthy status", async () => {
    const res = await app.fetch(new Request("http://localhost/health"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("healthy");
  });

  it("GET /ready returns database and queue ready", async () => {
    const res = await app.fetch(new Request("http://localhost/ready"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ready");
  });

  it("POST /auth/session creates session token", async () => {
    const req = new Request("http://localhost/auth/session", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ email: "analyst@edxso.com", password: "password123" }),
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.token).toBeDefined();
  });

  it("GET /auth/me returns current user profile", async () => {
    const req = new Request("http://localhost/auth/me", { headers: defaultHeaders });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.email).toBe("analyst@edxso.com");
  });

  it("GET /companies lists tenant companies", async () => {
    const req = new Request("http://localhost/companies", { headers: defaultHeaders });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("POST /companies creates new target company", async () => {
    const req = new Request("http://localhost/companies", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        name: "Acme Quantum AI",
        ticker: "ACME",
        domain: "acme-quantum.ai",
        industry: "Quantum AI Hardware",
      }),
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.name).toBe("Acme Quantum AI");
  });

  it("POST /companies/:id/research enqueues research job", async () => {
    const req = new Request("http://localhost/companies/c0000000-0000-0000-0000-000000000001/research", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ depth: "deep" }),
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(202);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("queued");
  });

  it("POST /companies/:id/interview/start initiates CEO calibration", async () => {
    const req = new Request("http://localhost/companies/c0000000-0000-0000-0000-000000000001/interview/start", {
      method: "POST",
      headers: defaultHeaders,
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.questions.length).toBeGreaterThan(0);
  });

  it("GET /companies/:id/sources returns intelligence sources", async () => {
    const req = new Request("http://localhost/companies/c0000000-0000-0000-0000-000000000001/sources", {
      headers: defaultHeaders,
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("POST /companies/:id/crawl enqueues polite crawl", async () => {
    const req = new Request("http://localhost/companies/c0000000-0000-0000-0000-000000000001/crawl", {
      method: "POST",
      headers: defaultHeaders,
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(202);
    const body = await res.json();
    expect(body.data.status).toBe("queued");
  });

  it("GET /companies/:id/signals returns signals with verified evidence/interpretation separation", async () => {
    const req = new Request("http://localhost/companies/c0000000-0000-0000-0000-000000000001/signals", {
      headers: defaultHeaders,
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    const sig = body.data[0];
    expect(sig.evidence_summary).toBeDefined();
    expect(sig.interpretation).toBeDefined();
    expect(sig.recommended_action).toBeDefined();
  });

  it("GET /companies/:id/briefs returns executive briefs", async () => {
    const req = new Request("http://localhost/companies/c0000000-0000-0000-0000-000000000001/briefs", {
      headers: defaultHeaders,
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
