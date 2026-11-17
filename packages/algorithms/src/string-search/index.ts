/**
 * Aho-Corasick Multi-Pattern String Searching Automaton.
 * Matches multiple keywords (tickers, executive names, regulatory triggers) in linear time O(N + M + Z).
 */
interface TrieNode<T> {
  children: Map<string, TrieNode<T>>;
  fail: TrieNode<T> | null;
  outputs: Array<{ pattern: string; tag: T }>;
}

export interface MatchResult<T> {
  pattern: string;
  startIndex: number;
  endIndex: number;
  tag: T;
}

export class AhoCorasick<T = void> {
  private root: TrieNode<T>;
  private built = false;

  constructor() {
    this.root = this.createNode();
  }

  private createNode(): TrieNode<T> {
    return {
      children: new Map(),
      fail: null,
      outputs: [],
    };
  }

  addPattern(pattern: string, tag?: T): void {
    if (!pattern) return;
    this.built = false;
    let node = this.root;
    for (const char of pattern.toLowerCase()) {
      let next = node.children.get(char);
      if (!next) {
        next = this.createNode();
        node.children.set(char, next);
      }
      node = next;
    }
    node.outputs.push({ pattern, tag: tag as T });
  }

  build(): void {
    const queue: TrieNode<T>[] = [];

    // Root level transitions have fail link pointing to root
    for (const [, child] of this.root.children) {
      child.fail = this.root;
      queue.push(child);
    }

    // BFS to build fail transitions
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const [char, child] of current.children) {
        let fail = current.fail;
        while (fail !== null && !fail.children.has(char)) {
          fail = fail.fail;
        }
        child.fail = fail ? fail.children.get(char)! : this.root;
        // Merge outputs
        child.outputs = [...child.outputs, ...(child.fail?.outputs || [])];
        queue.push(child);
      }
    }
    this.built = true;
  }

  search(text: string): MatchResult<T>[] {
    if (!this.built) {
      this.build();
    }

    const results: MatchResult<T>[] = [];
    let current = this.root;
    const lowerText = text.toLowerCase();

    for (let i = 0; i < lowerText.length; i++) {
      const char = lowerText[i];
      while (current !== this.root && !current.children.has(char)) {
        current = current.fail || this.root;
      }
      current = current.children.get(char) || this.root;

      for (const out of current.outputs) {
        results.push({
          pattern: out.pattern,
          startIndex: i - out.pattern.length + 1,
          endIndex: i,
          tag: out.tag,
        });
      }
    }

    return results;
  }
}
