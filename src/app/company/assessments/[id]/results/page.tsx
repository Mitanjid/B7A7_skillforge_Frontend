"use client";

import { ChartBar } from "@phosphor-icons/react";
import Link from "next/link";
import { use } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAssessmentResults } from "@/hooks/use-results";
import { cn } from "@/lib/utils";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: attempts, isLoading } = useAssessmentResults(id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Results</h1>

      <Card>
        <CardContent className="p-0">
          {!isLoading && (attempts ?? []).length === 0 && (
            <div className="p-6">
              <EmptyState
                icon={ChartBar}
                title="No attempts yet"
                description="Results appear here once invited candidates submit their attempts."
              />
            </div>
          )}
          {!isLoading && (attempts ?? []).length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts?.map((a) => (
                  <TableRow key={a.attemptId}>
                    <TableCell className="text-muted-foreground">
                      {a.rank}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{a.candidateName}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.candidateEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                    <TableCell>{a.totalScore ?? "—"}</TableCell>
                    <TableCell>
                      {a.submittedAt
                        ? new Date(a.submittedAt).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/company/assessments/${id}/results/${a.attemptId}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                        )}
                      >
                        {a.status === "EVALUATED" ? "View" : "Evaluate"}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
