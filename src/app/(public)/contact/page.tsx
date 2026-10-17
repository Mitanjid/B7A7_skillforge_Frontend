import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
	title: "Contact",
	description: "Get in touch with the SkillForge team.",
};

export default function ContactPage() {
	return (
		<>
			<PageHero
				title="Contact us"
				subtitle="Questions, feedback or partnership ideas — we read everything."
			/>
			<div className="mx-auto max-w-lg px-4 py-12">
				<ContactForm />
			</div>
		</>
	);
}
