"use client";

import { CircleNotch, PaperPlaneTilt } from "@phosphor-icons/react";
import { use, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useAssessmentInvitations,
  useInviteCandidates,
} from "@/hooks/use-invitations";
import { inviteCandidatesSchema } from "@/lib/validations/assessment";

export default function InvitationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: invitations, isLoading } = useAssessmentInvitations(id);
  const invite = useInviteCandidates(id);
  const [raw, setRaw] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = [
      ...new Set(
        raw
          .split(/[\s,;]+/)
          .map((x) => x.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];

    const parsed = inviteCandidatesSchema.safeParse({ emails });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the email list");
      return;
    }

    invite.mutate(parsed.data, { onSuccess: () => setRaw("") });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Invitations</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invite candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Textarea
              rows={4}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="Paste emails separated by commas, spaces or new lines"
            />
            <Button type="submit" disabled={invite.isPending || !raw.trim()}>
              {invite.isPending ? (
                <CircleNotch className="mr-2 size-4 animate-spin" />
              ) : (
                <PaperPlaneTilt className="mr-2 size-4" />
              )}
              Send invitations
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sent invitations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && <Skeleton className="m-4 h-32" />}
          {!isLoading && (invitations ?? []).length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">
              No invitations sent yet.
            </p>
          )}
          {!isLoading && (invitations ?? []).length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations?.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.email}</TableCell>
                    <TableCell>
                      <StatusBadge status={inv.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(inv.expiresAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
