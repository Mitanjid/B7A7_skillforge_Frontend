"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import type { User } from "@/types/api";

export const ME_KEY = ["me"] as const;

export function useAuth() {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: ME_KEY,
    queryFn: async () => (await api.get<User>("/users/me")).data,
    retry: false,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    setUser(query.data ?? null);
  }, [query.data, setUser]);

  return {
    user: query.data ?? null,
    role: query.data?.role ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
  };
}

export function useInvalidateAuth() {
  const qc = useQueryClient();
  return () => qc.removeQueries({ queryKey: ME_KEY });
}
