import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/verify-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    },
  );

  const json = await backendRes.json().catch(() => null);
  const res = NextResponse.json(
    json ?? {
      success: false,
      message: "Invalid response from server",
      errors: [],
    },
    { status: backendRes.status },
  );

  for (const cookie of backendRes.headers.getSetCookie()) {
    res.headers.append("Set-Cookie", cookie);
  }

  return res;
}
