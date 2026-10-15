"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotch, Plus, X } from "@phosphor-icons/react";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type ProblemInput, problemSchema } from "@/lib/validations/problem";
import type { Problem } from "@/types/api";

interface ProblemFormProps {
  defaultValues?: Problem;
  onSubmit: (values: ProblemInput) => void;
  isPending: boolean;
  submitLabel: string;
}

let optionCounter = 0;
const nextOptionId = () => `opt-${Date.now()}-${optionCounter++}`;

export function ProblemForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
}: ProblemFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  
  } = useForm<z.input<typeof problemSchema>, unknown, ProblemInput>({
    resolver: zodResolver(problemSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          description: defaultValues.description,
          type: defaultValues.type,
          difficulty: defaultValues.difficulty,
          tags: defaultValues.tags,
          options: defaultValues.options ?? [],
          correctOption: defaultValues.correctOption ?? undefined,
          marks: defaultValues.marks ?? undefined,
        }
      : {
          type: "MCQ",
          difficulty: "EASY",
          tags: [],
          options: [
            { id: nextOptionId(), text: "" },
            { id: nextOptionId(), text: "" },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });
  const type = watch("type");
  const correctOption = watch("correctOption");
  const tagsValue = watch("tags");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Problem details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v: "MCQ" | "WRITTEN" | null) => {
                  if (v !== null) setValue("type", v);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MCQ">Multiple choice</SelectItem>
                  <SelectItem value="WRITTEN">Written answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={watch("difficulty")}
                onValueChange={(v: "EASY" | "MEDIUM" | "HARD" | null) => {
                  if (v !== null) setValue("difficulty", v);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marks">Default marks</Label>
              <Input id="marks" type="number" min={1} {...register("marks")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              defaultValue={tagsValue?.join(", ")}
              onChange={(e) =>
                setValue(
                  "tags",
                  e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                )
              }
            />
          </div>
        </CardContent>
      </Card>

      {type === "MCQ" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOption === field.id}
                  onChange={() => setValue("correctOption", field.id)}
                  aria-label={`Mark option ${index + 1} as correct`}
                />
                <Input
                  placeholder={`Option ${index + 1}`}
                  {...register(`options.${index}.text`)}
                />
                <input
                  type="hidden"
                  {...register(`options.${index}.id`)}
                  value={field.id}
                />
                {fields.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            {errors.options && (
              <p className="text-sm text-destructive">
                {errors.options.message as string}
              </p>
            )}
            {errors.correctOption && (
              <p className="text-sm text-destructive">
                {errors.correctOption.message}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ id: nextOptionId(), text: "" })}
            >
              <Plus className="mr-1 size-4" />
              Add option
            </Button>
          </CardContent>
        </Card>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending && <CircleNotch className="mr-2 size-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
