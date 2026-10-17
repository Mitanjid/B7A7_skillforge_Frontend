import {
  ChartLineUp,
  ClipboardText,
  FileText,
  Users,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serverFetch } from "@/lib/server-api";
import type { Assessment } from "@/types/api";

export const metadata = { title: "Overview" };

export default async function CompanyOverviewPage() {
  const res = await serverFetch<Assessment[]>("/assessments", {
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const assessments = res.data;
  const total = res.meta?.total ?? assessments.length;
  const published = assessments.filter((a) => a.status === "PUBLISHED").length;
  const draft = assessments.filter((a) => a.status === "DRAFT").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <Link href="/company/assessments/new" className={buttonVariants()}>
          New assessment
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total assessments
            </CardTitle>
            <ClipboardText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{total}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
            <ChartLineUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{published}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{draft}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Candidates reached
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">—</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent assessments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {assessments.length === 0 && (
            <p className="text-sm text-muted-foreground">No assessments yet.</p>
          )}

          {assessments.map((a) => (
            <Link
              key={a.id}
              href={`/company/assessments/${a.id}`}
              className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted/50"
            >
              <span className="font-medium">{a.title}</span>
              <StatusBadge status={a.status} />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
