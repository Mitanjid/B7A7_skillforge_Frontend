import { z } from "zod";

const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1, "Option text is required"),
});

export const problemSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    type: z.enum(["MCQ", "WRITTEN"]),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    tags: z.array(z.string()).default([]),
    options: z.array(optionSchema).optional(),
    correctOption: z.string().optional(),
    marks: z.coerce.number().int().positive().optional(),
  })
  .refine(
    (data) =>
      data.type !== "MCQ" ||
      (data.options && data.options.length >= 2 && data.correctOption),
    {
      message: "MCQ problems need at least 2 options and a correct answer",
      path: ["options"],
    },
  )
  .refine(
    (data) => {
      if (!data.options) return true;
      const ids = data.options.map((o) => o.id);
      return new Set(ids).size === ids.length;
    },
    { message: "Option ids must be unique", path: ["options"] },
  )
  .refine(
    (data) => {
      if (!data.options || !data.correctOption) return true;
      return data.options.some((o) => o.id === data.correctOption);
    },
    {
      message: "Correct answer must match one of the options",
      path: ["correctOption"],
    },
  );

export type ProblemInput = z.infer<typeof problemSchema>;
