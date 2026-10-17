"use client";

import { Button } from "@/components/ui/button";
import { useUpdateUserStatus } from "@/hooks/use-admin";

export function UserStatusToggle({
	userId,
	isActive,
	disabled,
}: {
	userId: string;
	isActive: boolean;
	disabled?: boolean;
}) {
	const update = useUpdateUserStatus();

	return (
		<Button
			size="sm"
			variant={isActive ? "outline" : "default"}
			disabled={disabled || update.isPending}
			onClick={() => update.mutate({ id: userId, isActive: !isActive })}
		>
			{isActive ? "Suspend" : "Activate"}
		</Button>
	);
}
