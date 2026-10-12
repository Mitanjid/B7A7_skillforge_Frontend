"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { RegisterInput } from "@/lib/validations/auth";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: RegisterInput) =>
      api.post<{ email: string }>("/auth/register", values),
    onSuccess: (_res, variables) => {
      toast.success("Account created. Check your email for the code.");
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
  });
}
