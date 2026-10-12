"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ME_KEY } from "@/hooks/use-auth";
import { authApi } from "@/lib/api-client";
import { ROLE_HOME } from "@/lib/constants";
import type { VerifyEmailInput } from "@/lib/validations/auth";
import type { AuthResult } from "@/types/api";

export function useVerifyEmail() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (values: VerifyEmailInput) =>
      authApi.verifyEmail<AuthResult>(values),
    onSuccess: ({ data }) => {
      qc.removeQueries({ queryKey: ME_KEY });
      toast.success("Email verified. Welcome to SkillForge!");
      router.replace(ROLE_HOME[data.user.role]);
      router.refresh();
    },
  });
}
