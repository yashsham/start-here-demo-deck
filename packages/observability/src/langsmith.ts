export interface LangSmithRun {
  id?: string;
  name: string;
  run_type: "llm" | "chain" | "tool" | "retriever";
  inputs: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  error?: string;
  start_time?: number;
  end_time?: number;
  extra?: Record<string, unknown>;
}

export class LangSmithTracer {
  private apiKey: string;
  private projectName: string;
  private endpoint = "https://api.smith.langchain.com/runs";

  constructor(apiKey?: string, projectName = "signalstackintern") {
    let key = apiKey;
    try {
      if (!key && typeof process !== "undefined" && process?.env?.["LANGSMITH_API_KEY"]) {
        key = process.env["LANGSMITH_API_KEY"];
      }
    } catch {
      // ignore
    }
    try {
      if (!key && typeof import.meta !== "undefined" && (import.meta as any)?.env?.["VITE_LANGSMITH_API_KEY"]) {
        key = (import.meta as any).env["VITE_LANGSMITH_API_KEY"];
      }
    } catch {
      // ignore
    }
    this.apiKey = key || "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";
    this.projectName = projectName;
  }

  async traceRun(run: LangSmithRun): Promise<void> {
    if (!this.apiKey) return;

    const runId = run.id || crypto.randomUUID();
    const payload = {
      id: runId,
      name: run.name,
      run_type: run.run_type,
      start_time: typeof run.start_time === "number" ? new Date(run.start_time).toISOString() : new Date().toISOString(),
      end_time: typeof run.end_time === "number" ? new Date(run.end_time).toISOString() : new Date().toISOString(),
      inputs: run.inputs,
      outputs: run.outputs,
      error: run.error,
      session_name: this.projectName,
      session_id: "894a2737-b351-440d-965b-164b40055e77",
      extra: {
        project_name: this.projectName,
        ...run.extra,
      },
    };

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Non-blocking telemetry
      console.warn(`[LangSmithTracer] Telemetry post skipped:`, err);
    }
  }
}

export const langsmith = new LangSmithTracer();
