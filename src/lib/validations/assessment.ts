import { z } from "zod";

export const assessmentDetailsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  durationMinutes: z
    .number({ error: "Duration is required" })
    .int("Must be a whole number")
    .positive("Duration must be a positive number of minutes"),
});

export const evaluateSubmissionSchema = z.object({
  score: z
    .number({ error: "Enter a score" })
    .min(0, "Score cannot be negative"),
});
export type AssessmentDetailsInput = z.infer<typeof assessmentDetailsSchema>;

export const inviteCandidatesSchema = z.object({
  emails: z
    .array(z.email("Each entry must be a valid email"))
    .min(1, "Add at least one email")
    .max(200, "A maximum of 200 emails can be invited at once"),
});
export type InviteCandidatesInput = z.infer<typeof inviteCandidatesSchema>;

export type EvaluateSubmissionInput = z.infer<typeof evaluateSubmissionSchema>;
