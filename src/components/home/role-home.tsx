import type { Icon } from "@phosphor-icons/react";
import {
  ArrowRight,
  ChartLineUp,
  ClipboardText,
  ClockCounterClockwise,
  CreditCard,
  CurrencyCircleDollar,
  Envelope,
  Files,
  FileText,
  Gear,
  ListChecks,
  Plus,
  Users,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactNode } from "react";
import { AcceptInvitationButton } from "@/app/dashboard/accept-invitation-button";
import { StartAttemptButton } from "@/app/dashboard/start-attempt-button";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_HOME } from "@/lib/constants";
import { serverFetch } from "@/lib/server-api";
import { cn } from "@/lib/utils";
import type {
  AdminStats,
  Assessment,
  Attempt,
  Invitation,
  User,
} from "@/types/api";

async function load<T>(
  path: string,
  query: Record<string, string | number>,
): Promise<{ data: T[]; total: number }> {
  try {
    const res = await serverFetch<T[]>(path, query);
    return { data: res.data, total: res.meta?.total ?? res.data.length };
  } catch {
    return { data: [], total: 0 };
  }
}

function HomeHeader({
  eyebrow,
  title,
  text,
  homeRole,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  homeRole: User["role"];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_20%_0%,color-mix(in_srgb,var(--primary)_14%,transparent),transparent)]" />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">{eyebrow}</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-xl text-muted-foreground">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {children}
          <Link
            href={ROLE_HOME[homeRole]}
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            Open dashboard <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function QuickLink({
  href,
  icon: IconComponent,
  title,
  text,
}: {
  href: string;
  icon: Icon;
  title: string;
  text: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardContent className="flex items-start gap-3 p-5">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <IconComponent className="size-5" weight="duotone" />
          </div>
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Stats({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
  );
}

function firstName(user: User) {
  const full =
    user.candidateProfile?.fullName ??
    user.companyProfile?.companyName ??
    user.email;
  return full.split(" ")[0];
}

export async function CandidateHome({ user }: { user: User }) {
  const [accepted, pending, attempts] = await Promise.all([
    load<Invitation>("/invitations/my", { limit: 20, status: "ACCEPTED" }),
    load<Invitation>("/invitations/my", { limit: 20, status: "PENDING" }),
    load<Attempt>("/attempts/my", { limit: 20 }),
  ]);

  const started = new Set(attempts.data.map((a) => a.invitationId));
  const readyToStart = accepted.data.filter((i) => !started.has(i.id));
  const inProgress = attempts.data.filter((a) => a.status === "IN_PROGRESS");
  const scored = attempts.data.filter(
    (a) => a.status === "EVALUATED" && a.totalScore !== null,
  );

  return (
    <>
      <HomeHeader
        homeRole="CANDIDATE"
        eyebrow="Candidate workspace"
        title={`Welcome back, ${firstName(user)}`}
        text="Pick up an assessment, track your attempts and see your results."
      >
        <Link
          href="/dashboard/attempts"
          className={cn(buttonVariants(), "gap-2")}
        >
          My attempts <ArrowRight className="size-4" />
        </Link>
      </HomeHeader>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <Stats>
          <StatCard
            label="Pending invites"
            value={pending.data.length}
            icon={Envelope}
            hint="Accept below to start"
          />
          <StatCard
            label="Ready to start"
            value={readyToStart.length}
            icon={ListChecks}
          />
          <StatCard
            label="In progress"
            value={inProgress.length}
            icon={ClockCounterClockwise}
          />
          <StatCard
            label="Attempts taken"
            value={attempts.total}
            icon={Files}
            hint={`${scored.length} scored`}
          />
        </Stats>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {inProgress.length > 0
                  ? "Continue your attempt"
                  : "Ready to start"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {inProgress.map((a) => (
                <Link
                  key={a.id}
                  href={`/dashboard/attempts/${a.id}/take`}
                  className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted/50"
                >
                  <span className="font-medium">{a.assessment?.title}</span>
                  <StatusBadge status={a.status} />
                </Link>
              ))}
              {readyToStart.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-md border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{inv.assessment?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {inv.assessment?.durationMinutes} minutes
                    </p>
                  </div>
                  <StartAttemptButton invitationId={inv.id} />
                </div>
              ))}
              {pending.data.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-dashed p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{inv.assessment?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Invitation · {inv.assessment?.durationMinutes} minutes
                    </p>
                  </div>
                  <AcceptInvitationButton token={inv.token} />
                </div>
              ))}
              {inProgress.length === 0 &&
                readyToStart.length === 0 &&
                pending.data.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nothing waiting. When a company invites your email, it will
                    show up here.
                  </p>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {attempts.data.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No attempts yet.
                </p>
              )}
              {attempts.data.slice(0, 4).map((a) => (
                <Link
                  key={a.id}
                  href={
                    a.status === "IN_PROGRESS"
                      ? `/dashboard/attempts/${a.id}/take`
                      : `/dashboard/attempts/${a.id}`
                  }
                  className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted/50"
                >
                  <span className="font-medium">{a.assessment?.title}</span>
                  <span className="flex items-center gap-3">
                    {a.totalScore !== null && (
                      <span className="text-muted-foreground">
                        {a.totalScore} pts
                      </span>
                    )}
                    <StatusBadge status={a.status} />
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export async function CompanyHome({ user }: { user: User }) {
  const [recent, published, drafts, problems] = await Promise.all([
    load<Assessment>("/assessments", {
      limit: 5,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    load<Assessment>("/assessments", { limit: 1, status: "PUBLISHED" }),
    load<Assessment>("/assessments", { limit: 1, status: "DRAFT" }),
    load<unknown>("/problems", { limit: 1 }),
  ]);

  return (
    <>
      <HomeHeader
        homeRole="COMPANY"
        eyebrow="Company workspace"
        title={`Hello, ${firstName(user)}`}
        text="Build assessments, invite candidates and review ranked results."
      >
        <Link
          href="/company/assessments/new"
          className={cn(buttonVariants(), "gap-2")}
        >
          <Plus className="size-4" /> New assessment
        </Link>
      </HomeHeader>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <Stats>
          <StatCard
            label="Assessments"
            value={recent.total}
            icon={ClipboardText}
          />
          <StatCard
            label="Published"
            value={published.total}
            icon={ChartLineUp}
          />
          <StatCard label="Drafts" value={drafts.total} icon={FileText} />
          <StatCard label="Problems" value={problems.total} icon={ListChecks} />
        </Stats>

        <div className="grid gap-4 md:grid-cols-3">
          <QuickLink
            href="/company/problems/new"
            icon={FileText}
            title="Add a problem"
            text="Write an MCQ or written question."
          />
          <QuickLink
            href="/company/assessments/new"
            icon={ClipboardText}
            title="Create assessment"
            text="Group problems, set the timer, pay and publish."
          />
          <QuickLink
            href="/company/billing"
            icon={CreditCard}
            title="Billing"
            text="Review your payments and receipts."
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent assessments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recent.data.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You haven&apos;t created an assessment yet.
              </p>
            )}
            {recent.data.map((a) => (
              <Link
                key={a.id}
                href={`/company/assessments/${a.id}`}
                className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.durationMinutes} min · {a.totalMarks} marks
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export async function AdminHome({ user }: { user: User }) {
  let stats: AdminStats | null = null;
  try {
    stats = (await serverFetch<AdminStats>("/admin/dashboard-stats")).data;
  } catch {
    stats = null;
  }

  return (
    <>
      <HomeHeader
        homeRole="ADMIN"
        eyebrow="Admin console"
        title={`Platform overview, ${firstName(user)}`}
        text="Monitor users, assessments, revenue and platform activity."
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        {stats ? (
          <Stats>
            <StatCard
              label="Total users"
              value={stats.users.total}
              icon={Users}
            />
            <StatCard
              label="Assessments"
              value={stats.assessments.total}
              icon={ClipboardText}
              hint={`${stats.assessments.published} published`}
            />
            <StatCard
              label="Attempts"
              value={stats.attempts.total}
              icon={Files}
              hint={`${stats.attempts.inProgress} in progress`}
            />
            <StatCard
              label="Revenue"
              value={`৳${stats.revenue.totalAmount}`}
              icon={CurrencyCircleDollar}
              hint={`${stats.revenue.successfulPayments} payments`}
            />
          </Stats>
        ) : (
          <p className="text-sm text-muted-foreground">
            Stats are unavailable right now. Try again in a moment.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink
            href="/admin/users"
            icon={Users}
            title="Users"
            text="Search, suspend or reactivate accounts."
          />
          <QuickLink
            href="/admin/audit-logs"
            icon={ClockCounterClockwise}
            title="Audit logs"
            text="Who did what, and when."
          />
          <QuickLink
            href="/admin/analytics"
            icon={ChartLineUp}
            title="Analytics"
            text="Charts across the platform."
          />
          <QuickLink
            href="/admin/settings"
            icon={Gear}
            title="Settings"
            text="Platform configuration."
          />
        </div>
      </div>
    </>
  );
}
