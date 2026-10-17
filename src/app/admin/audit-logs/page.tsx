import { Scroll } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SearchInput } from "@/components/shared/search-input";
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
import type { AuditLog } from "@/types/api";

export const metadata = { title: "Audit logs" };

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AuditLogsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  // The backend filters by `action`; the shared SearchInput writes `search`.
  const res = await serverFetch<AuditLog[]>("/admin/audit-logs", {
    page,
    limit: 20,
    action: sp.search,
  });
  const logs = res.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Audit logs</h1>
      <SearchInput placeholder="Filter by action, e.g. USER_SUSPENDED" />

      <Card>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Scroll}
                title="No audit entries"
                description="Admin actions will be recorded here."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs">
                      {l.action}
                    </TableCell>
                    <TableCell>{l.user?.email ?? "system"}</TableCell>
                    <TableCell>{l.entityType ?? "—"}</TableCell>
                    <TableCell>
                      {new Date(l.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {res.meta && (
        <PaginationControls
          page={res.meta.page}
          totalPages={res.meta.totalPages}
        />
      )}
    </div>
  );
}
