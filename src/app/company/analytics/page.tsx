import {
  ClipboardText,
  CreditCard,
  PaperPlaneTilt,
} from "@phosphor-icons/react/dist/ssr";
import { BarBlock, PieBlock } from "@/components/charts/admin-charts";
import { StatCard } from "@/components/shared/stat-card";
import { serverFetch } from "@/lib/server-api";
import type { Assessment, Payment } from "@/types/api";

export const metadata = { title: "Analytics" };

export default async function CompanyAnalyticsPage() {
  const [assessments, payments] = await Promise.all([
    serverFetch<Assessment[]>("/assessments", { limit: 100 }),
    serverFetch<Payment[]>("/payments/my", { limit: 100 }),
  ]);

  const spent = payments.data
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const count = (s: Assessment["status"]) =>
    assessments.data.filter((a) => a.status === s).length;

  const byStatus = [
    { name: "Draft", value: count("DRAFT") },
    { name: "Published", value: count("PUBLISHED") },
    { name: "Closed", value: count("CLOSED") },
  ];

  const marksData = assessments.data.slice(0, 8).map((a) => ({
    name: a.title.length > 14 ? `${a.title.slice(0, 14)}…` : a.title,
    value: a.totalMarks,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Assessments"
          value={assessments.data.length}
          icon={ClipboardText}
        />
        <StatCard
          label="Published"
          value={count("PUBLISHED")}
          icon={PaperPlaneTilt}
        />
        <StatCard label="Total spent" value={`৳${spent}`} icon={CreditCard} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <PieBlock title="Assessments by status" data={byStatus} />
        <BarBlock title="Total marks per assessment" data={marksData} />
      </div>
    </div>
  );
}
