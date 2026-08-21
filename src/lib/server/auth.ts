import { createHmac, timingSafeEqual } from "node:crypto";

export type StudyRole = "student" | "teacher";

export const SESSION_COOKIE = "rohan_study_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) return null;
  return value;
}

function signature(payload: string, authSecret: string) {
  return createHmac("sha256", authSecret).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function authIsConfigured() {
  return Boolean(secret() && process.env.STUDENT_ACCESS_CODE && process.env.TEACHER_ACCESS_CODE);
}

export function roleForAccessCode(code: string): StudyRole | null {
  const studentCode = process.env.STUDENT_ACCESS_CODE;
  const teacherCode = process.env.TEACHER_ACCESS_CODE;
  if (!studentCode || !teacherCode) return null;
  if (safeEqual(code, studentCode)) return "student";
  if (safeEqual(code, teacherCode)) return "teacher";
  return null;
}

export function createSessionValue(role: StudyRole, now = Date.now()) {
  const authSecret = secret();
  if (!authSecret) throw new Error("Authentication is not configured.");
  const payload = Buffer.from(JSON.stringify({ role, expiresAt: now + SESSION_MAX_AGE_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${signature(payload, authSecret)}`;
}

export function verifySessionValue(value: string | undefined, now = Date.now()): StudyRole | null {
  const authSecret = secret();
  if (!authSecret || !value) return null;
  const [payload, suppliedSignature, extra] = value.split(".");
  if (!payload || !suppliedSignature || extra || !safeEqual(suppliedSignature, signature(payload, authSecret))) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      role?: unknown;
      expiresAt?: unknown;
    };
    if ((parsed.role !== "student" && parsed.role !== "teacher") || typeof parsed.expiresAt !== "number") return null;
    return parsed.expiresAt > now ? parsed.role : null;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  maxAge: SESSION_MAX_AGE_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
