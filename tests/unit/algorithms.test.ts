import { describe, it, expect } from "vitest";
import {
  computeSimHash,
  hammingDistance,
  isNearDuplicate,
  MinHeap,
  TokenBucket,
  AhoCorasick,
} from "../../packages/algorithms/src/index.js";

describe("Algorithms - SimHash 64-bit", () => {
  it("detects identical texts with zero Hamming distance", () => {
    const text = "NVIDIA acquires quantum chipmaker in massive strategic push for AI infrastructure dominance.";
    const hashA = computeSimHash(text);
    const hashB = computeSimHash(text);
    expect(hashA).toBe(hashB);
    expect(hammingDistance(hashA, hashB)).toBe(0);
    expect(isNearDuplicate(hashA, hashB, 3)).toBe(true);
  });

  it("detects near-duplicate texts with minor word adjustments", () => {
    const textA = "NVIDIA acquires leading quantum chipmaker in a strategic push for AI infrastructure.";
    const textB = "NVIDIA acquires leading quantum chipmaker in strategic push for AI infrastructure.";
    const hashA = computeSimHash(textA);
    const hashB = computeSimHash(textB);
    const dist = hammingDistance(hashA, hashB);
    expect(dist).toBeLessThanOrEqual(3);
    expect(isNearDuplicate(hashA, hashB, 3)).toBe(true);
  });

  it("distinguishes completely different texts", () => {
    const textA = "Tesla reports record delivery numbers in European automotive markets.";
    const textB = "Pfizer receives FDA fast-track approval for next-generation oncology immunotherapy.";
    const hashA = computeSimHash(textA);
    const hashB = computeSimHash(textB);
    const dist = hammingDistance(hashA, hashB);
    expect(dist).toBeGreaterThan(10);
    expect(isNearDuplicate(hashA, hashB, 3)).toBe(false);
  });
});

describe("Algorithms - MinHeap Priority Queue", () => {
  it("orders items in min-heap order", () => {
    interface Job {
      id: string;
      scheduledAt: number;
    }

    const pq = new MinHeap<Job>((a, b) => a.scheduledAt - b.scheduledAt);
    pq.push({ id: "job3", scheduledAt: 300 });
    pq.push({ id: "job1", scheduledAt: 100 });
    pq.push({ id: "job4", scheduledAt: 400 });
    pq.push({ id: "job2", scheduledAt: 200 });

    expect(pq.size).toBe(4);
    expect(pq.peek()?.id).toBe("job1");

    expect(pq.pop()?.id).toBe("job1");
    expect(pq.pop()?.id).toBe("job2");
    expect(pq.pop()?.id).toBe("job3");
    expect(pq.pop()?.id).toBe("job4");
    expect(pq.isEmpty()).toBe(true);
  });
});

describe("Algorithms - Token Bucket Rate Limiter", () => {
  it("consumes tokens and refuses when exhausted", () => {
    const bucket = new TokenBucket(3, 10);
    expect(bucket.tryConsume(1)).toBe(true);
    expect(bucket.tryConsume(2)).toBe(true);
    expect(bucket.tryConsume(1)).toBe(false);
  });
});

describe("Algorithms - Aho-Corasick Multi-Pattern Search", () => {
  it("matches multiple keywords simultaneously in text", () => {
    const ac = new AhoCorasick<{ type: string }>();
    ac.addPattern("NVDA", { type: "ticker" });
    ac.addPattern("Jensen Huang", { type: "executive" });
    ac.addPattern("antitrust", { type: "regulatory" });

    const article = "CEO Jensen Huang announced NVDA will address antitrust scrutiny in Europe.";
    const matches = ac.search(article);

    expect(matches.length).toBe(3);
    const patterns = matches.map((m) => m.pattern);
    expect(patterns).toContain("Jensen Huang");
    expect(patterns).toContain("NVDA");
    expect(patterns).toContain("antitrust");
  });
});
