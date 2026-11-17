export interface CloudflareQueue<T = any> {
  send(message: T): Promise<void>;
  sendBatch(messages: Iterable<{ body: T }>): Promise<void>;
}

export interface CloudflareScheduledEvent {
  cron: string;
  type: string;
  scheduledTime: number;
}

export interface CloudflareExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export interface CloudflareMessageBatch<T = any> {
  readonly queue: string;
  readonly messages: readonly {
    readonly id: string;
    readonly timestamp: Date;
    readonly body: T;
    ack(): void;
    retry(): void;
  }[];
  ackAll(): void;
  retryAll(): void;
}

declare global {
  interface Queue<T = any> extends CloudflareQueue<T> {}
  interface ScheduledEvent extends CloudflareScheduledEvent {}
  interface ExecutionContext extends CloudflareExecutionContext {}
  interface MessageBatch<T = any> extends CloudflareMessageBatch<T> {}
}

export interface Env {
  ENVIRONMENT: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  GROQ_API_KEY?: string;
  TAVILY_API_KEY?: string;
  INTELLIGENCE_QUEUE?: CloudflareQueue<any>;
}

export interface AppVariables {
  correlationId: string;
  orgId: string;
  userId?: string;
}
