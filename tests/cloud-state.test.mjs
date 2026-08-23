import assert from "node:assert/strict";
import test from "node:test";

import { mergeStudyStates, normaliseStudyState } from "../src/lib/study-state.ts";

test("normalises legacy browser progress into version 3 safely", () => {
  const state = normaliseStudyState({
    version: 2,
    topics: {
      "p1-quadratics": {
        completedObjectives: ["objective"],
        completedWork: ["recall"],
        completedResources: [],
        lessonAttempts: {},
        latestScore: 150,
        attempts: 1,
        updatedAt: "2026-08-16T10:00:00.000Z",
      },
    },
    sessions: [],
  });

  assert.equal(state.version, 3);
  assert.equal(state.topics["p1-quadratics"].latestScore, 100);
  assert.deepEqual(state.topics["p1-quadratics"].questionAttempts, {});
});

test("merges offline and cloud evidence without dropping unique sessions", () => {
  const local = normaliseStudyState({
    topics: {
      "p1-quadratics": {
        completedObjectives: ["local objective"],
        completedWork: [],
        completedResources: [],
        lessonAttempts: {},
        questionAttempts: { q1: { attempts: 2, correct: 1, updatedAt: "2026-08-16T10:00:00.000Z" } },
        latestScore: 60,
        attempts: 1,
        updatedAt: "2026-08-16T10:00:00.000Z",
      },
    },
    sessions: [{
      id: "local-session",
      date: "2026-08-16",
      topicId: "p1-quadratics",
      workId: "recall",
      focusedMinutes: 10,
      questionsAttempted: 2,
      correctAnswers: 1,
      mistakeType: "method",
      note: "local",
      createdAt: "2026-08-16T10:00:00.000Z",
    }],
  });
  const cloud = normaliseStudyState({
    topics: {
      "p1-quadratics": {
        completedObjectives: ["cloud objective"],
        completedWork: ["exam"],
        completedResources: [],
        lessonAttempts: {},
        questionAttempts: { q1: { attempts: 1, correct: 1, updatedAt: "2026-08-16T09:00:00.000Z" } },
        latestScore: 70,
        attempts: 2,
        updatedAt: "2026-08-16T11:00:00.000Z",
      },
    },
    sessions: [{
      id: "cloud-session",
      date: "2026-08-16",
      topicId: "p1-quadratics",
      workId: "exam",
      focusedMinutes: 35,
      questionsAttempted: 5,
      correctAnswers: 4,
      mistakeType: "none",
      note: "cloud",
      createdAt: "2026-08-16T11:00:00.000Z",
    }],
  });

  const merged = mergeStudyStates(local, cloud);
  const progress = merged.topics["p1-quadratics"];
  assert.deepEqual(new Set(progress.completedObjectives), new Set(["local objective", "cloud objective"]));
  assert.deepEqual(progress.completedWork, ["exam"]);
  assert.equal(progress.questionAttempts.q1.attempts, 2);
  assert.equal(progress.latestScore, 70);
  assert.deepEqual(merged.sessions.map(({ id }) => id), ["local-session", "cloud-session"]);
});
