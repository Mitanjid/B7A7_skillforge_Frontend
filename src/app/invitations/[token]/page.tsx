"use client";

import { Buildings, Clock, SignIn, UserPlus } from "@phosphor-icons/react";
import Link from "next/link";
import { use } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  useAcceptInvitation,
  useInvitationPreview,
} from "@/hooks/use-invitation-preview";
import { cn } from "@/lib/utils";

export default function InvitationPreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { data: preview, isLoading, isError } = useInvitationPreview(token);
  const { user, isLoading: authLoading } = useAuth();
  const accept = useAcceptInvitation(token);

  if (isLoading || authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <Skeleton className="h-64 w-full max-w-md rounded-lg" />
      </main>
    );
  }

  if (isError || !preview) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-4 text-center">
        <h1 className="text-xl font-semibold">Invitation not found</h1>
        <p className="text-sm text-muted-foreground">
          This link may be invalid or have been removed.
        </p>
      </main>
    );
  }

  const expired = preview.status === "EXPIRED";
  const accepted = preview.status === "ACCEPTED";
  const next = encodeURIComponent(`/invitations/${token}`);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Buildings
            className="mx-auto size-10 text-primary"
            weight="duotone"
          />
          <CardTitle className="text-xl">{preview.companyName}</CardTitle>
          <CardDescription>has invited you to an assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold">{preview.assessmentTitle}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="size-4" />
              {preview.durationMinutes} minutes
            </p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <StatusBadge status={preview.status} />
          </div>

          {expired && (
            <p className="text-sm text-destructive">
              This invitation has expired. Contact the company for a new one.
            </p>
          )}

          {!expired && !user && (
            <Link
              href={
                preview.requiresRegistration && !accepted
                  ? `/register?next=${next}`
                  : `/login?next=${next}`
              }
              className={cn(buttonVariants(), "w-full")}
            >
              {preview.requiresRegistration && !accepted ? (
                <>
                  <UserPlus className="mr-2 size-4" />
                  Create account to accept
                </>
              ) : (
                <>
                  <SignIn className="mr-2 size-4" />
                  Log in to continue
                </>
              )}
            </Link>
          )}

          {!expired && user && user.role !== "CANDIDATE" && (
            <p className="text-center text-sm text-muted-foreground">
              This invitation is for a candidate account. Log in with the
              invited email to continue.
            </p>
          )}

          {!expired && user?.role === "CANDIDATE" && !accepted && (
            <Button
              className="w-full"
              disabled={accept.isPending}
              onClick={() => accept.mutate()}
            >
              Accept invitation
            </Button>
          )}

          {!expired && user?.role === "CANDIDATE" && accepted && (
            <Link href="/dashboard" className={cn(buttonVariants(), "w-full")}>
              Go to dashboard
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
