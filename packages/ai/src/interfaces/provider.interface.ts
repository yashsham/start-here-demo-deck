import type { z } from "zod";

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ILLMCompletion {
  content: string;
  model: string;
  usage: TokenUsage;
  latencyMs: number;
}

export interface CompletionOptions {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json_object";
  timeoutMs?: number;
}

export interface StructuredOptions<T> extends Omit<CompletionOptions, "responseFormat"> {
  schema: z.ZodType<T>;
  schemaName: string;
}

export interface ILLMProvider {
  readonly name: string;
  generateCompletion(options: CompletionOptions): Promise<ILLMCompletion>;
  generateStructured<T>(options: StructuredOptions<T>): Promise<{ data: T; usage: TokenUsage; raw: string }>;
}

export interface IEmbeddingProvider {
  readonly name: string;
  readonly dimension: number;
  generateEmbedding(text: string): Promise<number[]>;
  generateEmbeddings(texts: string[]): Promise<number[][]>;
  cosineSimilarity(vecA: number[], vecB: number[]): number;
}

export interface PromptTemplate {
  id: string;
  version: string;
  systemTemplate: string;
  userTemplate: string;
  description: string;
}

export interface IPromptRegistry {
  getPrompt(id: string, version?: string): PromptTemplate;
  registerPrompt(prompt: PromptTemplate): void;
  render(id: string, variables: Record<string, unknown>, version?: string): { system: string; user: string };
}

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationFailure {
  success: false;
  error: string;
  rawJson: string;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export interface IOutputValidator {
  validate<T>(schema: z.ZodType<T>, rawJson: string): ValidationResult<T>;
  repairJson(raw: string): string;
}

export type TaskType = 
  | "company_understanding"
  | "adaptive_interview"
  | "source_discovery"
  | "competitor_discovery"
  | "signal_classification"
  | "strategic_analysis"
  | "signal_ranking"
  | "monday_brief"
  | "hallucination_verification";

export interface RouteConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface IModelRouter {
  route(taskType: TaskType): RouteConfig;
}
