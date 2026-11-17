import * as cheerio from "cheerio";
import type { FetchOptions, FetchResult, FetcherStrategy } from "../interfaces/fetcher.interface.js";
import { SSRFGuard } from "../guards/ssrf-guard.js";
import { computeSimHash } from "../../../algorithms/src/simhash/index.js";

export class HTMLFetcher implements FetcherStrategy {
  public readonly supportedType = "html";
  private defaultUserAgent = "SignalStack-Bot/1.0 (+https://edxso.com/bot; bot@edxso.com)";

  async fetch(url: string, options: FetchOptions = {}): Promise<FetchResult> {
    const ssrfCheck = SSRFGuard.validateUrl(url);
    if (!ssrfCheck.allowed) {
      return {
        url,
        canonicalUrl: url,
        status: "blocked_ssrf",
        contentHash: "",
        simhash: 0n,
        byteSize: 0,
        links: [],
        error: ssrfCheck.reason,
      };
    }

    const timeoutMs = options.timeoutMs ?? 10000;
    const maxSizeBytes = options.maxSizeBytes ?? 5 * 1024 * 1024; // 5 MB
    const headers: Record<string, string> = {
      "User-Agent": options.userAgent || this.defaultUserAgent,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    };

    if (options.etag) headers["If-None-Match"] = options.etag;
    if (options.lastModified) headers["If-Modified-Since"] = options.lastModified;

    try {
      const res = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(timeoutMs),
        redirect: options.allowRedirects === false ? "manual" : "follow",
      });

      if (res.status === 304) {
        return {
          url,
          canonicalUrl: url,
          status: "not_modified",
          httpStatus: 304,
          contentHash: "",
          simhash: 0n,
          byteSize: 0,
          links: [],
          etag: options.etag,
          lastModified: options.lastModified,
        };
      }

      if (!res.ok) {
        return {
          url,
          canonicalUrl: url,
          status: "failed",
          httpStatus: res.status,
          contentHash: "",
          simhash: 0n,
          byteSize: 0,
          links: [],
          error: `HTTP error ${res.status}: ${res.statusText}`,
        };
      }

      const contentLength = Number(res.headers.get("content-length") || "0");
      if (contentLength > maxSizeBytes) {
        return {
          url,
          canonicalUrl: url,
          status: "oversized",
          httpStatus: res.status,
          contentHash: "",
          simhash: 0n,
          byteSize: contentLength,
          links: [],
          error: `Content size ${contentLength} bytes exceeds limit of ${maxSizeBytes} bytes`,
        };
      }

      const rawHtml = await res.text();
      const byteSize = new TextEncoder().encode(rawHtml).length;

      if (byteSize > maxSizeBytes) {
        return {
          url,
          canonicalUrl: url,
          status: "oversized",
          httpStatus: res.status,
          contentHash: "",
          simhash: 0n,
          byteSize,
          links: [],
          error: `Downloaded body size ${byteSize} bytes exceeds limit of ${maxSizeBytes} bytes`,
        };
      }

      const $ = cheerio.load(rawHtml);
      // Remove noise elements
      $("script, style, nav, footer, header, noscript, svg, iframe").remove();

      const title = $("title").text().trim() || $("h1").first().text().trim();
      const cleanText = $("body").text().replace(/\s+/g, " ").trim();

      // Extract canonical URL or self
      const canonicalTag = $('link[rel="canonical"]').attr("href");
      const canonicalUrl = canonicalTag ? new URL(canonicalTag, url).href : url;

      // Extract outgoing links
      const links: string[] = [];
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
          try {
            links.push(new URL(href, url).href);
          } catch {}
        }
      });

      const contentHash = await this.sha256(cleanText);
      const simhash = computeSimHash(cleanText);

      return {
        url,
        canonicalUrl,
        status: "success",
        httpStatus: res.status,
        rawContent: rawHtml,
        cleanText,
        title,
        etag: res.headers.get("etag"),
        lastModified: res.headers.get("last-modified"),
        contentHash,
        simhash,
        byteSize,
        links: Array.from(new Set(links)).slice(0, 100),
      };
    } catch (err: any) {
      return {
        url,
        canonicalUrl: url,
        status: "failed",
        contentHash: "",
        simhash: 0n,
        byteSize: 0,
        links: [],
        error: err.name === "TimeoutError" ? "Request timed out" : err.message,
      };
    }
  }

  private async sha256(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}
