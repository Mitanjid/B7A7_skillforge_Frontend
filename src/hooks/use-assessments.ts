"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { AssessmentDetailsInput } from "@/lib/validations/assessment";
import type { ApiMeta, Assessment } from "@/types/api";

interface AssessmentFilters {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function useAssessments(filters: AssessmentFilters) {
  return useQuery({
    queryKey: ["assessments", filters],
    queryFn: async () => {
      const res = await api.get<Assessment[]>("/assessments", {
        ...filters,
        limit: filters.limit ?? 10,
      });
      return { assessments: res.data, meta: res.meta as ApiMeta };
    },
  });
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ["assessments", id],
    queryFn: async () => (await api.get<Assessment>(`/assessments/${id}`)).data,
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data?.status === "DRAFT" ? false : 15_000,
  });
}

export function useCreateAssessment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (values: AssessmentDetailsInput) =>
      api.post<Assessment>("/assessments", values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
}

export function useUpdateAssessment(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (values: Partial<AssessmentDetailsInput>) =>
      api.patch<Assessment>(`/assessments/${id}`, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assessments", id] });
    },
  });
}

export function useAttachProblem(assessmentId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      problemId: string;
      order?: number;
      marks?: number;
    }) => api.post(`/assessments/${assessmentId}/problems`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assessments", assessmentId] });
      toast.success("Problem added");
    },
  });
}

export function useDetachProblem(assessmentId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (problemId: string) =>
      api.delete(`/assessments/${assessmentId}/problems/${problemId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assessments", assessmentId] });
      toast.success("Problem removed");
    },
  });
}

export function usePublishAssessment(assessmentId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.patch<Assessment>(`/assessments/${assessmentId}/publish`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assessments", assessmentId] });
      toast.success("Assessment published");
    },
  });
}

export function useCloseAssessment(assessmentId: string) {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () =>
      api.patch<Assessment>(`/assessments/${assessmentId}/close`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assessments", assessmentId] });
      toast.success("Assessment closed");
      router.refresh();
    },
  });
}

export function useDeleteAssessment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<null>(`/assessments/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assessments"] });
      toast.success("Assessment deleted");
    },
  });
}
