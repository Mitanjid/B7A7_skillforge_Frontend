import { ListChecks } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { serverFetch } from "@/lib/server-api";
import type { Assessment } from "@/types/api";

export const metadata = { title: "Assessments" };

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
}

export default async function AssessmentsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const res = await serverFetch<Assessment[]>("/assessments", {
    page,
    limit: 5,
    status: sp.status,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const assessments = res.data;
  const meta = res.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Assessments</h1>

        <Button
          nativeButton={false}
          render={<Link href="/company/assessments/new" />}
        >
          New assessment
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {assessments.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={ListChecks}
                title="No assessments yet"
                description="Create an assessment, attach problems, then publish it."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Total marks</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {assessments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/company/assessments/${a.id}`}
                        className="hover:underline"
                      >
                        {a.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                    <TableCell>{a.durationMinutes} min</TableCell>
                    <TableCell>{a.totalMarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {meta && (
        <PaginationControls page={meta.page} totalPages={meta.totalPages} />
      )}
    </div>
  );
}
