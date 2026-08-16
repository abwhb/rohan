import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLessonPrompt,
  normalizeSpec,
  parseArgs,
  slugify,
} from "../src/generate-voice-lesson.mjs";

test("parses flags and values", () => {
  assert.deepEqual(parseArgs(["--spec", "lesson.json", "--dry-run"]), {
    spec: "lesson.json",
    dryRun: true,
  });
});

test("rejects a lesson without its required paper", () => {
  assert.throws(
    () => normalizeSpec({ subject: "AS Mathematics", topic: "Quadratics", minutes: 7 }),
    /paper is required/i,
  );
});

test("builds a constrained Cambridge lesson prompt", () => {
  const spec = normalizeSpec({
    subject: "AS Mathematics",
    paper: "9709/12",
    topic: "Quadratics",
    minutes: 6,
  });
  const prompt = buildLessonPrompt(spec);

  assert.match(prompt, /9709\/12/);
  assert.match(prompt, /approximately 750 words/);
  assert.match(prompt, /original examples/i);
});

test("creates safe output slugs", () => {
  assert.equal(slugify("Quadratics: b² − 4ac"), "quadratics-b2-4ac");
});
