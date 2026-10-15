"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
}

export function PaginationControls({
  page,
  totalPages,
}: PaginationControlsProps) {
  const router = useRouter();
  const params = useSearchParams();

  const goTo = (next: number) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("page", String(next));
    router.push(`?${sp.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
        >
          <CaretLeft className="size-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => goTo(page + 1)}
        >
          Next
          <CaretRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
