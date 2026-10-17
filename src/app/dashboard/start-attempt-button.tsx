"use client";

import { CircleNotch, Play } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useStartAttempt } from "@/hooks/use-attempts";

export function StartAttemptButton({ invitationId }: { invitationId: string }) {
	const start = useStartAttempt();

	return (
		<Button
			size="sm"
			disabled={start.isPending}
			onClick={() => start.mutate(invitationId)}
		>
			{start.isPending ? (
				<CircleNotch className="mr-2 size-4 animate-spin" />
			) : (
				<Play className="mr-2 size-4" weight="fill" />
			)}
			Start
		</Button>
	);
}
