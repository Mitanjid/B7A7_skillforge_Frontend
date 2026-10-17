import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Payment successful" };

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ assessmentId?: string }>;
}) {
  const sp = await searchParams;
  const href = sp.assessmentId
    ? `/company/assessments/${sp.assessmentId}`
    : "/company/assessments";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <CheckCircle className="size-16 text-emerald-500" weight="duotone" />
      <h1 className="text-2xl font-semibold">Payment successful</h1>
      <p className="max-w-sm text-muted-foreground">
        Thank you. You can now publish your assessment.
      </p>
      <Link href={href} className={buttonVariants()}>
        Back to assessment
      </Link>
    </main>
  );
}
