"use client";

import { PencilSimple, Trash } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useDeleteProblem } from "@/hooks/use-problems";

export function ProblemRowActions({
  problemId,
}: {
  problemId: string;
}) {
  const del = useDeleteProblem();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        render={<Link href={`/company/problems/${problemId}`} />}
        aria-label="Edit problem"
      >
        <PencilSimple className="size-4" />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete problem"
            >
              <Trash className="size-4 text-destructive" />
            </Button>
          }
        />

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this problem?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This can't be undone. Problems already attached to a
              published assessment are unaffected.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={del.isPending}
              onClick={() =>
                del.mutate(problemId, {
                  onSuccess: () => setOpen(false),
                })
              }
            >
              {del.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}