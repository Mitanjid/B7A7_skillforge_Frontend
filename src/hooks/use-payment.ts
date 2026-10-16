"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { InitiatePaymentResult, Payment } from "@/types/api";

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (assessmentId: string) =>
      api.post<InitiatePaymentResult>("/payments/initiate", { assessmentId }),
    onSuccess: ({ data }) => {
      window.location.href = data.gatewayPageURL;
    },
  });
}

export function useMyPayments(filters: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["payments", filters],
    queryFn: async () => {
      const res = await api.get<Payment[]>("/payments/my", {
        ...filters,
        limit: filters.limit ?? 10,
      });
      return { payments: res.data, meta: res.meta };
    },
  });
}
