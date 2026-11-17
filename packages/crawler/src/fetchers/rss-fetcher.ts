import * as cheerio from "cheerio";
import type { FetchOptions, FetchResult, FetcherStrategy } from "../interfaces/fetcher.interface.js";
import { SSRFGuard } from "../guards/ssrf-guard.js";
import { computeSimHash } from "../../../algorithms/src/simhash/index.js";

export interface RSSItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
}

export class RSSFetcher implements FetcherStrategy {
  public readonly supportedType = "rss";

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
          error: `RSS fetch error ${res.status}`,
        };
      }

      const xml = await res.text();
      const $ = cheerio.load(xml, { xmlMode: true });

      const feedTitle = $("channel > title, feed > title").first().text().trim();
      const items: RSSItem[] = [];

      // Support both RSS <item> and Atom <entry>
      $("item, entry").each((_, el) => {
        const itemTitle = $(el).find("title").text().trim();
        const link = $(el).find("link").text().trim() || $(el).find("link").attr("href") || "";
        const pubDate = $(el).find("pubDate, published, updated").first().text().trim();
        const description = $(el).find("description, summary, content").first().text().trim();

        if (itemTitle && link) {
          items.push({ title: itemTitle, link, pubDate, description });
        }
      });

      const cleanText = items.map((i) => `${i.title}: ${i.description}`).join("\n");
      const links = items.map((i) => i.link);
      const data = new TextEncoder().encode(cleanText);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const contentHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");

      return {
        url,
        canonicalUrl: url,
        status: "success",
        httpStatus: res.status,
        rawContent: xml,
        cleanText,
        title: feedTitle || "RSS Feed",
        contentHash,
        simhash: computeSimHash(cleanText),
        byteSize: new TextEncoder().encode(xml).length,
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
        error: `Malformed XML or network error: ${err.message}`,
      };
    }
  }
}
