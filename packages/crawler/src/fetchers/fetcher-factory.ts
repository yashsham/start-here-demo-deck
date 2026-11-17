import type { FetcherStrategy } from "../interfaces/fetcher.interface.js";
import { HTMLFetcher } from "./html-fetcher.js";
import { RSSFetcher } from "./rss-fetcher.js";
import { SitemapFetcher } from "./sitemap-fetcher.js";
import { JSONFetcher } from "./json-fetcher.js";

export class FetcherFactory {
  private static strategies: Map<string, FetcherStrategy> = new Map([
    ["html", new HTMLFetcher()],
    ["web", new HTMLFetcher()],
    ["press", new HTMLFetcher()],
    ["careers", new HTMLFetcher()],
    ["rss", new RSSFetcher()],
    ["atom", new RSSFetcher()],
    ["sitemap", new SitemapFetcher()],
    ["json", new JSONFetcher()],
    ["api", new JSONFetcher()],
  ]);

  public static getStrategy(sourceType: string): FetcherStrategy {
    const strategy = this.strategies.get(sourceType.toLowerCase());
    return strategy || this.strategies.get("html")!;
  }
}
