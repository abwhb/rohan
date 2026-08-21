import { NextResponse } from "next/server";

import { databaseIsConfigured, getCloudStudyState, saveCloudStudyState } from "@/src/lib/server/database";
import { getStudyRole } from "@/src/lib/server/session";
import { isStudyStatePayload, normaliseStudyState } from "@/src/lib/study-state";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 1_000_000;

function accountId() {
  return process.env.STUDY_ACCOUNT_ID || "rohan";
}

export async function GET() {
  const role = await getStudyRole();
  if (!role) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!databaseIsConfigured()) return NextResponse.json({ error: "Cloud tracking is unavailable." }, { status: 503 });

  try {
    const cloud = await getCloudStudyState(accountId());
    return NextResponse.json(
      cloud ?? { state: null, revision: 0, updatedAt: null },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Cloud tracking is temporarily unavailable." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const role = await getStudyRole();
  if (!role) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (role !== "student") return NextResponse.json({ error: "Teacher access is read-only." }, { status: 403 });
  if (!databaseIsConfigured()) return NextResponse.json({ error: "Cloud tracking is unavailable." }, { status: 503 });

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return NextResponse.json({ error: "Progress payload is too large." }, { status: 413 });

  let body: { state?: unknown; baseRevision?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isStudyStatePayload(body.state) || !Number.isInteger(body.baseRevision) || Number(body.baseRevision) < 0) {
    return NextResponse.json({ error: "Invalid progress payload." }, { status: 400 });
  }
  const state = normaliseStudyState(body.state);
  if (JSON.stringify(state).length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Progress payload is too large." }, { status: 413 });
  }

  try {
    const result = await saveCloudStudyState(accountId(), state, Number(body.baseRevision));
    if (result.conflict) {
      return NextResponse.json(
        { state: result.state, revision: result.revision, error: "Cloud progress changed on another device." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Cloud tracking is temporarily unavailable." }, { status: 503 });
  }
}
