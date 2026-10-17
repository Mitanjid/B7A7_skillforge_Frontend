import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    assessmentId?: string;
  }>;
}) {
  const sp = await searchParams;
  const success = sp.status === "SUCCESS";

  if (!success) {
    redirect(
      `/payment/cancel${
        sp.assessmentId ? `?assessmentId=${sp.assessmentId}` : ""
      }`,
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <CheckCircle className="size-16 text-emerald-500" weight="duotone" />

      <h1 className="text-2xl font-semibold">Payment successful</h1>

      <p className="max-w-sm text-muted-foreground">
        You can now publish your assessment.
      </p>

      <Button
        nativeButton={false}
        render={
          <Link
            href={
              sp.assessmentId
                ? `/company/assessments/${sp.assessmentId}`
                : "/company/assessments"
            }
          />
        }
      >
        Back to assessment
      </Button>
    </main>
  );
}
