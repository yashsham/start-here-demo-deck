import { FetcherFactory } from "../fetchers/fetcher-factory.js";
import { RobotsChecker } from "../guards/robots-checker.js";
import { SSRFGuard } from "../guards/ssrf-guard.js";
import type { FetchOptions, FetchResult, SourceHealth } from "../interfaces/fetcher.interface.js";
import { TokenBucket } from "../../../algorithms/src/rate-limiter/index.js";
import { isNearDuplicate } from "../../../algorithms/src/simhash/index.js";

export interface CrawlJob {
  sourceId: string;
  url: string;
  sourceType: string;
  isApproved: boolean;
  previousContentHash?: string;
  previousSimHash?: bigint;
  etag?: string | null;
  lastModified?: string | null;
}

export interface CrawlPipelineResult {
  job: CrawlJob;
  fetchResult: FetchResult;
  isChanged: boolean;
  isDuplicate: boolean;
  duplicateReason?: "exact_hash" | "simhash_near_duplicate";
  shouldTriggerAI: boolean;
  health: SourceHealth;
}

export class CrawlPipeline {
  private robotsChecker = new RobotsChecker();
  private domainBuckets = new Map<string, TokenBucket>();
  private userAgent = "SignalStack-Bot/1.0 (+https://edxso.com/bot; bot@edxso.com)";
  private knownHashes = new Set<string>();
  private knownSimhashes: bigint[] = [];

  // Rate limiter: 2 requests per second per domain with capacity 5
  private getRateLimiter(hostname: string): TokenBucket {
    let bucket = this.domainBuckets.get(hostname);
    if (!bucket) {
      bucket = new TokenBucket(5, 2);
      this.domainBuckets.set(hostname, bucket);
    }
    return bucket;
  }

  async processSource(job: CrawlJob, options: FetchOptions = {}): Promise<CrawlPipelineResult> {
    const health: SourceHealth = {
      sourceId: job.sourceId,
      url: job.url,
      consecutiveFailures: 0,
      totalCrawls: 1,
      duplicateRate: 0,
      robotsStatus: "allowed",
    };

    // 1. Source Approval Check
    if (!job.isApproved) {
      return {
        job,
        fetchResult: {
          url: job.url,
          canonicalUrl: job.url,
          status: "failed",
          contentHash: "",
          simhash: 0n,
          byteSize: 0,
          links: [],
          error: "Crawl rejected: Source is not approved",
        },
        isChanged: false,
        isDuplicate: false,
        shouldTriggerAI: false,
        health: { ...health, lastFailure: new Date().toISOString(), consecutiveFailures: 1 },
      };
    }

    // 2. SSRF Guard
    const ssrfCheck = SSRFGuard.validateUrl(job.url);
    if (!ssrfCheck.allowed) {
      return {
        job,
        fetchResult: {
          url: job.url,
          canonicalUrl: job.url,
          status: "blocked_ssrf",
          contentHash: "",
          simhash: 0n,
          byteSize: 0,
          links: [],
          error: ssrfCheck.reason,
        },
        isChanged: false,
        isDuplicate: false,
        shouldTriggerAI: false,
        health: { ...health, lastFailure: new Date().toISOString(), consecutiveFailures: 1 },
      };
    }

    // 3. Robots.txt Check
    const allowed = await this.robotsChecker.isAllowed(job.url, this.userAgent);
    if (!allowed) {
      return {
        job,
        fetchResult: {
          url: job.url,
          canonicalUrl: job.url,
          status: "blocked_robots",
          contentHash: "",
          simhash: 0n,
          byteSize: 0,
          links: [],
          error: "Crawl disallowed by target robots.txt policy",
        },
        isChanged: false,
        isDuplicate: false,
        shouldTriggerAI: false,
        health: { ...health, robotsStatus: "disallowed", lastFailure: new Date().toISOString() },
      };
    }

    // 4. Rate Limiter Per Domain
    const domain = new URL(job.url).hostname;
    const bucket = this.getRateLimiter(domain);
    await bucket.waitForToken(1, 10000);

    // 5. Fetch Execution
    const fetcher = FetcherFactory.getStrategy(job.sourceType);
    const fetchResult = await fetcher.fetch(job.url, {
      ...options,
      etag: job.etag,
      lastModified: job.lastModified,
      userAgent: this.userAgent,
    });

    if (fetchResult.status === "failed" || fetchResult.status === "oversized") {
      health.lastFailure = new Date().toISOString();
      health.consecutiveFailures = 1;
      return {
        job,
        fetchResult,
        isChanged: false,
        isDuplicate: false,
        shouldTriggerAI: false,
        health,
      };
    }

    if (fetchResult.status === "not_modified") {
      health.lastSuccessfulCrawl = new Date().toISOString();
      return {
        job,
        fetchResult,
        isChanged: false,
        isDuplicate: true,
        duplicateReason: "exact_hash",
        shouldTriggerAI: false,
        health,
      };
    }

    // 6. Deduplication & Change Detection
    let isDuplicate = false;
    let duplicateReason: "exact_hash" | "simhash_near_duplicate" | undefined;

    if (job.previousContentHash && job.previousContentHash === fetchResult.contentHash) {
      isDuplicate = true;
      duplicateReason = "exact_hash";
    } else if (this.knownHashes.has(fetchResult.contentHash)) {
      isDuplicate = true;
      duplicateReason = "exact_hash";
    } else {
      // Near-duplicate check via SimHash (Hamming distance <= 3)
      for (const knownHash of this.knownSimhashes) {
        if (isNearDuplicate(fetchResult.simhash, knownHash, 3)) {
          isDuplicate = true;
          duplicateReason = "simhash_near_duplicate";
          break;
        }
      }
    }

    const isChanged = !isDuplicate && (!job.previousContentHash || job.previousContentHash !== fetchResult.contentHash);

    if (!isDuplicate) {
      this.knownHashes.add(fetchResult.contentHash);
      if (fetchResult.simhash !== 0n) {
        this.knownSimhashes.push(fetchResult.simhash);
      }
    }

    health.lastSuccessfulCrawl = new Date().toISOString();
    health.lastHttpStatus = fetchResult.httpStatus || 200;

    return {
      job,
      fetchResult,
      isChanged,
      isDuplicate,
      duplicateReason,
      // Change Detection Rule: Only run expensive AI processing if content actually changed
      shouldTriggerAI: isChanged,
      health,
    };
  }
}
