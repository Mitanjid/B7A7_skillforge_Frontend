import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginView } from "./login-view";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to SkillForge or try a one-click demo for any role.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
