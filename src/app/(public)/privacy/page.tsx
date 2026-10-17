import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What data SkillForge collects and why.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy policy" subtitle="Last updated October 2026" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-sm text-muted-foreground">
        <p>
          We store your name, email, profile details and the answers you submit
          so that assessments can be graded and reviewed.
        </p>
        <p>
          Companies can see the results of candidates they invited. Tab-switch
          counts are recorded during attempts for integrity review.
        </p>
        <p>
          Authentication uses secure, httpOnly cookies. We never store passwords
          in plain text.
        </p>
        <p>
          Payments are processed by SSLCommerz; we do not store card details.
        </p>
      </div>
    </>
  );
}
