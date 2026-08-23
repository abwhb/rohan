import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE, sessionCookieOptions } from "@/src/lib/server/auth";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
