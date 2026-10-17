"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { AdminUser } from "@/types/api";

export function useUpdateUserStatus() {
	const router = useRouter();

	return useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
			api.patch<AdminUser>(`/admin/users/${id}/status`, { isActive }),
		onSuccess: (_res, vars) => {
			toast.success(vars.isActive ? "User activated" : "User suspended");
			router.refresh();
		},
	});
}
