import { FileText } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SearchInput } from "@/components/shared/search-input";
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
import type { Problem } from "@/types/api";
import { ProblemRowActions } from "./problem-row-actions";

export const metadata = { title: "Problems" };

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: string;
    difficulty?: string;
  }>;
}

export default async function ProblemsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const res = await serverFetch<Problem[]>("/problems", {
    page,
    limit: 5,
    search: sp.search,
    type: sp.type,
    difficulty: sp.difficulty,
  });

  const problems = res.data;
  const meta = res.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Problems</h1>

        <Button
          nativeButton={false}
          render={<Link href="/company/problems/new" />}
        >
          New problem
        </Button>
      </div>

      <SearchInput placeholder="Search problems..." />

      <Card>
        <CardContent className="p-0">
          {problems.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={FileText}
                title="No problems yet"
                description="Create your first problem to start building assessments."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {problems.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell>{p.type}</TableCell>
                    <TableCell>{p.difficulty}</TableCell>
                    <TableCell>{p.marks ?? "—"}</TableCell>
                    <TableCell>
                      <ProblemRowActions problemId={p.id} />
                    </TableCell>
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
