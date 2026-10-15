"use client";

import { ArrowClockwise } from "@phosphor-icons/react";
import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center font-sans">
        <h1 className="text-2xl font-semibold">Application error</h1>
        <p className="max-w-sm text-muted-foreground">
          Something broke at the root level. Please reload the page.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <ArrowClockwise className="size-4" />
          Reload
        </button>
      </body>
    </html>
  );
}
