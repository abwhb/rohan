import assert from "node:assert/strict";
import test from "node:test";

import {
  authIsConfigured,
  createSessionValue,
  roleForAccessCode,
  verifySessionValue,
} from "../src/lib/server/auth.ts";

test("creates and verifies signed role sessions", () => {
  const previous = {
    AUTH_SECRET: process.env.AUTH_SECRET,
    STUDENT_ACCESS_CODE: process.env.STUDENT_ACCESS_CODE,
    TEACHER_ACCESS_CODE: process.env.TEACHER_ACCESS_CODE,
  };
  process.env.AUTH_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";
  process.env.STUDENT_ACCESS_CODE = "student-test-code";
  process.env.TEACHER_ACCESS_CODE = "teacher-test-code";

  try {
    assert.equal(authIsConfigured(), true);
    assert.equal(roleForAccessCode("student-test-code"), "student");
    assert.equal(roleForAccessCode("teacher-test-code"), "teacher");
    assert.equal(roleForAccessCode("incorrect-code"), null);

    const now = Date.now();
    const session = createSessionValue("student", now);
    assert.equal(verifySessionValue(session, now + 1000), "student");
    assert.equal(verifySessionValue(`${session}tampered`, now + 1000), null);
    assert.equal(verifySessionValue(session, now + 31 * 24 * 60 * 60 * 1000), null);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
