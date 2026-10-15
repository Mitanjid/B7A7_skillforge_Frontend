"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProblemForm } from "@/components/shared/problem-form";
import { useProblem, useUpdateProblem } from "@/hooks/use-problems";

export default function EditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: problem, isLoading } = useProblem(id);
  const update = useUpdateProblem(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit problem</h1>
      <ProblemForm
        defaultValues={problem}
        onSubmit={(values) => update.mutate(values)}
        isPending={update.isPending}
        submitLabel="Save changes"
      />
    </div>
  );
}
