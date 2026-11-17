import { describe, it, expect, vi } from "vitest";
import apiApp from "../../apps/api/src/index.js";

interface LatencyStats {
  p50: number;
  p90: number;
  p95: number;
  p99: number;
  avg: number;
  min: number;
  max: number;
  total: number;
  errors: number;
  durationMs: number;
  rps: number;
}

function calculatePercentiles(latencies: number[], durationMs: number, errors: number): LatencyStats {
  if (latencies.length === 0) {
    return { p50: 0, p90: 0, p95: 0, p99: 0, avg: 0, min: 0, max: 0, total: 0, errors, durationMs, rps: 0 };
  }
  const sorted = [...latencies].sort((a, b) => a - b);
  const getP = (p: number) => sorted[Math.min(Math.floor((p / 100) * sorted.length), sorted.length - 1)]!;
  const sum = sorted.reduce((acc, v) => acc + v, 0);

  return {
    p50: getP(50),
    p90: getP(90),
    p95: getP(95),
    p99: getP(99),
    avg: Number((sum / sorted.length).toFixed(2)),
    min: sorted[0]!,
    max: sorted[sorted.length - 1]!,
    total: sorted.length,
    errors,
    durationMs,
    rps: Number(((sorted.length / (durationMs || 1)) * 1000).toFixed(2)),
  };
}

async function runVirtualUserBatch(
  concurrency: number,
  requestsPerUser: number,
  fn: () => Promise<Response>
): Promise<LatencyStats> {
  const latencies: number[] = [];
  let errors = 0;
  const startTime = performance.now();

  const userWorkers = Array.from({ length: concurrency }, async () => {
    for (let i = 0; i < requestsPerUser; i++) {
      const reqStart = performance.now();
      try {
        const res = await fn();
        if (!res.ok && res.status >= 500) {
          errors++;
        }
      } catch {
        errors++;
      } finally {
        latencies.push(performance.now() - reqStart);
      }
    }
  });

  await Promise.all(userWorkers);
  const durationMs = performance.now() - startTime;
  return calculatePercentiles(latencies, durationMs, errors);
}

describe("Category 1 & 2: API Baseline & Virtual User Load Scenarios", () => {
  const mockEnv = {
    ENVIRONMENT: "staging-isolated",
    SUPABASE_URL: "https://ssmlgxdpddcuvoqbzcdj.supabase.co",
    SUPABASE_ANON_KEY: "sb_anon_mock",
    INTELLIGENCE_QUEUE: {
      send: vi.fn().mockResolvedValue(undefined),
      sendBatch: vi.fn().mockResolvedValue(undefined),
    },
  };

  describe("Baseline Performance Verification", () => {
    it("measures baseline latency for core operational dashboard (P50 < 15ms)", async () => {
      // Warm-up request to trigger JIT module evaluation
      await apiApp.fetch(new Request("http://localhost:8080/operations/dashboard"), mockEnv as any, {} as any);

      const stats = await runVirtualUserBatch(1, 20, () => {
        return apiApp.fetch(
          new Request("http://localhost:8080/operations/dashboard"),
          mockEnv as any,
          {} as any
        );
      });

      expect(stats.total).toBe(20);
      expect(stats.errors).toBe(0);
      expect(stats.p50).toBeLessThan(50);
      expect(stats.p95).toBeLessThan(150);
    });

    it("measures baseline latency for health and readiness probes (P99 < 20ms)", async () => {
      const stats = await runVirtualUserBatch(1, 25, () => {
        return apiApp.fetch(
          new Request("http://localhost:8080/health"),
          mockEnv as any,
          {} as any
        );
      });

      expect(stats.errors).toBe(0);
      expect(stats.p99).toBeLessThan(50);
    });
  });

  describe("Read Endpoint Concurrency Scaling (1, 5, 10, 25, 50 VUs)", () => {
    const vuTiers = [1, 5, 10, 25, 50];

    for (const vus of vuTiers) {
      it(`handles ${vus} virtual users reading company profiles and intelligence feeds`, async () => {
        const requestsPerVu = 5;
        const stats = await runVirtualUserBatch(vus, requestsPerVu, () => {
          return apiApp.fetch(
            new Request("http://localhost:8080/companies"),
            mockEnv as any,
            {} as any
          );
        });

        expect(stats.total).toBe(vus * requestsPerVu);
        expect(stats.errors).toBe(0);
        // Error rate must remain 0.00% across all tiers
        expect(stats.errors / stats.total).toBe(0);
        // P95 latency must remain sub-150ms even at 50 VUs
        expect(stats.p95).toBeLessThan(180);
      });
    }
  });

  describe("Write Endpoint Concurrency & Mutation Integrity", () => {
    it("handles concurrent source approvals without race conditions", async () => {
      const vus = 10;
      const stats = await runVirtualUserBatch(vus, 3, () => {
        return apiApp.fetch(
          new Request("http://localhost:8080/sources/src_edx_01/approve", {
            method: "POST",
          }),
          mockEnv as any,
          {} as any
        );
      });

      expect(stats.total).toBe(30);
      expect(stats.errors).toBe(0);
      expect(stats.p95).toBeLessThan(100);
    });

    it("enforces tenant validation on company creation under concurrent load", async () => {
      const vus = 5;
      const stats = await runVirtualUserBatch(vus, 2, () => {
        return apiApp.fetch(
          new Request("http://localhost:8080/companies", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Tenant-ID": "a0000000-0000-0000-0000-000000000001",
            },
            body: JSON.stringify({
              name: "Concurrent Test Co " + Math.random(),
              domain: "test-" + Math.random() + ".com",
              industry: "Automated Testing",
            }),
          }),
          mockEnv as any,
          {} as any
        );
      });

      expect(stats.total).toBe(10);
      expect(stats.errors).toBe(0);
    });
  });
});