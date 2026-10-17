import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { PUBLISH_BASE_FEE, PUBLISH_FEE_PER_MARK } from "@/lib/constants";

export const metadata: Metadata = {
	title: "Pricing",
	description:
		"Pay once per assessment you publish. Candidates are always free.",
};

const EXAMPLES = [50, 100, 200];

export default function PricingPage() {
	return (
		<>
			<PageHero
				title="Simple pricing"
				subtitle="You pay once, when you publish an assessment. Candidates never pay."
			/>
			<div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
				<div className="rounded-lg border p-6 text-center">
					<p className="text-sm text-muted-foreground">Publish fee</p>
					<p className="mt-1 text-3xl font-bold">
						৳{PUBLISH_BASE_FEE} + ৳{PUBLISH_FEE_PER_MARK} per mark
					</p>
				</div>

				<div className="grid gap-3 sm:grid-cols-3">
					{EXAMPLES.map((marks) => (
						<div key={marks} className="rounded-lg border p-4 text-center">
							<p className="text-sm text-muted-foreground">
								{marks} total marks
							</p>
							<p className="text-xl font-semibold">
								৳{PUBLISH_BASE_FEE + marks * PUBLISH_FEE_PER_MARK}
							</p>
						</div>
					))}
				</div>

				<div className="text-center">
					<Link href="/register" className={buttonVariants()}>
						Create a company account
					</Link>
				</div>
			</div>
		</>
	);
}
