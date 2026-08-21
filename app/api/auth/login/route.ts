import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  authIsConfigured,
  createSessionValue,
  roleForAccessCode,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/src/lib/server/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!authIsConfigured()) {
    return NextResponse.json({ error: "Cloud access is not configured." }, { status: 503 });
  }

  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.code !== "string" || body.code.length < 8 || body.code.length > 100) {
    return NextResponse.json({ error: "Enter a valid access code." }, { status: 400 });
  }
  const role = roleForAccessCode(body.code);
  if (!role) return NextResponse.json({ error: "Access code not recognised." }, { status: 401 });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionValue(role), sessionCookieOptions);
  return NextResponse.json({ role }, { headers: { "Cache-Control": "no-store" } });
}
