"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotch, Plus, X } from "@phosphor-icons/react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
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
    clearErrors,
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

  // keyName "key": RHF's generated key must NOT overwrite each option's own
  // `id`, which is what correctOption points to.
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "options",
    keyName: "key",
  });
  const type = watch("type");
  const correctOption = watch("correctOption");
  const tagsValue = watch("tags");

  const onTypeChange = (v: "MCQ" | "WRITTEN") => {
    setValue("type", v);
    clearErrors(["options", "correctOption"]);
    if (v === "WRITTEN") {
      replace([]);
      setValue("correctOption", undefined);
    } else if (fields.length < 2) {
      replace([
        { id: nextOptionId(), text: "" },
        { id: nextOptionId(), text: "" },
      ]);
    }
  };

  const onRemoveOption = (index: number, optionId: string) => {
    if (correctOption === optionId) setValue("correctOption", undefined);
    remove(index);
  };

  const optionsError =
    (errors.options?.root?.message as string | undefined) ??
    (errors.options?.message as string | undefined);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () =>
        toast.error("Please fix the highlighted fields"),
      )}
      className="space-y-6"
      noValidate
    >
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
                  if (v !== null) onTypeChange(v);
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
              <Input
                id="marks"
                type="number"
                min={1}
                aria-invalid={!!errors.marks}
                {...register("marks", {
                  setValueAs: (v) =>
                    v === "" || v === null || v === undefined
                      ? undefined
                      : Number(v),
                })}
              />
              {errors.marks && (
                <p className="text-sm text-destructive">
                  {errors.marks.message}
                </p>
              )}
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
              <div key={field.key} className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctOption === field.id}
                    onChange={() => {
                      setValue("correctOption", field.id, {
                        shouldDirty: true,
                      });
                      clearErrors(["correctOption", "options"]);
                    }}
                    aria-label={`Mark option ${index + 1} as correct`}
                  />
                  <Input
                    placeholder={`Option ${index + 1}`}
                    aria-invalid={!!errors.options?.[index]?.text}
                    {...register(`options.${index}.text`)}
                  />
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove option ${index + 1}`}
                      onClick={() => onRemoveOption(index, field.id)}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
                {errors.options?.[index]?.text && (
                  <p className="pl-6 text-sm text-destructive">
                    {errors.options[index]?.text?.message}
                  </p>
                )}
              </div>
            ))}
            {optionsError && (
              <p className="text-sm text-destructive">{optionsError}</p>
            )}
            {errors.correctOption && (
              <p className="text-sm text-destructive">
                {errors.correctOption.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Select the radio button next to the correct option.
            </p>
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
