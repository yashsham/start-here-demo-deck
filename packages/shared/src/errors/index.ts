export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code = "INTERNAL_ERROR", statusCode = 500, details?: Record<string, unknown>) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with ID '${id}'` : ""} not found`, "NOT_FOUND", 404);
  }
}

export class SSRFBlockedError extends AppError {
  constructor(targetUrl: string, reason: string) {
    super(`SSRF Protection: Blocked target '${targetUrl}': ${reason}`, "SSRF_BLOCKED", 403);
  }
}

export class RateLimitExceededError extends AppError {
  constructor(host: string, retryAfterSeconds: number) {
    super(`Rate limit exceeded for host '${host}'. Retry after ${retryAfterSeconds}s`, "RATE_LIMIT_EXCEEDED", 429, {
      retryAfterSeconds,
    });
  }
}

export class HallucinationDetectedError extends AppError {
  constructor(groundednessScore: number, minRequired: number) {
    super(
      `AI generation rejected: groundedness score ${groundednessScore.toFixed(2)} is below required ${minRequired.toFixed(2)}`,
      "HALLUCINATION_DETECTED",
      422,
      { groundednessScore, minRequired }
    );
  }
}
