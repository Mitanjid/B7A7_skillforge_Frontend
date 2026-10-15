"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ME_KEY } from "@/hooks/use-auth";
import { authApi } from "@/lib/api-client";
import { ROLE_HOME } from "@/lib/constants";
import type { AuthResult } from "@/types/api";

interface GoogleLoginInput {
  idToken: string;
  role?: "CANDIDATE" | "COMPANY";
}

export function useGoogleLogin() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: GoogleLoginInput) => authApi.google<AuthResult>(input),
    onSuccess: ({ data }) => {
      qc.removeQueries({ queryKey: ME_KEY });
      toast.success("Signed in with Google");
      router.replace(ROLE_HOME[data.user.role]);
      router.refresh();
    },
  });
}
