import type { z } from "zod";
import { ApiError } from "./errors";

export type RequestOptions = {
  signal?: AbortSignal | undefined;
};

export type MutationOptions = RequestOptions & {
  /** Sent as `X-Idempotency-Key`; retries of the same intent must reuse it. */
  idempotencyKey: string;
};

type HttpClientOptions = {
  baseUrl: string;
  fetch?: typeof fetch;
  /** Extra headers per request, e.g. a session or (later) an auth token. */
  getHeaders?: () => Record<string, string>;
  credentials?: RequestCredentials;
};

type SendOptions<TSchema extends z.ZodType> = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  schema: TSchema;
  body?: unknown;
  signal?: AbortSignal | undefined;
  idempotencyKey?: string;
};

export type HttpClient = {
  get<TSchema extends z.ZodType>(
    path: string,
    schema: TSchema,
    options?: RequestOptions,
  ): Promise<z.infer<TSchema>>;
  post<TSchema extends z.ZodType>(
    path: string,
    body: unknown,
    schema: TSchema,
    options: MutationOptions,
  ): Promise<z.infer<TSchema>>;
};

function messageFromBody(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === "string") return message;
    if (Array.isArray(message) && message.every((item) => typeof item === "string")) {
      return message.join("; ");
    }
  }
  return fallback;
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Thin, typed fetch wrapper. Every response is validated against a runtime contract from
 * `@zenval/contracts` (or a draft schema) before it reaches the UI.
 */
export function createHttpClient(options: HttpClientOptions): HttpClient {
  const fetchImpl = options.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args));

  async function send<TSchema extends z.ZodType>(
    request: SendOptions<TSchema>,
  ): Promise<z.infer<TSchema>> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...options.getHeaders?.(),
    };
    if (request.body !== undefined) headers["Content-Type"] = "application/json";
    if (request.idempotencyKey) headers["X-Idempotency-Key"] = request.idempotencyKey;

    let response: Response;
    try {
      response = await fetchImpl(`${options.baseUrl}${request.path}`, {
        method: request.method,
        headers,
        ...(request.body === undefined ? {} : { body: JSON.stringify(request.body) }),
        ...(request.signal ? { signal: request.signal } : {}),
        ...(options.credentials ? { credentials: options.credentials } : {}),
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ApiError("aborted", "Request was cancelled", { cause: error });
      }
      throw new ApiError("network", "Network request failed", { cause: error });
    }

    const body = await readBody(response);
    if (!response.ok) {
      throw new ApiError(
        response.status === 501 ? "not-implemented" : "http",
        messageFromBody(body, `Request failed with status ${response.status}`),
        { status: response.status, details: body },
      );
    }

    const parsed = request.schema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError("invalid-response", "Response did not match the API contract", {
        status: response.status,
        details: parsed.error.issues,
      });
    }
    return parsed.data;
  }

  return {
    get: (path, schema, requestOptions) =>
      send({ method: "GET", path, schema, signal: requestOptions?.signal }),
    post: (path, body, schema, requestOptions) =>
      send({
        method: "POST",
        path,
        schema,
        body,
        signal: requestOptions.signal,
        idempotencyKey: requestOptions.idempotencyKey,
      }),
  };
}
