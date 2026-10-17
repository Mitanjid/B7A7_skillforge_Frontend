"use client";

import {
  CreditCard,
  Envelope,
  PaperPlaneTilt,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import Link from "next/link";
import { use, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAssessment,
  useAttachProblem,
  useDetachProblem,
  usePublishAssessment,
} from "@/hooks/use-assessments";
import { useInitiatePayment } from "@/hooks/use-payment";
import { useProblems } from "@/hooks/use-problems";
import { estimatePublishFee } from "@/lib/constants";

export default function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: assessment, isLoading } = useAssessment(id);
  const attach = useAttachProblem(id);
  const detach = useDetachProblem(id);
  const publish = usePublishAssessment(id);
  const pay = useInitiatePayment();
  const [pickerOpen, setPickerOpen] = useState(false);

  const { data: problemBank } = useProblems({ limit: 50 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  if (!assessment) return null;

  const attachedIds = new Set(
    (assessment.problems ?? []).map((p) => p.problemId),
  );
  const available = (problemBank?.problems ?? []).filter(
    (p) => !attachedIds.has(p.id),
  );
  const isDraft = assessment.status === "DRAFT";
  const isPaid = assessment.payment?.status === "SUCCESS";
  const fee = estimatePublishFee(assessment.totalMarks);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{assessment.title}</h1>
            <StatusBadge status={assessment.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {assessment.durationMinutes} minutes · {assessment.totalMarks} total
            marks
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {assessment.status === "PUBLISHED" && (
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href={`/company/assessments/${id}/invitations`} />}
            >
              <Envelope className="mr-2 size-4" />
              Invitations
            </Button>
          )}

          {assessment.status !== "DRAFT" && (
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href={`/company/assessments/${id}/results`} />}
            >
              Results
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Problems</CardTitle>

          {isDraft && (
            <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
              <DialogTrigger
                render={
                  <Button  size="sm" variant="outline">
                    <Plus className="mr-1 size-4" />
                    Add problem
                  </Button>
                }
              />

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a problem</DialogTitle>
                </DialogHeader>

                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {available.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No more problems available.{" "}
                      <Link href="/company/problems/new" className="underline">
                        Create one
                      </Link>
                      .
                    </p>
                  )}

                  {available.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      disabled={attach.isPending}
                      onClick={() =>
                        attach.mutate(
                          {
                            problemId: p.id,
                            marks: p.marks ?? 10,
                          },
                          {
                            onSuccess: () => setPickerOpen(false),
                          },
                        )
                      }
                      className="flex w-full items-center justify-between rounded-md border p-3 text-left text-sm hover:bg-muted/50 disabled:opacity-50"
                    >
                      <span>{p.title}</span>
                      <Badge variant="outline">{p.type}</Badge>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>

        <CardContent className="space-y-2">
          {(assessment.problems ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">
              No problems attached yet.
            </p>
          )}

          {(assessment.problems ?? []).map((ap) => (
            <div
              key={ap.id}
              className="flex items-center justify-between rounded-md border p-3 text-sm"
            >
              <div>
                <p className="font-medium">{ap.problem.title}</p>
                <p className="text-xs text-muted-foreground">
                  {ap.problem.type} · {ap.marks} marks
                </p>
              </div>

              {isDraft && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${ap.problem.title}`}
                  disabled={detach.isPending}
                  onClick={() => detach.mutate(ap.problemId)}
                >
                  <Trash className="size-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {isDraft && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publish</CardTitle>
            <CardDescription>
              Publishing requires a one-time fee based on total marks.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-wrap items-center gap-4">
            <p className="text-2xl font-bold">৳{fee}</p>

            {!isPaid ? (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      
                       disabled={assessment.totalMarks === 0}
                    >
                      <CreditCard className="mr-2 size-4" />
                      Pay & continue
                    </Button>
                  }
                />

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Pay ৳{fee} to publish?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You'll be redirected to SSLCommerz (test mode) to complete
                      payment. You'll return here afterward.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={pay.isPending}
                      onClick={() => pay.mutate(id)}
                    >
                      {pay.isPending ? "Redirecting..." : "Continue to payment"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                onClick={() => publish.mutate()}
                disabled={publish.isPending}
              >
                <PaperPlaneTilt className="mr-2 size-4" />
                {publish.isPending ? "Publishing..." : "Publish assessment"}
              </Button>
            )}

            {assessment.totalMarks === 0 && (
              <p className="w-full text-sm text-muted-foreground">
                Attach at least one problem before paying.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
