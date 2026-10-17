"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { Invitation, InvitationPreview } from "@/types/api";

export function useInvitationPreview(token: string) {
	return useQuery({
		queryKey: ["invitation-preview", token],
		queryFn: async () =>
			(await api.get<InvitationPreview>(`/invitations/${token}`)).data,
		enabled: !!token,
		retry: false,
	});
}

export function useAcceptInvitation(token: string) {
	const router = useRouter();

	return useMutation({
		mutationFn: () => api.post<Invitation>(`/invitations/${token}/accept`),
		onSuccess: () => {
			toast.success("Invitation accepted");
			router.push("/dashboard");
			router.refresh();
		},
	});
}
