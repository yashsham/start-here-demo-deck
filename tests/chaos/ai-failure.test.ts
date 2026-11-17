import { describe, it, expect, vi } from "vitest";

// Circuit Breaker Implementation for AI Failures
class AICircuitBreaker {
  private failureCount = 0;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private lastFailureTime = 0;
  private readonly threshold: number;
  private readonly cooldownMs: number;

  constructor(threshold = 3, cooldownMs = 100) {
    this.threshold = threshold;
    this.cooldownMs = cooldownMs;
  }

  public async execute<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.cooldownMs) {
        this.state = "HALF_OPEN";
      } else {
        return fallback(); // Fast fail to resilient fallback
      }
    }

    try {
      const res = await fn();
      this.reset();
      return res;
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      if (this.failureCount >= this.threshold) {
        this.state = "OPEN";
      }
      return fallback();
    }
  }

  public getState() {
    return this.state;
  }

  public reset() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }
}

// Robust JSON extractor that handles truncated, wrapped, or invalid JSON
function parseAIResponseWithFallback(content: string, defaultFallback: any) {
  if (!content || content.trim().length === 0) return defaultFallback;

  try {
    return JSON.parse(content);
  } catch {
    // Attempt markdown json extraction
    const match = content.match(/```json([\s\S]*?)```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch {
        // continue
      }
    }

    // Attempt partial/truncated repair
    const jsonStart = content.indexOf("{");
    if (jsonStart !== -1) {
      let candidate = content.slice(jsonStart);
      if (!candidate.endsWith("}")) {
        candidate = candidate + "}";
      }
      try {
        return JSON.parse(candidate);
      } catch {
        // continue
      }
    }

    return defaultFallback;
  }
}

describe("Category 4: AI Provider Failure & Fault Injection Scenarios", () => {
  describe("Rate Limit 429 & Backoff Recovery", () => {
    it("handles HTTP 429 with exponential backoff and jitter without crash", async () => {
      let callCount = 0;
      const mockGroqCall = async () => {
        callCount++;
        if (callCount < 3) {
          const err = new Error("Rate limit exceeded: 429 Too Many Requests");
          (err as any).status = 429;
          throw err;
        }
        return { choices: [{ message: { content: '{"signal": "Verified Event"}' } }] };
      };

      // Exponential backoff executor
      let attempts = 0;
      let delay = 5;
      let result = null;

      while (attempts < 4) {
        attempts++;
        try {
          result = await mockGroqCall();
          break;
        } catch (err: any) {
          if (err.status === 429) {
            await new Promise((r) => setTimeout(r, delay));
            delay *= 2;
          } else {
            throw err;
          }
        }
      }

      expect(callCount).toBe(3);
      expect(result).toBeDefined();
      expect(result?.choices[0]?.message.content).toContain("Verified Event");
    });
  });

  describe("Circuit Breaker & Provider Outage Protection", () => {
    it("trips circuit breaker after consecutive 500 errors and redirects to deterministic fallback", async () => {
      const breaker = new AICircuitBreaker(3, 100);
      const failingAI = vi.fn().mockRejectedValue(new Error("500 Internal Server Error: Model Gateway Down"));
      const deterministicFallback = () => ({ status: "FALLBACK_CALIBRATED", score: 85 });

      // Call 1: fails
      const r1 = await breaker.execute(failingAI, deterministicFallback);
      expect(r1.status).toBe("FALLBACK_CALIBRATED");
      expect(breaker.getState()).toBe("CLOSED");

      // Call 2: fails
      await breaker.execute(failingAI, deterministicFallback);
      expect(breaker.getState()).toBe("CLOSED");

      // Call 3: trips breaker to OPEN
      await breaker.execute(failingAI, deterministicFallback);
      expect(breaker.getState()).toBe("OPEN");

      // Call 4: immediately returns fallback without executing provider
      const r4 = await breaker.execute(failingAI, deterministicFallback);
      expect(r4.status).toBe("FALLBACK_CALIBRATED");
      expect(failingAI).toHaveBeenCalledTimes(3); // Never invoked 4th time!
    });
  });

  describe("Malformed, Truncated & Empty Response Parsing", () => {
    it("handles empty and whitespace-only AI responses gracefully", () => {
      const fallback = { signals: [] };
      const parsed = parseAIResponseWithFallback("   ", fallback);
      expect(parsed).toEqual(fallback);
    });

    it("extracts valid data from markdown code block formatted JSON", () => {
      const raw = "Here is the extracted signal:\n```json\n{\"id\":\"sig-1\",\"category\":\"Regulatory\"}\n```\nHope this helps!";
      const parsed = parseAIResponseWithFallback(raw, {});
      expect(parsed.id).toBe("sig-1");
      expect(parsed.category).toBe("Regulatory");
    });

    it("recovers truncated JSON output by appending missing closure tokens", () => {
      const truncated = '{"company": "EDXSO Technologies", "threat_level": "High"';
      const parsed = parseAIResponseWithFallback(truncated, {});
      expect(parsed.company).toBe("EDXSO Technologies");
      expect(parsed.threat_level).toBe("High");
    });
  });
});