"use client";

import { CheckCircle, Circle, Clock } from "@phosphor-icons/react";
import { use, useEffect, useState } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAttempt } from "@/hooks/use-attempts";
import { type CachedAttempt, getCachedAttempt } from "@/lib/attempt-cache";

export default function AttemptResultPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { data: attempt, isLoading } = useAttempt(id);

	// localStorage only exists in the browser, so read it after mount to
	// avoid a server/client hydration mismatch.
	const [cached, setCached] = useState<CachedAttempt | null>(null);
	useEffect(() => setCached(getCachedAttempt(id)), [id]);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-48 rounded-lg" />
			</div>
		);
	}

	if (!attempt) return null;

	const titleByProblemId = new Map(
		cached?.problems.map((p) => [p.problem.id, p.problem.title]) ?? [],
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">{attempt.assessment?.title}</h1>
					<p className="text-sm text-muted-foreground">
						Submitted{" "}
						{attempt.submittedAt
							? new Date(attempt.submittedAt).toLocaleString()
							: "—"}
					</p>
				</div>
				<StatusBadge status={attempt.status} />
			</div>

			<Card>
				<CardContent className="flex items-center justify-between p-6">
					<p className="text-sm text-muted-foreground">Total score</p>
					<p className="text-3xl font-bold">{attempt.totalScore ?? "—"}</p>
				</CardContent>
			</Card>

			{attempt.status === "SUBMITTED" && (
				<p className="flex items-center gap-2 rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
					<Clock className="size-4" />
					Some written answers are still being graded. Your final score will
					update once the company finishes reviewing.
				</p>
			)}

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Answers</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{(attempt.submissions ?? []).map((sub, i) => (
						<div
							key={sub.id}
							className="flex items-center justify-between rounded-md border p-3 text-sm"
						>
							<div className="flex items-center gap-2">
								{sub.score != null && sub.score > 0 ? (
									<CheckCircle
										className="size-4 text-emerald-500"
										weight="fill"
									/>
								) : (
									<Circle className="size-4 text-muted-foreground" />
								)}
								<span>
									{titleByProblemId.get(sub.problemId) ?? `Question ${i + 1}`}
								</span>
							</div>
							<Badge variant="outline">
								{sub.score != null ? `${sub.score} marks` : "Pending"}
							</Badge>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
