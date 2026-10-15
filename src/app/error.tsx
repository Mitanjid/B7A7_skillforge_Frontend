"use client";

import { ArrowClockwise, Warning } from "@phosphor-icons/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <Warning className="size-16 text-destructive" weight="duotone" />

      <h1 className="text-2xl font-semibold">Something went wrong</h1>

      <p className="max-w-sm text-muted-foreground">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>

      <Button onClick={reset}>
        <ArrowClockwise className="mr-2 size-4" />
        Try again
      </Button>
    </main>
  );
}
