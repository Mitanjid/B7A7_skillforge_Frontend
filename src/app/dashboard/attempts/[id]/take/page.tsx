"use client";

import { Warning } from "@phosphor-icons/react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAttempt } from "@/hooks/use-attempts";
import { type CachedAttempt, getCachedAttempt } from "@/lib/attempt-cache";
import { cn } from "@/lib/utils";
import { ExamRoom } from "./exam-room";

export default function TakeAttemptPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { data: attempt, isLoading } = useAttempt(id);

	// Read localStorage after mount to avoid a hydration mismatch.
	const [cached, setCached] = useState<CachedAttempt | null>(null);
	const [cacheChecked, setCacheChecked] = useState(false);
	useEffect(() => {
		setCached(getCachedAttempt(id));
		setCacheChecked(true);
	}, [id]);

	if (isLoading || !cacheChecked) {
		return <Skeleton className="h-96 rounded-lg" />;
	}

	if (attempt && attempt.status !== "IN_PROGRESS") {
		return (
			<div className="flex flex-col items-center gap-3 py-16 text-center">
				<p className="font-medium">This attempt has already been submitted.</p>
				<Link
					href={`/dashboard/attempts/${id}`}
					className={buttonVariants()}
				>
					View result
				</Link>
			</div>
		);
	}

	if (!cached) {
		return (
			<div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
				<Warning className="size-10 text-amber-500" weight="duotone" />
				<p className="font-medium">We can't resume this attempt here</p>
				<p className="text-sm text-muted-foreground">
					Your questions were only saved in the browser you started this attempt
					in. If you're on a different device or cleared your browser data,
					continue from where you started, or contact the company.
				</p>
				<Link
					href="/dashboard"
					className={cn(buttonVariants({ variant: "outline" }))}
				>
					Back to dashboard
				</Link>
			</div>
		);
	}

	return (
		<ExamRoom
			attemptId={id}
			deadline={cached.deadline}
			problems={cached.problems}
		/>
	);
}
