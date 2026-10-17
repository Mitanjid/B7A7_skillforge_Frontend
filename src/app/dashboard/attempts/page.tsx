"use client";

import { ClipboardText } from "@phosphor-icons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useMyAttempts } from "@/hooks/use-attempts";

export default function MyAttemptsPage() {
	const params = useSearchParams();
	const page = Number(params.get("page")) || 1;
	const { data, isLoading } = useMyAttempts({ page });

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">My attempts</h1>

			<Card>
				<CardContent className="p-0">
					{isLoading && <Skeleton className="m-4 h-40" />}
					{!isLoading && (data?.attempts.length ?? 0) === 0 && (
						<div className="p-6">
							<EmptyState
								icon={ClipboardText}
								title="No attempts yet"
								description="Accept an invitation to start your first assessment."
							/>
						</div>
					)}
					{!isLoading && (data?.attempts.length ?? 0) > 0 && (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Assessment</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Score</TableHead>
									<TableHead>Started</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data?.attempts.map((a) => (
									<TableRow key={a.id}>
										<TableCell>
											<Link
												href={
													a.status === "IN_PROGRESS"
														? `/dashboard/attempts/${a.id}/take`
														: `/dashboard/attempts/${a.id}`
												}
												className="font-medium hover:underline"
											>
												{a.assessment?.title}
											</Link>
										</TableCell>
										<TableCell>
											<StatusBadge status={a.status} />
										</TableCell>
										<TableCell>{a.totalScore ?? "—"}</TableCell>
										<TableCell>
											{new Date(a.startedAt).toLocaleDateString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{data?.meta && (
				<PaginationControls
					page={data.meta.page}
					totalPages={data.meta.totalPages}
				/>
			)}
		</div>
	);
}
