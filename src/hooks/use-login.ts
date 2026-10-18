"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ME_KEY } from "@/hooks/use-auth";
import { authApi } from "@/lib/api-client";
import { ROLE_HOME } from "@/lib/constants";
import type { LoginInput } from "@/lib/validations/auth";
import type { AuthResult } from "@/types/api";

export function useLogin(options: { toDashboard?: boolean } = {}) {
  const router = useRouter();
  const params = useSearchParams();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (values: LoginInput) => authApi.login<AuthResult>(values),
    onSuccess: ({ data }) => {
      qc.removeQueries({ queryKey: ME_KEY });
      toast.success("Logged in successfully");

      const next = params.get("next");
      const safeNext =
        next?.startsWith("/") && !next.startsWith("//") ? next : null;

      // ?next= (e.g. invitation link) wins, then demo -> dashboard, else home
      router.replace(
        safeNext ?? (options.toDashboard ? ROLE_HOME[data.user.role] : "/"),
      );
      router.refresh();
    },
  });
}
