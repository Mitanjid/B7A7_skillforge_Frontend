import "server-only";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/api-client";
import type { ApiSuccess } from "@/types/api";

type Query = Record<string, string | number | boolean | null | undefined>;

export async function serverFetch<T>(
  path: string,
  query?: Query,
): Promise<ApiSuccess<T>> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  const store = await cookies();

  const res = await fetch(
    `${process.env.BACKEND_URL}/api/v1${path}${qs ? `?${qs}` : ""}`,
    {
      headers: { Cookie: store.toString() },
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    },
  );

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new ApiError(
      res.status,
      json?.message ?? "Request failed",
      json?.errors ?? [],
    );
  }
  return json as ApiSuccess<T>;
}
