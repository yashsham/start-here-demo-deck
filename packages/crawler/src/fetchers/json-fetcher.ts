import type { FetchOptions, FetchResult, FetcherStrategy } from "../interfaces/fetcher.interface.js";
import { SSRFGuard } from "../guards/ssrf-guard.js";
import { computeSimHash } from "../../../algorithms/src/simhash/index.js";

export class JSONFetcher implements FetcherStrategy {
  public readonly supportedType = "json";

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
        headers: {
          "User-Agent": options.userAgent || "SignalStack-Bot/1.0",
          Accept: "application/json",
        },
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
          error: `JSON API error ${res.status}`,
        };
      }

      const jsonStr = await res.text();
      const cleanText = jsonStr;
      const data = new TextEncoder().encode(jsonStr);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const contentHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");

      return {
        url,
        canonicalUrl: url,
        status: "success",
        httpStatus: res.status,
        rawContent: jsonStr,
        cleanText,
        title: "JSON API Response",
        contentHash,
        simhash: computeSimHash(cleanText),
        byteSize: jsonStr.length,
        links: [],
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
