import { type NextRequest, NextResponse } from "next/server";
import type { Role } from "@/types/api";

const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  COMPANY: "/company",
  CANDIDATE: "/dashboard",
};

const PROTECTED: Record<string, Role> = {
  "/admin": "ADMIN",
  "/company": "COMPANY",
  "/dashboard": "CANDIDATE",
};

const AUTH_PAGES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

function readSession(token?: string): { role: Role } | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const data = JSON.parse(atob(payload)) as { role?: Role; exp?: number };
    if (!data.role || (data.exp && data.exp * 1000 < Date.now())) return null;
    return { role: data.role };
  } catch {
    return null;
  }
}

export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const session = readSession(req.cookies.get("accessToken")?.value);

  if (AUTH_PAGES.includes(pathname)) {
    return session
      ? NextResponse.redirect(new URL(ROLE_HOME[session.role], req.url))
      : NextResponse.next();
  }

  const prefix = Object.keys(PROTECTED).find(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!prefix) return NextResponse.next();

  if (!session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  if (session.role !== PROTECTED[prefix]) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role], req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/company/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ],
};
