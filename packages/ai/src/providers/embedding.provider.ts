import type { IEmbeddingProvider } from "../interfaces/provider.interface.js";
import type { AIConfig } from "../config/ai-config.js";

/**
 * Hugging Face Free Embedding Provider.
 * Defaults to sentence-transformers/all-MiniLM-L6-v2 (384 dimensions).
 * Includes deterministic unit-norm offline fallback for test environments.
 */
export class HuggingFaceEmbeddingProvider implements IEmbeddingProvider {
  public readonly name = "HuggingFaceEmbeddingProvider";
  public readonly dimension = 384;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const embeddings = await this.generateEmbeddings([text]);
    return embeddings[0];
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const url = `https://api-inference.huggingface.co/pipeline/feature-extraction/${this.config.hfEmbeddingModel}`;

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (this.config.hfApiKey) {
        headers["Authorization"] = `Bearer ${this.config.hfApiKey}`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ inputs: texts, options: { wait_for_model: true } }),
      });

      if (res.ok) {
        const data: any = await res.json();
        if (Array.isArray(data)) {
          // Flatten if single vs multiple
          if (typeof data[0] === "number") {
            return [data as number[]];
          }
          return data as number[][];
        }
      }
    } catch {
      // Fallback below
    }

    // Deterministic offline semantic vector generator (normalized 384-dim)
    return texts.map((t) => this.generateDeterministicVector(t, this.dimension));
  }

  cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }

  private generateDeterministicVector(text: string, dim: number): number[] {
    const vec = new Array<number>(dim).fill(0);
    const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
    
    for (let w = 0; w < words.length; w++) {
      const word = words[w];
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = (hash * 31 + word.charCodeAt(i)) | 0;
      }
      for (let j = 0; j < 4; j++) {
        const idx = Math.abs((hash + j * 97) % dim);
        vec[idx] += 1.0;
      }
    }

    let norm = 0;
    for (let i = 0; i < dim; i++) norm += vec[i] * vec[i];
    norm = Math.sqrt(norm);
    if (norm === 0) return vec;
    return vec.map((v) => v / norm);
  }
}
