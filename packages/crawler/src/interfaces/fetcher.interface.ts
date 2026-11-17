export interface FetchOptions {
  timeoutMs?: number;
  maxSizeBytes?: number;
  etag?: string | null;
  lastModified?: string | null;
  userAgent?: string;
  allowRedirects?: boolean;
  maxRedirects?: number;
}

export interface FetchResult {
  url: string;
  canonicalUrl: string;
  status: "success" | "not_modified" | "failed" | "blocked_robots" | "blocked_ssrf" | "oversized";
  httpStatus?: number;
  rawContent?: string;
  cleanText?: string;
  title?: string;
  etag?: string | null;
  lastModified?: string | null;
  contentHash: string;
  simhash: bigint;
  byteSize: number;
  links: string[];
  error?: string;
}

export interface FetcherStrategy {
  readonly supportedType: string;
  fetch(url: string, options?: FetchOptions): Promise<FetchResult>;
}

export interface SourceHealth {
  sourceId: string;
  url: string;
  lastSuccessfulCrawl?: string;
  lastFailure?: string;
  consecutiveFailures: number;
  lastHttpStatus?: number;
  totalCrawls: number;
  duplicateRate: number;
  robotsStatus: "allowed" | "disallowed" | "check_failed";
}
