"use client";

import { CircleNotch } from "@phosphor-icons/react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useGoogleLogin } from "@/hooks/use-google-login";

interface GoogleIdApi {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }) => void;
  renderButton: (
    element: HTMLElement,
    options: Record<string, string | number>,
  ) => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdApi } };
  }
}

interface GoogleButtonProps {
  // Needed only for first-time sign-up. Omit it on the login page.
  role?: "CANDIDATE" | "COMPANY";
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleButton({ role }: GoogleButtonProps) {
  const { mutate, isPending } = useGoogleLogin();
  const containerRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef(role);
  const [ready, setReady] = useState(false);

  // The Google callback is registered once, so it reads the latest role from a ref.
  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    if (window.google) setReady(true);
  }, []);

  useEffect(() => {
    const google = window.google;
    if (!ready || !google || !CLIENT_ID || !containerRef.current) return;

    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: ({ credential }) =>
        mutate({ idToken: credential, role: roleRef.current }),
    });
    google.accounts.id.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: 320,
    });
  }, [ready, mutate]);

  if (!CLIENT_ID) return null;

  return (
    <div className="space-y-2">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={containerRef} className="flex min-h-10 justify-center" />
      {isPending && (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CircleNotch className="size-4 animate-spin" /> Signing you in…
        </p>
      )}
    </div>
  );
}
