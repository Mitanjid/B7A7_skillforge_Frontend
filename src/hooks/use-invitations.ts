"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { InviteCandidatesInput } from "@/lib/validations/assessment";
import type { Invitation } from "@/types/api";

export function useAssessmentInvitations(assessmentId: string) {
  return useQuery({
    queryKey: ["invitations", assessmentId],
    queryFn: async () =>
      (await api.get<Invitation[]>(`/assessments/${assessmentId}/invitations`))
        .data,
    enabled: !!assessmentId,
  });
}

export function useInviteCandidates(assessmentId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (values: InviteCandidatesInput) =>
      api.post(`/assessments/${assessmentId}/invite`, values),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: ["invitations", assessmentId] });
      toast.success(`Invited ${variables.emails.length} candidate(s)`);
    },
  });
}
