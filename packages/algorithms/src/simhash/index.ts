/**
 * 64-bit SimHash implementation for near-duplicate document detection.
 * Typically, documents with Hamming distance <= 3 are considered near-duplicates.
 */

// 64-bit FNV-1a hash function for strings
function fnv1a64(str: string): bigint {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const mask = 0xffffffffffffffffn;

  for (let i = 0; i < str.length; i++) {
    hash ^= BigInt(str.charCodeAt(i));
    hash = (hash * prime) & mask;
  }
  return hash;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

export function computeSimHash(text: string, ngramSize = 3): bigint {
  const tokens = tokenize(text);
  if (tokens.length === 0) return 0n;

  // Build character or word n-grams
  const features: string[] = [];
  if (tokens.length < ngramSize) {
    features.push(...tokens);
  } else {
    for (let i = 0; i <= tokens.length - ngramSize; i++) {
      features.push(tokens.slice(i, i + ngramSize).join(" "));
    }
  }

  const v = new Array<number>(64).fill(0);

  for (const feature of features) {
    const hash = fnv1a64(feature);
    for (let i = 0; i < 64; i++) {
      const bit = (hash >> BigInt(i)) & 1n;
      v[i] += bit === 1n ? 1 : -1;
    }
  }

  let fingerprint = 0n;
  for (let i = 0; i < 64; i++) {
    if (v[i] > 0) {
      fingerprint |= 1n << BigInt(i);
    }
  }

  return fingerprint;
}

export function hammingDistance(hashA: bigint, hashB: bigint): number {
  let x = hashA ^ hashB;
  let dist = 0;
  while (x > 0n) {
    dist += Number(x & 1n);
    x >>= 1n;
  }
  return dist;
}

export function isNearDuplicate(hashA: bigint, hashB: bigint, threshold = 3): boolean {
  return hammingDistance(hashA, hashB) <= threshold;
}
