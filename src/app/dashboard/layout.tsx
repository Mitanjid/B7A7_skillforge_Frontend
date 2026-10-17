import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("CANDIDATE");

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
