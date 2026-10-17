import {
	ClipboardText,
	CurrencyCircleDollar,
	Files,
	Users,
} from "@phosphor-icons/react/dist/ssr";
import { AssessmentsBar, UsersPie } from "@/components/charts/admin-charts";
import { StatCard } from "@/components/shared/stat-card";
import { serverFetch } from "@/lib/server-api";
import type { AdminStats } from "@/types/api";

export const metadata = { title: "Admin overview" };

export default async function AdminOverviewPage() {
	const { data: stats } = await serverFetch<AdminStats>(
		"/admin/dashboard-stats",
	);

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Platform overview</h1>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard label="Total users" value={stats.users.total} icon={Users} />
				<StatCard
					label="Assessments"
					value={stats.assessments.total}
					icon={ClipboardText}
				/>
				<StatCard label="Attempts" value={stats.attempts.total} icon={Files} />
				<StatCard
					label="Revenue"
					value={`৳${stats.revenue.totalAmount}`}
					hint={`${stats.revenue.successfulPayments} payments`}
					icon={CurrencyCircleDollar}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<UsersPie stats={stats} />
				<AssessmentsBar stats={stats} />
			</div>
		</div>
	);
}
