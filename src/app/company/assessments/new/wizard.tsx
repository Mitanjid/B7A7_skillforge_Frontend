"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CircleNotch } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAssessment } from "@/hooks/use-assessments";
import { cn } from "@/lib/utils";
import {
  type AssessmentDetailsInput,
  assessmentDetailsSchema,
} from "@/lib/validations/assessment";

const STEPS = ["Details", "Problems", "Payment", "Invite"];

export function Wizard() {
  const router = useRouter();
  const create = useCreateAssessment();
  const step = 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssessmentDetailsInput>({
    resolver: zodResolver(assessmentDetailsSchema),
  });

  const onSubmitDetails = (values: AssessmentDetailsInput) => {
    create.mutate(values, {
      onSuccess: ({ data }) => {
        // Next steps (attach problems, pay, invite) happen on the
        // assessment detail page, which already drives that whole flow.
        router.push(`/company/assessments/${data.id}`);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-sm",
                i === step ? "font-medium" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assessment details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmitDetails)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                rows={4}
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Duration (minutes)</Label>
              <Input
                id="durationMinutes"
                type="number"
                min={1}
                aria-invalid={!!errors.durationMinutes}
                {...register("durationMinutes", { valueAsNumber: true })}
              />
              {errors.durationMinutes && (
                <p className="text-sm text-destructive">
                  {errors.durationMinutes.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={create.isPending}>
              {create.isPending && (
                <CircleNotch className="mr-2 size-4 animate-spin" />
              )}
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
