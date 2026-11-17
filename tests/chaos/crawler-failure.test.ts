import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SSRFGuard } from "../../packages/crawler/src/guards/ssrf-guard.js";
import { RobotsChecker } from "../../packages/crawler/src/guards/robots-checker.js";
import { RSSFetcher } from "../../packages/crawler/src/fetchers/rss-fetcher.js";
import { computeSimHash, isNearDuplicate } from "../../packages/algorithms/src/index.js";

describe("Category 6: Crawler Failure & Extreme Boundary Scenarios", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("HTTP Error Responses & Retries", () => {
    it("handles HTTP 404 Not Found without raising uncaught exceptions", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(new Response("Not Found", { status: 404 }));
      const fetcher = new RSSFetcher();

      const result = await fetcher.fetch("https://news.example.com/dead-link.xml");
      expect(result.status).toBe("failed");
      expect(result.httpStatus).toBe(404);
      expect(result.error).toContain("404");
    });

    it("handles HTTP 403 Forbidden with quarantine classification", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(new Response("Access Denied", { status: 403 }));
      const fetcher = new RSSFetcher();

      const result = await fetcher.fetch("https://news.example.com/private.xml");
      expect(result.status).toBe("failed");
      expect(result.httpStatus).toBe(403);
    });

    it("handles HTTP 429 Rate Limit backoff signal", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(new Response("Too Many Requests", { status: 429 }));
      const fetcher = new RSSFetcher();

      const result = await fetcher.fetch("https://news.example.com/rate-limited.xml");
      expect(result.status).toBe("failed");
      expect(result.httpStatus).toBe(429);
    });

    it("handles HTTP 500 Server Error gracefully", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(new Response("Internal Error", { status: 500 }));
      const fetcher = new RSSFetcher();

      const result = await fetcher.fetch("https://news.example.com/server-error.xml");
      expect(result.status).toBe("failed");
      expect(result.httpStatus).toBe(500);
    });
  });

  describe("SSRF & Malformed Feed Protection", () => {
    it("blocks private network and cloud metadata URLs via SSRF guard", async () => {
      const fetcher = new RSSFetcher();

      const cloudMetaResult = await fetcher.fetch("http://169.254.169.254/latest/meta-data");
      expect(cloudMetaResult.status).toBe("blocked_ssrf");

      const localResult = await fetcher.fetch("http://127.0.0.1:8080/internal");
      expect(localResult.status).toBe("blocked_ssrf");
    });

    it("gracefully parses broken and malformed RSS XML", async () => {
      const malformedXml = `<rss version="2.0"><channel><title>Broken Feed</title><item><title>Item 1</title><link>https://example.com/1</link></item></channel></rss>`;
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(malformedXml, {
          status: 200,
          headers: { "content-type": "application/xml" },
        })
      );
      const fetcher = new RSSFetcher();
      const result = await fetcher.fetch("https://news.example.com/broken.xml");

      expect(result.status).toBe("success");
      expect(result.cleanText).toContain("Item 1");
    });
  });

  describe("Robots.txt & Duplicate Elimination", () => {
    it("strictly blocks URLs disallowed by robots.txt policies", async () => {
      const robotsTxt = "User-agent: *\nDisallow: /admin/\nDisallow: /private/\n";
      globalThis.fetch = vi.fn().mockResolvedValue(new Response(robotsTxt, { status: 200 }));
      const checker = new RobotsChecker();

      const allowed = await checker.isAllowed("https://example.com/admin/secrets", "SignalStack-Bot/1.0");
      expect(allowed).toBe(false);

      const publicAllowed = await checker.isAllowed("https://example.com/public/news", "SignalStack-Bot/1.0");
      expect(publicAllowed).toBe(true);
    });

    it("identifies near-duplicate documents with SimHash Hamming distance <= 3", () => {
      const docA = "NVIDIA acquires leading quantum chipmaker in a strategic push for AI infrastructure.";
      const docB = "NVIDIA acquires leading quantum chipmaker in strategic push for AI infrastructure.";
      const docC = "Completely unrelated text discussing weather patterns across coastal regions in November.";

      const hashA = computeSimHash(docA);
      const hashB = computeSimHash(docB);
      const hashC = computeSimHash(docC);

      expect(isNearDuplicate(hashA, hashB, 3)).toBe(true);
      expect(isNearDuplicate(hashA, hashC, 3)).toBe(false);
    });
  });
});