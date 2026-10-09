import type { ApiFieldError, ApiSuccess } from "@/types/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: ApiFieldError[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_BASE = "/api/v1";

type Query = Record<string, string | number | boolean | null | undefined>;

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Query;
}

const buildUrl = (base: string, path: string, query?: Query) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return `${base}${path}${qs ? `?${qs}` : ""}`;
};

let refreshing: Promise<boolean> | null = null;
const refreshSession = () => {
  refreshing ??= fetch("/api/auth/refresh", { method: "POST" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
};

async function request<T>(
  path: string,
  { body, query, headers, ...init }: RequestOptions = {},
  canRetry = true,
): Promise<ApiSuccess<T>> {
  const isForm = body instanceof FormData;

  const res = await fetch(buildUrl(API_BASE, path, query), {
    ...init,
    credentials: "include",
    headers: {
      ...(body !== undefined && !isForm
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : isForm
          ? (body as FormData)
          : JSON.stringify(body),
  });

  const json = await res.json().catch(() => null);

  if (res.status === 401 && canRetry) {
    if (await refreshSession()) {
      return request<T>(path, { body, query, headers, ...init }, false);
    }
  }

  if (!res.ok || !json?.success) {
    throw new ApiError(
      res.status,
      json?.message ?? "Something went wrong. Please try again.",
      json?.errors ?? [],
    );
  }

  return json as ApiSuccess<T>;
}

export const api = {
  get: <T>(path: string, query?: Query) => request<T>(path, { query }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

async function authRequest<T>(
  path: string,
  body?: unknown,
): Promise<ApiSuccess<T>> {
  const res = await fetch(`/api/auth${path}`, {
    method: "POST",
    credentials: "include",
    headers: body !== undefined ? { "Content-Type": "application/json" } : {},
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new ApiError(
      res.status,
      json?.message ?? "Something went wrong. Please try again.",
      json?.errors ?? [],
    );
  }
  return json as ApiSuccess<T>;
}

export const authApi = {
  login: <T>(body: { email: string; password: string }) =>
    authRequest<T>("/login", body),
  verifyEmail: <T>(body: { email: string; otp: string }) =>
    authRequest<T>("/verify-email", body),
  google: <T>(body: { idToken: string; role?: "CANDIDATE" | "COMPANY" }) =>
    authRequest<T>("/google", body),
  refresh: () => authRequest<null>("/refresh"),
  logout: () => authRequest<null>("/logout"),
};
