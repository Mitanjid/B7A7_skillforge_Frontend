import "server-only";
import { cookies } from "next/headers";
import { serverFetch } from "@/lib/server-api";
import type { User } from "@/types/api";

// Returns the signed-in user, or null for visitors. Skips the backend call
// entirely when there is no auth cookie, so anonymous visits stay fast.
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  if (!store.get("accessToken")) return null;

  try {
    const res = await serverFetch<User>("/users/me");
    return res.data;
  } catch {
    return null;
  }
}
