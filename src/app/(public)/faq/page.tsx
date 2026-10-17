import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about SkillForge.",
};

const FAQS = [
  [
    "Do candidates pay?",
    "No. Only companies pay, once per published assessment.",
  ],
  [
    "How are MCQs graded?",
    "Automatically and instantly when the attempt is submitted.",
  ],
  [
    "What about written answers?",
    "The company reviews each written answer and assigns a score.",
  ],
  [
    "What happens when time runs out?",
    "The attempt is submitted automatically by the server.",
  ],
  ["How long do invitations last?", "Invitation links expire after 7 days."],
  [
    "Which payment methods work?",
    "Payments run through SSLCommerz in test mode for this demo.",
  ],
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="Frequently asked questions"
        subtitle="Quick answers before you start."
      />
      <div className="mx-auto max-w-2xl space-y-3 px-4 py-12">
        {FAQS.map(([q, a]) => (
          <details key={q} className="rounded-lg border p-4">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
