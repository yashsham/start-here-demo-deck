import type { IModelRouter, RouteConfig, TaskType } from "../interfaces/provider.interface.js";
import type { AIConfig } from "../config/ai-config.js";

export class ModelRouter implements IModelRouter {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  route(taskType: TaskType): RouteConfig {
    switch (taskType) {
      // High-throughput, low-latency extraction and classification tasks
      case "signal_classification":
      case "source_discovery":
      case "competitor_discovery":
      case "hallucination_verification":
        return {
          model: this.config.modelFast, // openai/gpt-oss-20b
          temperature: 0.1,
          maxTokens: 2048,
        };

      // Flagship deep reasoning and executive deliverable synthesis
      case "company_understanding":
      case "adaptive_interview":
      case "strategic_analysis":
      case "signal_ranking":
      case "monday_brief":
      default:
        return {
          model: this.config.modelReasoning, // openai/gpt-oss-120b
          temperature: 0.2,
          maxTokens: 4096,
        };
    }
  }
}
