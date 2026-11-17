import * as cheerio from "cheerio";
import type { FetchOptions, FetchResult, FetcherStrategy } from "../interfaces/fetcher.interface.js";
import { SSRFGuard } from "../guards/ssrf-guard.js";

export class SitemapFetcher implements FetcherStrategy {
  public readonly supportedType = "sitemap";

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

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": options.userAgent || "SignalStack-Bot/1.0" },
        signal: AbortSignal.timeout(options.timeoutMs ?? 10000),
      });

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
          error: `Sitemap fetch error ${res.status}`,
        };
      }

      const xml = await res.text();
      const $ = cheerio.load(xml, { xmlMode: true });
      const links: string[] = [];

      $("url > loc, sitemap > loc").each((_, el) => {
        const loc = $(el).text().trim();
        if (loc) links.push(loc);
      });

      return {
        url,
        canonicalUrl: url,
        status: "success",
        httpStatus: res.status,
        rawContent: xml,
        cleanText: links.join("\n"),
        title: "XML Sitemap",
        contentHash: "sitemap_hash_" + links.length,
        simhash: 0n,
        byteSize: xml.length,
        links,
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
        error: err.message,
      };
    }
  }
}
