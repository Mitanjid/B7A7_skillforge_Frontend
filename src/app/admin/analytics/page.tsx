import {
	CurrencyCircleDollar,
	EnvelopeSimple,
	FileText,
} from "@phosphor-icons/react/dist/ssr";
import {
	AssessmentsBar,
	AttemptsBar,
	UsersPie,
} from "@/components/charts/admin-charts";
import { StatCard } from "@/components/shared/stat-card";
import { serverFetch } from "@/lib/server-api";
import type { AdminStats } from "@/types/api";

export const metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage() {
	const { data: stats } = await serverFetch<AdminStats>(
		"/admin/dashboard-stats",
	);

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Analytics</h1>

			<div className="grid gap-4 sm:grid-cols-3">
				<StatCard
					label="Problems created"
					value={stats.totalProblems}
					icon={FileText}
				/>
				<StatCard
					label="Invitations sent"
					value={stats.totalInvitations}
					icon={EnvelopeSimple}
				/>
				<StatCard
					label="Successful payments"
					value={stats.revenue.successfulPayments}
					icon={CurrencyCircleDollar}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<UsersPie stats={stats} />
				<AssessmentsBar stats={stats} />
				<AttemptsBar stats={stats} />
			</div>
		</div>
	);
}
