import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
	title: "Terms of service",
	description: "The rules for using SkillForge.",
};

export default function TermsPage() {
	return (
		<>
			<PageHero title="Terms of service" subtitle="Last updated October 2026" />
			<div className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-sm text-muted-foreground">
				<p>
					By using SkillForge you agree to use the platform lawfully and to keep
					your account credentials private.
				</p>
				<p>
					Companies are responsible for the content of the problems they create
					and for the fair treatment of invited candidates.
				</p>
				<p>
					Publish fees are charged once per assessment and are non-refundable
					once an assessment has been published.
				</p>
				<p>
					We may suspend accounts that abuse the platform, attempt to cheat, or
					interfere with other users.
				</p>
			</div>
		</>
	);
}
