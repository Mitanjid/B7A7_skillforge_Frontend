import type { Role } from "@/types/api";

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  COMPANY: "/company",
  CANDIDATE: "/dashboard",
};

export const DEMO_ACCOUNTS = [
  {
    role: "ADMIN" as Role,
    label: "Admin",
    description: "Users, analytics, audit logs",
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "",
  },
  {
    role: "CANDIDATE" as Role,
    label: "Candidate",
    description: "Take assessments, view results",
    email: process.env.NEXT_PUBLIC_DEMO_CANDIDATE_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_CANDIDATE_PASSWORD ?? "",
  },
  {
    role: "COMPANY" as Role,
    label: "Company",
    description: "Create, publish, grade assessments",
    email: process.env.NEXT_PUBLIC_DEMO_COMPANY_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_COMPANY_PASSWORD ?? "",
  },
];

// Mirrors backend .env: PLATFORM_PUBLISH_BASE_FEE / PLATFORM_PUBLISH_FEE_PER_MARK.
// Used only to preview the fee before payment; the backend is the source of truth.
export const PUBLISH_BASE_FEE = 500;
export const PUBLISH_FEE_PER_MARK = 2;

export const estimatePublishFee = (totalMarks: number) =>
  PUBLISH_BASE_FEE + totalMarks * PUBLISH_FEE_PER_MARK;

export const DIFFICULTY_COLOR: Record<string, string> = {
  EASY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  HARD: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export const STATUS_COLOR: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PUBLISHED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  CLOSED: "bg-muted text-muted-foreground",
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ACCEPTED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  EXPIRED: "bg-red-500/10 text-red-600 dark:text-red-400",
  IN_PROGRESS: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  SUBMITTED: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  EVALUATED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  FAILED: "bg-red-500/10 text-red-600 dark:text-red-400",
};
