/**
 * Token Bucket Rate Limiter with burst capacity and smooth refills.
 */
export class TokenBucket {
  private capacity: number;
  private refillRatePerSecond: number;
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(capacity: number, refillRatePerSecond: number) {
    if (capacity <= 0 || refillRatePerSecond <= 0) {
      throw new Error("Capacity and refill rate must be positive numbers.");
    }
    this.capacity = capacity;
    this.refillRatePerSecond = refillRatePerSecond;
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    const addedTokens = elapsedSeconds * this.refillRatePerSecond;
    this.tokens = Math.min(this.capacity, this.tokens + addedTokens);
    this.lastRefillTimestamp = now;
  }

  tryConsume(count = 1): boolean {
    this.refill();
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    return false;
  }

  async waitForToken(count = 1, timeoutMs = 10000): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      if (this.tryConsume(count)) {
        return true;
      }
      const waitMs = Math.min(200, Math.ceil((count - this.tokens) / this.refillRatePerSecond * 1000));
      await new Promise((resolve) => setTimeout(resolve, Math.max(25, waitMs)));
    }
    return false;
  }

  getAvailableTokens(): number {
    this.refill();
    return this.tokens;
  }

  reset(): void {
    this.tokens = this.capacity;
    this.lastRefillTimestamp = Date.now();
  }
}
