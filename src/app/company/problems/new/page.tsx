"use client";

import { useCreateProblem } from "@/hooks/use-problems";
import { ProblemForm } from "@/components/shared/problem-form";

export default function NewProblemPage() {
  const create = useCreateProblem();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">New problem</h1>
      <ProblemForm
        onSubmit={(values) => create.mutate(values)}
        isPending={create.isPending}
        submitLabel="Create problem"
      />
    </div>
  );
}
