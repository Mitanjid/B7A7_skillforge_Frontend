"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { ResetPasswordInput } from "@/lib/validations/auth";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: ResetPasswordInput) =>
      api.post<null>("/auth/reset-password", values),
    onSuccess: () => {
      toast.success("Password reset. Please log in.");
      router.push("/login");
    },
  });
}
