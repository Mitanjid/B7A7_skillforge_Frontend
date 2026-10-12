import type { Metadata } from "next";
import { RegisterView } from "./register-view";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a SkillForge account as a candidate or a company.",
};

export default function RegisterPage() {
  return <RegisterView />;
}
