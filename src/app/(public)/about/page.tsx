import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
	title: "About",
	description: "Why we built SkillForge and who it is for.",
};

export default function AboutPage() {
	return (
		<>
			<PageHero
				title="About SkillForge"
				subtitle="A focused platform for running fair, timed developer assessments."
			/>
			<div className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-muted-foreground">
				<p>
					Hiring teams spend hours building ad-hoc coding tests in spreadsheets
					and shared docs. SkillForge replaces that with a single workflow:
					write problems, assemble an assessment, invite candidates and review
					the results.
				</p>
				<p>
					Candidates get a distraction-free exam room with a server-enforced
					timer. Companies get automatic grading for multiple-choice questions
					and a clean review screen for written answers. Admins keep an eye on
					platform health through analytics and audit logs.
				</p>
			</div>
		</>
	);
}
