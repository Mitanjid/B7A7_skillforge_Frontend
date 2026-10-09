import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/logout`,
    {
      method: "POST",
      headers: { Cookie: req.headers.get("cookie") ?? "" },
      signal: AbortSignal.timeout(60_000),
    },
  );

  const json = await backendRes.json().catch(() => null);
  const res = NextResponse.json(
    json ?? { success: true, message: "Logged out", data: null },
    { status: backendRes.status },
  );

  for (const cookie of backendRes.headers.getSetCookie()) {
    res.headers.append("Set-Cookie", cookie);
  }

  return res;
}
