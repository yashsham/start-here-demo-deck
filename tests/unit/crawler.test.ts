import { describe, it, expect, vi } from "vitest";
import {
  HTMLFetcher,
  RSSFetcher,
  SSRFGuard,
  CrawlPipeline,
  MEETUNIVERSITY_APPROVED_SOURCES,
} from "../../packages/crawler/src/index.js";

describe("Signal Stack Crawler - Security & Fetcher Tests", () => {
  it("1. RSS Parsing: Parses valid RSS 2.0 XML into structured items", async () => {
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>EdTech Higher Ed News</title>
        <link>https://example.com</link>
        <item>
          <title>Global Visa Regulation Update for Overseas Students</title>
          <link>https://example.com/article/1</link>
          <pubDate>Mon, 17 Feb 2026 12:00:00 GMT</pubDate>
          <description>Immigration authorities announce revised study visa requirements.</description>
        </item>
      </channel>
    </rss>`;

    const fetcher = new RSSFetcher();
    // Mock global fetch for this unit test
    const origFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue(new Response(rssXml, { status: 200 }));

    const res = await fetcher.fetch("https://example.com/feed.xml");
    global.fetch = origFetch;

    expect(res.status).toBe("success");
    expect(res.title).toBe("EdTech Higher Ed News");
    expect(res.links).toContain("https://example.com/article/1");
    expect(res.cleanText).toContain("Global Visa Regulation Update");
  });

  it("2. Malformed XML: Handles corrupted XML gracefully without crashing", async () => {
    const malformed = `<rss version="2.0"><channel><title>Broken Feed<item><unclosed_tag>`;
    const fetcher = new RSSFetcher();
    const origFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue(new Response(malformed, { status: 200 }));

    const res = await fetcher.fetch("https://example.com/broken.xml");
    global.fetch = origFetch;

    expect(res).toBeDefined();
    expect(res.status).toBe("success"); // Cheerio lenient XML parser handles unclosed tags
  });

  it("3. SSRF Guard: Rejects loopback, AWS metadata, and private IP addresses", () => {
    expect(SSRFGuard.validateUrl("http://localhost/admin").allowed).toBe(false);
    expect(SSRFGuard.validateUrl("http://127.0.0.1:8080/secret").allowed).toBe(false);
    expect(SSRFGuard.validateUrl("http://169.254.169.254/latest/meta-data/").allowed).toBe(false);
    expect(SSRFGuard.validateUrl("http://10.0.0.1/internal-dashboard").allowed).toBe(false);
    expect(SSRFGuard.validateUrl("ftp://files.example.com").allowed).toBe(false);

    // Permitted legitimate public web sources
    expect(SSRFGuard.validateUrl("https://www.meetuniversity.com").allowed).toBe(true);
    expect(SSRFGuard.validateUrl("https://thepienews.com/feed/").allowed).toBe(true);
  });

  it("4. HTTP 404: Returns failed status with 404 response code", async () => {
    const fetcher = new HTMLFetcher();
    const origFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue(new Response("Not Found", { status: 404, statusText: "Not Found" }));

    const res = await fetcher.fetch("https://example.com/missing-page");
    global.fetch = origFetch;

    expect(res.status).toBe("failed");
    expect(res.httpStatus).toBe(404);
  });

  it("5. HTTP 500: Returns failed status with 500 response code", async () => {
    const fetcher = new HTMLFetcher();
    const origFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue(new Response("Internal Server Error", { status: 500, statusText: "Server Error" }));

    const res = await fetcher.fetch("https://example.com/error-page");
    global.fetch = origFetch;

    expect(res.status).toBe("failed");
    expect(res.httpStatus).toBe(500);
  });

  it("6. Timeouts: Handles request abort/timeout cleanly", async () => {
    const fetcher = new HTMLFetcher();
    const origFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new DOMException("The operation was aborted", "TimeoutError"));

    const res = await fetcher.fetch("https://example.com/slow-endpoint");
    global.fetch = origFetch;

    expect(res.status).toBe("failed");
    expect(res.error).toBe("Request timed out");
  });

  it("7. Oversized Content: Rejects downloads exceeding maximum size limit", async () => {
    const fetcher = new HTMLFetcher();
    const origFetch = global.fetch;
    // Mock 10 MB payload with header
    global.fetch = vi.fn().mockResolvedValue(
      new Response("huge", {
        status: 200,
        headers: { "content-length": "10485760" },
      })
    );

    const res = await fetcher.fetch("https://example.com/huge-file.iso", { maxSizeBytes: 1024 * 1024 });
    global.fetch = origFetch;

    expect(res.status).toBe("oversized");
  });

  it("8 & 9. Crawl Pipeline: Detects duplicates and triggers AI only on changed content", async () => {
    const pipeline = new CrawlPipeline();
    const origFetch = global.fetch;

    // First fetch: fresh content
    const htmlA = `<html><head><title>Test Page</title></head><body><h1>Admissions open</h1><p>Spring 2026</p></body></html>`;
    global.fetch = vi.fn().mockImplementation(() => Promise.resolve(new Response(htmlA, { status: 200 })));

    const res1 = await pipeline.processSource({
      sourceId: "src_test_1",
      url: "https://example.com/admissions",
      sourceType: "html",
      isApproved: true,
    });
    console.error("ACTUAL_RES1:", JSON.stringify(res1, (k, v) => typeof v === "bigint" ? v.toString() : v));
    expect(res1.isChanged).toBe(true);
    expect(res1.shouldTriggerAI).toBe(true);
    expect(res1.isDuplicate).toBe(false);

    // Second fetch: identical content hash -> should NOT trigger AI!
    const res2 = await pipeline.processSource({
      sourceId: "src_test_1",
      url: "https://example.com/admissions",
      sourceType: "html",
      isApproved: true,
    });

    expect(res2.isDuplicate).toBe(true);
    expect(res2.shouldTriggerAI).toBe(false);

    global.fetch = origFetch;
  });

  it("10. MeetUniversity Demonstration: Contains at least 20 real approved sources", () => {
    expect(MEETUNIVERSITY_APPROVED_SOURCES.length).toBeGreaterThanOrEqual(20);
    const approved = MEETUNIVERSITY_APPROVED_SOURCES.filter((s) => s.isApproved);
    expect(approved.length).toBeGreaterThanOrEqual(20);

    for (const src of approved) {
      expect(src.url.startsWith("http")).toBe(true);
      expect(src.inclusionReason.length).toBeGreaterThan(10);
    }
  });
});
