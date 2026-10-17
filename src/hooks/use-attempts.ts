"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { cacheAttempt, clearCachedAttempt } from "@/lib/attempt-cache";
import type { ApiMeta, Attempt, StartAttemptResult } from "@/types/api";

export function useMyAttempts(
	filters: { page?: number; limit?: number; status?: string } = {},
) {
	return useQuery({
		queryKey: ["my-attempts", filters],
		queryFn: async () => {
			const res = await api.get<Attempt[]>("/attempts/my", {
				...filters,
				limit: filters.limit ?? 10,
			});
			return { attempts: res.data, meta: res.meta as ApiMeta };
		},
	});
}

export function useAttempt(attemptId: string) {
	return useQuery({
		queryKey: ["attempt", attemptId],
		queryFn: async () => (await api.get<Attempt>(`/attempts/${attemptId}`)).data,
		enabled: !!attemptId,
	});
}

export function useStartAttempt() {
	const router = useRouter();

	return useMutation({
		mutationFn: (invitationId: string) =>
			api.post<StartAttemptResult>("/attempts/start", { invitationId }),
		onSuccess: ({ data }) => {
			cacheAttempt(data.attempt.id, {
				problems: data.problems,
				deadline: data.deadline,
			});
			router.push(`/dashboard/attempts/${data.attempt.id}/take`);
		},
	});
}

export function useSubmitAnswer(attemptId: string) {
	return useMutation({
		mutationFn: (payload: {
			problemId: string;
			selectedOption?: string;
			answerText?: string;
		}) => api.post(`/attempts/${attemptId}/answers`, payload),
	});
}

export function useSubmitAttempt(attemptId: string) {
	const router = useRouter();
	const qc = useQueryClient();

	return useMutation({
		mutationFn: () => api.post<Attempt>(`/attempts/${attemptId}/submit`),
		onSuccess: () => {
			clearCachedAttempt(attemptId);
			qc.invalidateQueries({ queryKey: ["my-attempts"] });
			toast.success("Attempt submitted");
			router.replace(`/dashboard/attempts/${attemptId}`);
		},
	});
}

// The backend increments tabSwitchCount and returns the new value, so the
// server (not the browser) is the source of truth for the count.
export function useFlagViolation(attemptId: string) {
	return useMutation({
		mutationFn: () =>
			api.patch<Attempt>(`/attempts/${attemptId}/flag-violation`),
	});
}
