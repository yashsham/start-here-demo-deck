import type { ErrorHandler } from "hono";
import type { AppVariables, Env } from "../../types/env.js";
import { ApiError } from "../errors.js";

export const customErrorHandler: ErrorHandler<{ Bindings: Env; Variables: AppVariables }> = (err, c) => {
  const correlationId = c.get("correlationId") || "unknown";
  
  if (err instanceof ApiError) {
    return c.json(
      {
        success: false,
        error: {
          code: err.code,
          message: err.message,
          details: err.details,
          correlationId,
        },
      },
      err.statusCode as any
    );
  }

  console.error(`[UnhandledError] ${correlationId}:`, err);
  return c.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: err.message || "An unexpected internal server error occurred",
        correlationId,
      },
    },
    500
  );
};
