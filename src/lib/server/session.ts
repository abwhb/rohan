import { cookies } from "next/headers";

import { SESSION_COOKIE, verifySessionValue } from "@/src/lib/server/auth";

export async function getStudyRole() {
  const cookieStore = await cookies();
  return verifySessionValue(cookieStore.get(SESSION_COOKIE)?.value);
}
