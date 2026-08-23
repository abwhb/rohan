import { NextResponse } from "next/server";

import { authIsConfigured } from "@/src/lib/server/auth";
import { databaseIsConfigured } from "@/src/lib/server/database";
import { getStudyRole } from "@/src/lib/server/session";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      configured: authIsConfigured() && databaseIsConfigured(),
      role: await getStudyRole(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
