import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
	title: "How it works",
	description: "From creating a problem to reviewing results in five steps.",
};

const STEPS = [
	["Create problems", "Add MCQ or written questions to your problem bank."],
	["Build an assessment", "Pick problems, set marks and a time limit."],
	[
		"Pay the publish fee",
		"A one-time fee based on total marks, paid via SSLCommerz.",
	],
	["Invite candidates", "Send expiring email links to as many as 200 people."],
	["Review results", "MCQs are auto-graded; you score the written answers."],
];

export default function HowItWorksPage() {
	return (
		<>
			<PageHero
				title="How it works"
				subtitle="Five steps from idea to hiring signal."
			/>
			<ol className="mx-auto max-w-2xl space-y-4 px-4 py-12">
				{STEPS.map(([title, text], i) => (
					<li key={title} className="flex gap-4 rounded-lg border p-4">
						<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
							{i + 1}
						</span>
						<div>
							<p className="font-medium">{title}</p>
							<p className="text-sm text-muted-foreground">{text}</p>
						</div>
					</li>
				))}
			</ol>
		</>
	);
}
