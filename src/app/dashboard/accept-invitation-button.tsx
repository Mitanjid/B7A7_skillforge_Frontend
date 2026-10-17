"use client";

import { CircleNotch, Envelope } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useAcceptInvitation } from "@/hooks/use-invitation-preview";

export function AcceptInvitationButton({ token }: { token: string }) {
  const accept = useAcceptInvitation(token);

  return (
    <Button
      size="sm"
      disabled={accept.isPending}
      onClick={() => accept.mutate()}
    >
      {accept.isPending ? (
        <CircleNotch className="mr-2 size-4 animate-spin" />
      ) : (
        <Envelope className="mr-2 size-4" />
      )}
      Accept
    </Button>
  );
}
