import type { CompletionOptions, ILLMCompletion, ILLMProvider, StructuredOptions, TokenUsage } from "../interfaces/provider.interface.js";
import { type AIConfig, getGroqBaseUrl } from "../config/ai-config.js";

export class GroqProvider implements ILLMProvider {
  public readonly name = "GroqProvider";
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async generateCompletion(options: CompletionOptions): Promise<ILLMCompletion> {
    const baseUrl = getGroqBaseUrl(this.config);
    const url = `${baseUrl}/chat/completions`;
    const start = Date.now();

    const payload = {
      model: options.model,
      messages: [
        { role: "system", content: options.systemPrompt },
        { role: "user", content: options.userPrompt },
      ],
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens ?? 4096,
      response_format: options.responseFormat === "json_object" ? { type: "json_object" } : undefined,
    };

    let attempt = 0;
    while (attempt <= this.config.maxRetries) {
      attempt++;
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? this.config.timeoutMs);

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.groqApiKey}`,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (res.status === 429) {
          // Rate limit exceeded: jittered exponential backoff
          const retryAfter = Number(res.headers.get("retry-after") || "1");
          const backoff = Math.min(8000, retryAfter * 1000 + Math.random() * 500);
          console.warn(`[GroqProvider] 429 Rate limit hit, backing off ${backoff}ms (attempt ${attempt})`);
          await new Promise((r) => setTimeout(r, backoff));
          continue;
        }

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Groq HTTP error ${res.status}: ${errText}`);
        }

        const data: any = await res.json();
        const content = data.choices?.[0]?.message?.content || "";
        const usage: TokenUsage = {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        };

        return {
          content,
          model: options.model,
          usage,
          latencyMs: Date.now() - start,
        };
      } catch (err: any) {
        if (attempt > this.config.maxRetries) throw err;
        const delay = Math.pow(2, attempt) * 300 + Math.random() * 200;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    throw new Error(`GroqProvider failed after ${this.config.maxRetries} retries`);
  }

  async generateStructured<T>(options: StructuredOptions<T>): Promise<{ data: T; usage: TokenUsage; raw: string }> {
    const systemWithSchema = `${options.systemPrompt}
You MUST respond with valid JSON matching this schema:
${options.schemaName}
Do NOT include markdown formatting like \`\`\`json. Return raw valid JSON.`;

    const completion = await this.generateCompletion({
      ...options,
      systemPrompt: systemWithSchema,
      responseFormat: "json_object",
    });

    try {
      const parsed = JSON.parse(completion.content);
      const validated = options.schema.parse(parsed);
      return { data: validated, usage: completion.usage, raw: completion.content };
    } catch (parseError: any) {
      console.warn(`[GroqProvider] First attempt malformed JSON. Retrying with error feedback.`);
      // Retry once with error feedback
      const retryCompletion = await this.generateCompletion({
        ...options,
        systemPrompt: systemWithSchema,
        userPrompt: `${options.userPrompt}
CRITICAL FIX: Your previous response was invalid JSON or violated schema with error: "${parseError.message}". Output ONLY valid parseable JSON.`,
        responseFormat: "json_object",
      });
      const parsedRetry = JSON.parse(retryCompletion.content);
      const validatedRetry = options.schema.parse(parsedRetry);
      return { data: validatedRetry, usage: retryCompletion.usage, raw: retryCompletion.content };
    }
  }
}
