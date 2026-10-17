"use client";

import { CircleNotch, FloppyDisk, Warning } from "@phosphor-icons/react";
import { use, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAttemptSubmissions,
  useEvaluateSubmission,
} from "@/hooks/use-results";

export default function GradeAttemptPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const { attemptId } = use(params);
  const { data: attempt, isLoading } = useAttemptSubmissions(attemptId);
  const evaluate = useEvaluateSubmission(attemptId);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (!attempt) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {attempt.candidate?.candidateProfile?.fullName ??
            attempt.candidate?.email}
        </h1>
        <p className="text-sm text-muted-foreground">
          Total score: {attempt.totalScore ?? "—"}
        </p>
        {attempt.tabSwitchCount > 0 && (
          <p className="mt-1 flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
            <Warning className="size-4" />
            {attempt.tabSwitchCount} tab switch
            {attempt.tabSwitchCount > 1 ? "es" : ""} during the attempt
          </p>
        )}
      </div>

      <div className="space-y-4">
        {(attempt.submissions ?? []).map((sub) => {
          const problem = sub.problem;
          if (!problem) return null;

          return (
            <Card key={sub.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{problem.title}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {problem.type}
                  </Badge>
                </div>
                {sub.score !== null && (
                  <Badge className="shrink-0">Scored: {sub.score}</Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {problem.type === "MCQ" ? (
                  <p className="text-sm">
                    Selected:{" "}
                    <span className="font-medium">
                      {problem.options?.find((o) => o.id === sub.selectedOption)
                        ?.text ?? "No answer"}
                    </span>
                    {" · "}Auto-graded
                  </p>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
                      {sub.answerText || "No answer submitted"}
                    </p>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={problem.marks ?? undefined}
                        placeholder={`Out of ${problem.marks ?? "?"}`}
                        className="w-40"
                        value={scores[sub.id] ?? sub.score?.toString() ?? ""}
                        onChange={(e) =>
                          setScores((s) => ({ ...s, [sub.id]: e.target.value }))
                        }
                      />
                      <Button
                        size="sm"
                        disabled={
                          (evaluate.isPending && savingId === sub.id) ||
                          scores[sub.id] === undefined ||
                          scores[sub.id] === ""
                        }
                        onClick={() => {
                          setSavingId(sub.id);
                          evaluate.mutate({
                            submissionId: sub.id,
                            score: Number(scores[sub.id]),
                          });
                        }}
                      >
                        {evaluate.isPending && savingId === sub.id ? (
                          <CircleNotch className="mr-2 size-4 animate-spin" />
                        ) : (
                          <FloppyDisk className="mr-2 size-4" />
                        )}
                        Save score
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
