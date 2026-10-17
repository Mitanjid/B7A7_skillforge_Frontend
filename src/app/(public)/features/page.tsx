import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
	title: "Features",
	description:
		"Everything SkillForge offers to candidates, companies and admins.",
};

const GROUPS = [
	{
		title: "For companies",
		items: [
			"Reusable MCQ and written problem bank",
			"Assessment builder with per-problem marks",
			"Bulk email invitations",
			"Leaderboard and written-answer grading",
			"Billing history and analytics",
		],
	},
	{
		title: "For candidates",
		items: [
			"One-click invitation acceptance",
			"Timed exam room with autosave",
			"Question navigator",
			"Instant MCQ scoring",
			"Score history",
		],
	},
	{
		title: "For admins",
		items: [
			"Platform statistics and charts",
			"User search, filters and suspension",
			"Searchable audit log",
		],
	},
];

export default function FeaturesPage() {
	return (
		<>
			<PageHero
				title="Features"
				subtitle="Built for every role on the platform."
			/>
			<div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-3">
				{GROUPS.map((g) => (
					<div key={g.title} className="rounded-lg border p-5">
						<h2 className="mb-3 font-semibold">{g.title}</h2>
						<ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
							{g.items.map((i) => (
								<li key={i}>{i}</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</>
	);
}
