"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { Attempt } from "@/types/api";

export type ResultRow = {
  rank: number;
  attemptId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  totalScore: number | null;
  status: string;
  submittedAt: string | null;
};


export function useAssessmentResults(assessmentId: string) {
  return useQuery({
    queryKey: ["results", assessmentId],
    queryFn: async () =>
      (await api.get<ResultRow[]>(`/assessments/${assessmentId}/results`)).data,
    enabled: !!assessmentId,
  });
}

export function useAttemptSubmissions(attemptId: string) {
  return useQuery({
    queryKey: ["submissions", attemptId],
    queryFn: async () =>
      (await api.get<Attempt>(`/attempts/${attemptId}/submissions`)).data,
    enabled: !!attemptId,
  });
}

export function useEvaluateSubmission(attemptId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      score,
    }: {
      submissionId: string;
      score: number;
    }) => api.patch(`/submissions/${submissionId}/evaluate`, { score }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissions", attemptId] });
      toast.success("Score saved");
    },
  });
}
