import { Users } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
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
import type { AdminUser } from "@/types/api";
import { UserStatusToggle } from "./user-status-toggle";

export const metadata = { title: "Users" };

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    isActive?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const res = await serverFetch<AdminUser[]>("/admin/users", {
    page,
    limit: 10,
    search: sp.search,
    role: sp.role,
    isActive: sp.isActive,
  });
  const users = res.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="Search by email..." />
        <FilterSelect
          param="role"
          label="All roles"
          options={[
            { value: "CANDIDATE", label: "Candidates" },
            { value: "COMPANY", label: "Companies" },
            { value: "ADMIN", label: "Admins" },
          ]}
        />
        <FilterSelect
          param="isActive"
          label="Any status"
          options={[
            { value: "true", label: "Active" },
            { value: "false", label: "Suspended" },
          ]}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Users}
                title="No users found"
                description="Try changing your search or filters."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-28" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.candidateProfile?.fullName ??
                        u.companyProfile?.companyName ??
                        "—"}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{u.role}</Badge>
                    </TableCell>
                    <TableCell>{u.isActive ? "Active" : "Suspended"}</TableCell>
                    <TableCell>
                      <UserStatusToggle
                        userId={u.id}
                        isActive={u.isActive}
                        disabled={u.role === "ADMIN"}
                      />
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
