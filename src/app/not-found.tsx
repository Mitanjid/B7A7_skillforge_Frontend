import { Compass } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <Compass className="size-16 text-muted-foreground" weight="duotone" />

      <h1 className="text-3xl font-semibold">Page not found</h1>

      <p className="max-w-sm text-muted-foreground">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <Button render={<Link href="/" />}>Go back home</Button>
    </main>
  );
}
