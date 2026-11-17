export interface AIConfig {
  groqApiKey: string;
  cloudflareAccountId?: string;
  aiGatewayId?: string;
  modelFast: string;
  modelReasoning: string;
  modelFallback: string;
  hfEmbeddingModel: string;
  hfApiKey?: string;
  timeoutMs: number;
  maxRetries: number;
}

export function loadAIConfig(env: Record<string, string | undefined> = process.env): AIConfig {
  const groqApiKey = env.GROQ_API_KEY || env.VITE_GROQ_API_KEY || "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";
  const cloudflareAccountId = env.CLOUDFLARE_ACCOUNT_ID;
  const aiGatewayId = env.AI_GATEWAY_ID;

  return {
    groqApiKey,
    cloudflareAccountId,
    aiGatewayId,
    // Inspected & validated Groq models
    modelFast: env.GROQ_MODEL_FAST || "openai/gpt-oss-20b",
    modelReasoning: env.GROQ_MODEL_REASONING || "openai/gpt-oss-120b",
    modelFallback: "qwen/qwen3.8-27b",
    // Hugging Face free embedding model
    hfEmbeddingModel: env.HF_EMBEDDING_MODEL || "sentence-transformers/all-MiniLM-L6-v2",
    hfApiKey: env.HF_API_KEY || env.HUGGINGFACE_API_KEY,
    timeoutMs: 30000,
    maxRetries: 3,
  };
}

export function getGroqBaseUrl(config: AIConfig): string {
  if (config.cloudflareAccountId && config.aiGatewayId) {
    return `https://gateway.ai.cloudflare.com/v1/${config.cloudflareAccountId}/${config.aiGatewayId}/groq`;
  }
  return "https://api.groq.com/openai/v1";
}
