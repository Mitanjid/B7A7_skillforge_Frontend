"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { ProblemInput } from "@/lib/validations/problem";
import type { ApiMeta, Problem } from "@/types/api";

interface ProblemFilters {
  page?: number;
  limit?: number;
  type?: string;
  difficulty?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function useProblems(filters: ProblemFilters) {
  return useQuery({
    queryKey: ["problems", filters],
    queryFn: async () => {
      const res = await api.get<Problem[]>("/problems", {
        ...filters,
        limit: filters.limit ?? 10,
      });
      return { problems: res.data, meta: res.meta as ApiMeta };
    },
  });
}

export function useProblem(id: string) {
  return useQuery({
    queryKey: ["problems", id],
    queryFn: async () => (await api.get<Problem>(`/problems/${id}`)).data,
    enabled: !!id,
  });
}

export function useCreateProblem() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: ProblemInput) =>
      api.post<Problem>("/problems", values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem created");
      router.push("/company/problems");
    },
  });
}

export function useUpdateProblem(id: string) {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: Partial<ProblemInput>) =>
      api.patch<Problem>(`/problems/${id}`, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem updated");
      router.push("/company/problems");
    },
  });
}

export function useDeleteProblem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<null>(`/problems/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem deleted");
    },
  });
}
