export type ApiErrorCode =
  | "network"
  | "aborted"
  | "http"
  | "invalid-response"
  | "not-implemented"
  | "validation";

/** Normalized error thrown by every API adapter so screens handle one shape. */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | null;
  readonly details: unknown;

  constructor(
    code: ApiErrorCode,
    message: string,
    options: { status?: number | null; details?: unknown; cause?: unknown } = {},
  ) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = "ApiError";
    this.code = code;
    this.status = options.status ?? null;
    this.details = options.details;
  }

  /** Client errors are deterministic; retrying them cannot succeed. */
  get isRetryable(): boolean {
    if (this.code === "network") return true;
    if (this.code === "http" && this.status !== null) {
      return this.status >= 500 || this.status === 408 || this.status === 429;
    }
    return false;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
