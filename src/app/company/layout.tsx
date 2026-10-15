import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/guard";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("COMPANY");

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
