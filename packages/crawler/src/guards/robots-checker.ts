import robotsParser from "robots-parser";

interface CachedRobots {
  parser: any;
  expiresAt: number;
}

export class RobotsChecker {
  private cache = new Map<string, CachedRobots>();
  private defaultTtlMs = 24 * 60 * 60 * 1000; // 24 hours

  async isAllowed(url: string, userAgent: string): Promise<boolean> {
    try {
      const parsed = new URL(url);
      const origin = parsed.origin;
      const robotsUrl = `${origin}/robots.txt`;

      let cached = this.cache.get(origin);
      if (!cached || Date.now() > cached.expiresAt) {
        try {
          const res = await fetch(robotsUrl, {
            headers: { "User-Agent": userAgent },
            signal: AbortSignal.timeout(5000),
          });
          const robotsTxt = res.ok ? await res.text() : "";
          const parser = robotsParser(robotsUrl, robotsTxt);
          cached = { parser, expiresAt: Date.now() + this.defaultTtlMs };
          this.cache.set(origin, cached);
        } catch {
          // If robots.txt fetch fails or times out, fail open politely
          const parser = robotsParser(robotsUrl, "");
          cached = { parser, expiresAt: Date.now() + 60000 };
          this.cache.set(origin, cached);
        }
      }

      return cached.parser.isAllowed(url, userAgent) ?? true;
    } catch {
      return true;
    }
  }
}
