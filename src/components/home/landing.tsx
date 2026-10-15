import {
  ArrowRight,
  ChartLineUp,
  CheckCircle,
  ClipboardText,
  PaperPlaneTilt,
  ShieldCheck,
  Timer,
  Users,
} from "@phosphor-icons/react/dist/ssr";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";


const FEATURES = [
  {
    icon: ClipboardText,
    title: "Problem bank",
    text: "Write MCQ and written problems once, reuse them across assessments.",
  },
  {
    icon: PaperPlaneTilt,
    title: "Email invitations",
    text: "Invite up to 200 candidates at once with expiring links.",
  },
  {
    icon: Timer,
    title: "Timed exam room",
    text: "Server-enforced deadlines, autosave and a question navigator.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity signals",
    text: "Tab switches are logged so you can review suspicious attempts.",
  },
  {
    icon: ChartLineUp,
    title: "Auto + manual grading",
    text: "MCQs are graded instantly, written answers get a reviewer score.",
  },
  {
    icon: Users,
    title: "Three roles",
    text: "Candidates, companies and admins each get a tailored workspace.",
  },
];

const STEPS = [
  {
    title: "Build",
    text: "Create problems and group them into a timed assessment.",
  },
  {
    title: "Invite",
    text: "Pay the publish fee, then email secure links to candidates.",
  },
  {
    title: "Review",
    text: "Get a ranked leaderboard, grade written answers, spot red flags.",
  },
];

const STATS = [
  { value: "200", label: "invites per batch" },
  { value: "2", label: "question types" },
  { value: "3", label: "role workspaces" },
  { value: "100%", label: "server-timed attempts" },
];

function ExamPreview() {
  const options = ["O(n log n)", "O(n)", "O(log n)", "O(n²)"];
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs text-muted-foreground">
            Frontend Engineer Screening
          </span>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
            24:18
          </span>
        </div>
        <div className="space-y-4 p-5 text-left">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Question 3 of 10 · MCQ · 5 marks
            </p>
            <p className="font-medium">
              What is the average time complexity of merge sort?
            </p>
          </div>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div
                key={opt}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm",
                  i === 0 && "border-primary bg-primary/5",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border",
                    i === 0 &&
                      "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {i === 0 && (
                    <CheckCircle className="size-3.5" weight="fill" />
                  )}
                </span>
                <span className="font-mono">{opt}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[30%] rounded-full bg-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              Answer saved · 0 tab switches
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_srgb,var(--primary)_15%,transparent),transparent)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Built for engineering teams
            </span>
            <h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Hire developers with{" "}
              <span className="text-primary">assessments you can trust</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground lg:mx-0">
              Create timed assessments, invite candidates by email, and review
              ranked results in one place.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                Get started <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                )}
              >
                Try a live demo
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              One-click demo for candidate, company and admin. No signup needed.
            </p>
          </div>
          <ExamPreview />
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-3xl font-semibold text-primary">
                {s.value}
              </p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Everything you need to screen at scale
          </h2>
          <p className="mt-3 text-muted-foreground">
            From writing the first question to ranking the final candidate.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="transition-shadow hover:shadow-md">
              <CardContent className="space-y-3 p-5">
                <div className="inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                  <f.icon className="size-6" weight="duotone" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="mb-10 text-center font-heading text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          Ready to run your first assessment?
        </h2>
        <p className="mt-3 text-muted-foreground">
          Try the demo in one click, or create a company account.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/register" className={buttonVariants({ size: "lg" })}>
            Create account
          </Link>
          <Link
            href="/pricing"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            See pricing
          </Link>
        </div>
      </section>
    </>
  );
}
