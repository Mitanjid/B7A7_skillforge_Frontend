import { XCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Payment not completed" };

export default async function PaymentCancelPage({
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
			<XCircle className="size-16 text-destructive" weight="duotone" />
			<h1 className="text-2xl font-semibold">Payment not completed</h1>
			<p className="max-w-sm text-muted-foreground">
				No charge was made. You can try again anytime.
			</p>
			<Link href={href} className={buttonVariants()}>
				Back to assessment
			</Link>
		</main>
	);
}
