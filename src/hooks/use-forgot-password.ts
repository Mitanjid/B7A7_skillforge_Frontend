"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { ForgotPasswordInput } from "@/lib/validations/auth";

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: ForgotPasswordInput) =>
      api.post<null>("/auth/forgot-password", values),
    onSuccess: (_res, variables) => {
      toast.success("If that email exists, a code has been sent.");
      router.push(
        `/reset-password?email=${encodeURIComponent(variables.email)}`,
      );
    },
  });
}
