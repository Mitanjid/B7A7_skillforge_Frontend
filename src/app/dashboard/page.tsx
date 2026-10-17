import { ClipboardText, Envelope } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serverFetch } from "@/lib/server-api";
import type { Attempt, Invitation } from "@/types/api";
import { AcceptInvitationButton } from "./accept-invitation-button";
import { StartAttemptButton } from "./start-attempt-button";

export const metadata = { title: "Overview" };

export default async function CandidateOverviewPage() {
  const [invRes, pendingRes, attRes] = await Promise.all([
    serverFetch<Invitation[]>("/invitations/my", {
      limit: 20,
      status: "ACCEPTED",
    }),
    serverFetch<Invitation[]>("/invitations/my", {
      limit: 20,
      status: "PENDING",
    }),
    serverFetch<Attempt[]>("/attempts/my", { limit: 20 }),
  ]);

  // Accepted invitations that already have an attempt can't be started again.
  const startedInvitationIds = new Set(attRes.data.map((a) => a.invitationId));
  const readyToStart = invRes.data.filter(
    (i) => !startedInvitationIds.has(i.id),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Envelope className="size-4" />
            Pending invitations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pendingRes.data.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No pending invitations. When a company invites your email, it will
              show up here.
            </p>
          )}
          {pendingRes.data.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"
            >
              <div>
                <p className="font-medium">{inv.assessment?.title}</p>
                <p className="text-xs text-muted-foreground">
                  {inv.assessment?.durationMinutes} minutes · expires{" "}
                  {new Date(inv.expiresAt).toLocaleDateString("en-GB")}
                </p>
              </div>
              <AcceptInvitationButton token={inv.token} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Envelope className="size-4" />
            Ready to start
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {readyToStart.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nothing ready yet. Accept a pending invitation above to start it.
            </p>
          )}
          {readyToStart.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between rounded-md border p-3 text-sm"
            >
              <div>
                <p className="font-medium">{inv.assessment?.title}</p>
                <p className="text-xs text-muted-foreground">
                  {inv.assessment?.durationMinutes} minutes
                </p>
              </div>
              <StartAttemptButton invitationId={inv.id} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardText className="size-4" />
            Recent attempts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {attRes.data.length === 0 && (
            <p className="text-sm text-muted-foreground">No attempts yet.</p>
          )}
          {attRes.data.slice(0, 5).map((a) => (
            <Link
              key={a.id}
              href={
                a.status === "IN_PROGRESS"
                  ? `/dashboard/attempts/${a.id}/take`
                  : `/dashboard/attempts/${a.id}`
              }
              className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted/50"
            >
              <span className="font-medium">{a.assessment?.title}</span>
              <StatusBadge status={a.status} />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
