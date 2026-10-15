import type { Metadata } from "next";

import {
  AdminHome,
  CandidateHome,
  CompanyHome,
} from "@/components/home/role-home";
import { getCurrentUser } from "@/lib/get-user";
import { Landing } from "@/components/home/landing";

export const metadata: Metadata = {
  title: "Developer assessments, done right",
  description:
    "Build assessments from MCQ and written problems, invite candidates by email, auto-grade MCQs and review written answers.",
  openGraph: {
    title: "SkillForge",
    description: "The developer assessment platform.",
  },
};

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) return <Landing />;

  switch (user.role) {
    case "CANDIDATE":
      return <CandidateHome user={user} />;
    case "COMPANY":
      return <CompanyHome user={user} />;
    case "ADMIN":
      return <AdminHome user={user} />;
  }
}
