import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") ?? "",
      },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(60_000),
    },
  );

  const json = await backendRes.json().catch(() => null);
  const res = NextResponse.json(
    json ?? { success: false, message: "Session expired", errors: [] },
    { status: backendRes.status },
  );

  for (const cookie of backendRes.headers.getSetCookie()) {
    res.headers.append("Set-Cookie", cookie);
  }

  return res;
}
