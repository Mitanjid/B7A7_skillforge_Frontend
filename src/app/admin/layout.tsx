import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/guard";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await requireRole("ADMIN");

	return <DashboardShell user={user}>{children}</DashboardShell>;
}
